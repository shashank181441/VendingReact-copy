import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { useMutation, useQuery } from '@tanstack/react-query';
import { initiatePayment, finalizePayment, clearCart, getCartItems } from '../../api/api'; // Add clearCart import
import { MoveLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LoadingComp from '../../components/LoadingComp';

const Checkout = () => {
  const [qrCodeImage, setQrCodeImage] = useState('');
  const [orderId, setOrderId] = useState('');
  const [ wsUrl, setWsUrl] = useState('');
  const [isScanned, setIsScanned] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [countdownText, setCountdownText] = useState("Time remaining"); // Countdown state in seconds (2 mins)
  const [countdown, setCountdown] = useState(120); // Countdown state in seconds (2 mins)
  const navigate = useNavigate();
  const machineId = localStorage.getItem("machineId")


  // Mutation to initiate the payment request
  const paymentMutation = useMutation({
    mutationFn: initiatePayment,
    onSuccess: async (response) => {
      const data = response.data.data;
      console.log(response)
      // sendSerialData('x');

      setOrderId(data.prn);
      setWsUrl(data.wsUrl);

      if (data.qrMessage) {
        const qrCode = await QRCode.toDataURL(data.qrMessage, {
          width: 420, // Adjust size as needed
          margin: 1,
        });
        console.log(qrCode)
        setQrCodeImage(qrCode);
        
        // Open a WebSocket connection
        const ws = new WebSocket(data.wsUrl);
        
        ws.onmessage = async (event) => {
          const jsonData = JSON.parse(event.data);
          console.log("Received WebSocket message:", jsonData);
          
          // Check if transactionStatus is present in the WebSocket message
          if (jsonData.transactionStatus) {
            const status = JSON.parse(jsonData.transactionStatus);
            console.log("Parsed transaction status:", status);
        
            if (status.qrVerified) {
              setIsScanned(true);
              console.log("QR code has been scanned.");
            }
            
            console.log(status.paymentSuccess);
        
            // Check if paymentSuccess is true
            if (status.paymentSuccess) {
              console.log("Payment is successful.");
              setPaymentSuccess(true);
      
              // Call finalizePayment and set paymentSuccess state
              await finalizePayment().then((res) => {
                console.log("Payment finalized successfully", res);
                setPaymentSuccess(true); // Mark payment as successful
                setCountdownText("Returning to home in")
                setCountdown(30)
                // console.log(JSON.stringify(res.data.data.pnAndQnty))
                // sendSerialData(JSON.stringify(res.data.data.pnAndQnty));
                setTimeout(async () => {
                  navigate('/home'); // Redirect to home page
                }, 30000); // .25 minutes in milliseconds
              }).catch((error) => {
                console.error("Error finalizing payment:", error);
              });
            } else {
              console.log("Payment was not successful.");
            }
          } else {
            console.log("QR code scanned without payment information.");
            setIsScanned(true);
          }
        };
        
        ws.onerror = (error) => {
          console.error("WebSocket error:", error);
        };

        ws.onclose = () => {
          console.log("WebSocket connection closed");
        };

      } else {
        console.error("QR message is not available.");
        alert("QR message is not available.");
      }
    },
    onError: (error) => {
      console.error("Error initiating payment:", error.message);
      alert("Error initiating payment.");
    },
  });

  const {
    data: cartItems,
    isLoading: cartLoading,
    error: cartError, refetch: cartRefetch
  } = useQuery({ queryKey: ["cartItems", machineId], queryFn: getCartItems });

  // Effect to start countdown
  useEffect(() => {
    paymentMutation.mutate();
    
    const interval = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);
    
    const timeout = setTimeout(async () => {
      await clearCart();
      navigate('/home');
    }, 12000000);
  
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);
  
  

  return (
    <div className="bg-gray-100 flex justify-center items-center h-screen relative">
      {/* Always visible Return to Cart button */}
      <div className="mx-auto shadow-2xl w-5/6 flex-col justify-center text-center items-center p-8">
        <div className='flex justify-between'>
          <button
            onClick={() => navigate("/carts")}
            className=" text-white px-4 py-2 rounded">
            <MoveLeft className='h-6 w-6 text-black'/>
          </button>

          <button
            onClick={() => navigate("/home")}
            className=" text-white bg-blue-500 px-4 py-2 rounded">
            Home
          </button>
        </div>
        <h1 className="text-orange-500 text-xl my-4">
          Order Id: {orderId || 'Loading...'}
        </h1>
        <h1 className="text-black">We Accept</h1>
        <img
          className="h-12 w-auto mx-auto my-8"
          src="https://login.fonepay.com/assets/img/fonepay_payments_fatafat.png"
          alt="Fone Pay"
        />
        
        <h1 className="text-orange-500 text-3xl my-4">
          Nrs. {paymentMutation?.data?.data?.data?.amount}
        </h1>
        <p>
          Dispense will start automatically after successful payment. It
          may take time to reflect payment status. Please wait for at
          least 1 minute after successful payment.
        </p>
        <div className="text-red-500 text-xl my-4">
          {countdownText}: {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, '0')}
        </div>

        {paymentSuccess ? (
          <div className="text-green-500 text-xl mt-4">Payment Successful!</div>
        ) : isScanned ? (
          <div className="text-green-500 text-xl mt-4">
            QR Code Scanned! Processing payment...
          <div id="qrContainer" className="w-full flex justify-center mt-4">
            <img id="qrCodeImage" src={qrCodeImage} alt="QR Code" className="w-80 h-80" />
          </div>
          </div>
        ) : qrCodeImage ? (
          <div id="qrContainer" className="w-full flex justify-center mt-4">
            <img id="qrCodeImage" src={qrCodeImage} alt="QR Code" className="w-80 h-80" />
          </div>
        ) : (
          <div><LoadingComp /></div>
        )}
      </div>
    </div>
  );
};

export default Checkout;

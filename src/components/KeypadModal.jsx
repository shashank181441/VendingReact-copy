import { useNavigate } from 'react-router-dom';
import { Cross, Delete, X } from 'lucide-react';
import React from 'react';
import { addToCartByPN, clearCart } from '../api/api';
import { useQueryClient } from '@tanstack/react-query';

function KeypadModal({ inputValue, onInputChange, onClose, className, productLength, qty }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient()
  const machineId = localStorage.getItem("machineId")
  const handleButtonClick = (number) => {
    if (number === '') return;
    onInputChange(inputValue + number);
  };

  const handleDelete = () => {
    onInputChange(inputValue.slice(0, -1));
  };

  const buyByProductNumber = async () => {
    try {
      // Clear the cart first
      const clearCartResponse = await clearCart();
      console.log(clearCartResponse);
  
      // Add the product to the cart by product number
      const addToCartResponse = await addToCartByPN(parseInt(inputValue));
      console.log(addToCartResponse);
  
      // If both operations succeed, navigate to the checkout page
      navigate('/checkout');
    } catch (error) {
      console.error('Error during purchase process:', error);
    }
  };

  return (
    <div
      id="keypadModal"
      className={`fixed inset-x-0 bottom-0 bg-white p-6 rounded-t-lg shadow-lg transform transition-transform duration-300 ${
        className
      }`}
      style={{ transform: className === 'show' ? 'translateY(0)' : 'translateY(100%)' }}
    >
      <div className="w-80 mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Keypad</h3>
          <div id="closeKeypad" className="text-red-500 cursor-pointer" onClick={onClose}>
            <X />
          </div>
        </div>
        <input
          id="inputBar"
          type="text"
          value={inputValue}
          readOnly
          className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div id="keypadContainer" className="grid grid-cols-3 gap-4 mb-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0].map((num) =>
            num !== '' ? (
              <button
                key={num}
                className="bg-blue-500 text-white py-2 px-4 rounded-full text-xl h-16 w-16 flex items-center justify-center"
                onClick={() => handleButtonClick(num.toString())}
              >
                {num}
              </button>
            ) : 
              inputValue === "9876543210" ? (
                  <button key={"buttonKey"}
                    className="bg-green-500 text-white py-2 px-4 rounded-full text-xl h-16 w-16 flex items-center justify-center"
                    onClick={() => {
                      // queryClient.invalidateQueries(['products'])
                      navigate(`/admin/products/fillStock/${machineId}`)}}
                  >
                    Stock
                  </button>
              ) : <div key={num} className="invisible"></div>
            
          )}
          <button
            className="bg-red-500 text-white py-2 px-4 rounded-full text-xl h-16 w-16 flex items-center justify-center"
            onClick={handleDelete}
          >
            <Delete />
          </button>
        </div>

        <button
          className={`w-full py-3 text-white rounded-full text-xl ${
            productLength === 1 ? 'bg-orange-500 cursor-pointer' : 'bg-gray-400 cursor-not-allowed'
          }`}
          onClick={buyByProductNumber}
          disabled={productLength !== 1 && qty !== 0}
        >
          Buy Now
        </button>

        {/* Conditional button when inputValue length reaches 10 */}
        
      </div>
    </div>
  );
}

export default KeypadModal;

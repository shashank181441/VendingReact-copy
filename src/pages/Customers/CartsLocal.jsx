import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MoveLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { clearCart, finalizePayment, getCartItems, updateCartItem } from "../../api/api";
import CartItem from "../../components/CartItem";
import { initializeSerial } from "../../utils/SerialUtils";
import LoadingComp from "../../components/LoadingComp";
import CartItemOnClick from "../../components/CartItemOnClick";

const CartLocal = () => {
  const queryClient = useQueryClient();

  let {data: cartItems, isLoading: cartsLoading, error: CartFetchError, refetch} = useQuery({
    queryKey: ["cartItems"],
    queryFn: async () => {
      let response = {}
      response = await getCartItems();
      console.log(response?.data?.data);
      return response?.data?.data;
    },
    cacheTime: 0,
    refetchOnWindowFocus: "always",
    refetchOnReconnect: true,
  })

  useEffect(() => {
    queryClient.invalidateQueries(['cartItems'])
    refetch()
    return () => {
      queryClient.invalidateQueries(['cartItems'])
      queryClient.clear()
      cartItems={}
    }
  }, [])
  
  const navigate = useNavigate()
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Ensure cartItems is an array and calculate the total
    if (Array.isArray(cartItems)) {
      const newTotal = cartItems.reduce((acc, item) => {
        // Ensure item and item.productId are defined and valid
        return acc + (item.productId?.price ?? 0) * (item.quantity ?? 0);
      }, 0);

      setTotal(newTotal);
    }
  }, [cartItems]);

  if (cartsLoading) return <LoadingComp/>;
  if (CartFetchError) return <p>Error: {CartFetchError.message}</p>;

  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="flex justify-between">
        <Link to="/" className="mx-4">
          <MoveLeft className="h-6 w-6 text-gray-500" />
        </Link>
        <button
        onClick={()=>clearCart().then((res)=>{
          console.log(res)
          queryClient.invalidateQueries(["cartItems"])
          navigate("/")
        })}
        className="bg-orange-400 px-3 py-2 rounded-md transform transition-transform duration-200 active:scale-90">
        Clear Cart</button>
        </div>
        <h2 className="text-2xl font-extrabold font-mono tracking-tight text-gray-900 mb-8">
          Shopping cart
        </h2>

        <div className="mt-8">
          <div className="flow-root">
            <div id="cart-items" role="list" className="-my-6 divide-y divide-gray-200">
              {cartItems?.map((item) => (
                  <CartItem product={item} key={item._id} cartsLoading={cartsLoading} cartItems={cartItems}/>
              ))}
            </div>
          </div>
        </div>

        <div className=" px-4 py-6 sm:px-6">
          <div className="flex justify-between text-base font-medium text-gray-900">
            <p>Subtotal</p>
            <p id="subtotal">Rs. {total}</p>
          </div>
          <p className="mt-0.5 text-sm text-gray-500">
            Shipping and taxes calculated at checkout.
          </p>
          <div className="mt-6">
             <button
              onClick={()=>{
                navigate("/checkout")
              }}
              id="checkoutButton"
              className="w-full flex items-center justify-center disabled:bg-orange-200 rounded-md border border-transparent bg-orange-400 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-orange-500"
              disabled={cartItems.length === 0}
            >
              Checkout
            </button>  
            <button onClick={async ()=>{
              await finalizePayment()
              navigate("/")
            }}
            className="w-full flex items-center justify-center disabled:bg-orange-200 rounded-md border border-transparent bg-orange-400 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-orange-500"
            >Test only
            </button>
          </div>
          <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
            <p>
              <Link to="/" type="button" className="font-medium text-orange-600 hover:text-orange-500">
                Continue Shopping <span aria-hidden="true"> &rarr;</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// CartItem Component



export default CartLocal;

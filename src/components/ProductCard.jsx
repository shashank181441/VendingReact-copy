import React from "react";
import CartIcon from "../assets/Cart1.png";
import { useMutation } from "@tanstack/react-query";
import { addToCart } from "../api/api";

function ProductCard({ product, myCart, setMyCart, setIsChanged, refetch }) {
  const isOutOfStock = product.stock === 0;

  // Simplified mutation for adding to cart
  const { mutate: addToCartMutate, isPending } = useMutation({
    mutationFn: () => addToCart(product._id),
    onSuccess: async () => {
      setIsChanged(true);

      // Update the frontend stock count for the product
      product.stock -= 1;

      // Update the cart state with the new product count
      const updatedCart = [...myCart];
      const cartItem = updatedCart.find((item) => item.productId === product._id);
      if (cartItem) {
        cartItem.quantity += 1;
      } else {
        updatedCart.push({ productId: product._id, quantity: 1 });
      }
      setMyCart(updatedCart);
    },
  });

  const manageAdd = () => {
    console.log("Cart State:", myCart);
  };

  manageAdd();

  let buttonLabel = isOutOfStock ? "Out of Stock" : "Add to Cart";
  if (isPending) {
  buttonLabel = "Adding...";
  refetch.cartRefetch()
  }
    

  return (
    <div className="group p-2 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="relative w-full h-40 overflow-hidden rounded-lg bg-gray-200">
        <img
          src={product.image_url}
          alt={`Image of ${product.name}`}
          className="w-full h-full object-cover group-hover:opacity-75"
        />
        <div className="absolute top-2 left-2 w-6 h-6 flex items-center justify-center rounded-full bg-gray-700 text-white text-xs">
          {product.productNumber}
        </div>
      </div>
      <div className="mt-2 text-left">
        <h3 className="text-md font-semibold text-gray-700 truncate">{product.name}</h3>
        <div className="flex justify-between text-sm">
          <p className="font-medium text-gray-900">Rs. {product.price}</p>
          <p className="text-gray-500">Qty: {product.stock}</p>
        </div>
      </div>
      <button
        className="w-full mt-2 py-3 px-4 flex items-center justify-center rounded bg-orange-400 text-white disabled:bg-orange-200 transition duration-300"
        onClick={() => addToCartMutate()}
        disabled={isOutOfStock || isPending}
      >
        <img src={CartIcon} alt="Cart" className="w-4 h-4" />
        <span className="ml-2 text-sm font-semibold">{buttonLabel}</span>
      </button>
    </div>
  );
}

export default ProductCard;

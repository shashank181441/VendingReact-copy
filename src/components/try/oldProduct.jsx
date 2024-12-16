import React from 'react';
import CartIcon from "../assets/Cart1.png";
import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import { addToCart } from '../api/api';

function ProductCard({ product, myCart, setIsChanged, refetch}) {
  const isOutOfStock = product.stock === 0;

  // Simplified mutation for adding to cart
  const { mutate: addToCartMutate, isPending } = useMutation({
    mutationFn: () => addToCart(product._id),
    onSuccess: async () => {
      setIsChanged(true)
      await refetch.productRefetch()
      await refetch.cartRefetch()

    },
  });


  const buttonLabel = isOutOfStock ? 'Out of Stock' : 'Add to Cart';

  return (
    <div className="group">
      <div>
      <div className="relative aspect-h-1 aspect-w-1 w-full h-64 overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7 z-10">
        <img src={product.image_url} alt={`Image of ${product.name}`} className="h-full w-full object-cover object-center group-hover:opacity-75" />
        <div className="absolute top-2 left-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-700 text-white text-sm font-semibold">
          {product.productNumber}
        </div>
      </div>
      <div className="w-full justify-between items-center">
        <h3 className="mt-4 text-md text-gray-700 text-xl font-sans font-semibold text-left">
          {product.name}
        </h3>
        <div className="flex justify-between">
          <p className="mt-1 text-lg font-medium text-gray-900 font-mono">Rs. {product.price}</p>
          <h5 className="text-sm font-light mt-2 font-mono">Qty: {product.stock}</h5>
        </div>
        </div>
        </div>
        <button
          className="w-full rounded-full bg-orange-400 mt-4 p-2 flex items-center justify-center space-x-2 disabled:bg-orange-200"
          onClick={() => addToCartMutate()}
          disabled={isOutOfStock || isPending}
        >
          <img src={CartIcon} alt="Cart" className="w-5 h-5" />
          <span className="mx-8 font-semibold">{buttonLabel}</span>
        </button>
    </div>
  );
}

export default ProductCard;

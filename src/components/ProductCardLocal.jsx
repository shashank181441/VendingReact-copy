import React, { useEffect, useState } from 'react';
import CartIcon from "../assets/Cart1.png";
import Ting from "../assets/ting.mp3";
import { Loader } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog'; // import the Dialog components

function ProductCardLocal({ product, myCart, setIsChanged, refetch, clear, totalLength: initialLength }) {
  const [localStock, setLocalStock] = useState(product.stock);
  const [total, setTotal] = useState(initialLength);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State for dialog visibility
  const isOutOfStock = localStock === 0;

  useEffect(() => {
    localStorage.removeItem('cart');
  }, []);

  const updateLocalStock = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItem = cart.find(item => item.productId === product._id);
    
    if (cartItem) {
      setLocalStock(product.stock - cartItem.quantity);
    } else {
      setLocalStock(product.stock);
    }
  };

  useEffect(() => {
    updateLocalStock();
  }, [myCart, product]);

  const handleAddToCart = () => {
    const localStorageCart = JSON.parse(localStorage.getItem('cart')) || [];
    let sum = 0, sumBackend = 0;
    myCart.forEach(cart => {
      sumBackend += cart.quantity;
    });
    localStorageCart.forEach(element => {
      sum += element.quantity;
    });

    setTotal(initialLength + sum);

    if (sum + sumBackend >= 5) {
      setIsDialogOpen(true); // Open dialog instead of alert
      return;
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = cart.find(item => item.productId === product._id);

    if (existingProduct) {
      if (existingProduct.quantity <= product.stock) {
        existingProduct.quantity += 1;
        setLocalStock(prev => prev - 1);
      } else {
        setIsDialogOpen(true); // Show dialog if stock limit reached
        return;
      }
    } else {
      cart.push({ productId: product._id, quantity: 1 });
      setLocalStock(prev => prev - 1);
    }

    const audio = new Audio(Ting);
    audio.play();

    localStorage.setItem('cart', JSON.stringify(cart));
    setIsChanged(true);
    refetch.cartRefetch();
  };

  useEffect(() => {
    const handleClearCart = () => {
      updateLocalStock();
    };

    handleClearCart();
  }, [product.stock, myCart]);

  const buttonLabel = isOutOfStock ? 'Out of Stock' : 'Add to Cart';

  return (
    <div className="group p-2 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="relative w-full h-40 overflow-hidden rounded-lg bg-gray-200">
        <img
          src={product.image_url}
          alt={`Image of ${product.name}`}
          className="w-full h-full object-cover group-hover:opacity-75"
        />
        <div className="absolute top-2 left-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-700 text-white text-lg font-bold">
          {product.productNumber}
        </div>
      </div>
      <div className="mt-2 text-left">
        <h3 className="text-md font-semibold h-12 text-gray-700">{product.name}</h3>
        <div className="flex justify-between text-sm">
          <p className="font-medium text-gray-900">Rs. {product.price}</p>
          <p className="text-gray-500 flex">Qty: {clear ? <Loader className='h-4 w-4' /> : ` ${localStock}`}</p>
        </div>
      </div>
      <button
        className="w-full mt-2 py-3 px-4 flex items-center justify-center rounded bg-orange-400 text-white disabled:bg-orange-200 transition-transform duration-200 transform active:scale-95"
        onClick={handleAddToCart}
        disabled={isOutOfStock}
      >
        <img src={CartIcon} alt="Cart" className="w-4 h-4" />
        <span className="ml-2 text-sm font-semibold">{buttonLabel}</span>
      </button>

      {/* Dialog for item limit */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogTitle>Item Limit Reached</DialogTitle>
          <DialogDescription>Items quantity cannot exceed 5.</DialogDescription>
          <DialogFooter>
            <button
              onClick={() => setIsDialogOpen(false)}
              className="px-4 py-2 bg-orange-400 text-white rounded-md"
            >
              Okay
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ProductCardLocal;

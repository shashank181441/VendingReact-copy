import React, { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import ProductCard from "../../components/ProductCard";
import KeypadModal from "../../components/KeypadModal";
import CategoryButtons from "../../components/CategoryButtons";
import KeyPad from "../../assets/keyPad.png";
import { Link } from "react-router-dom";
import VendingIcon from "../../assets/VendingMachine.png";
import CartIcon from "../../assets/Cart.png";
import Ting from "../../assets/ting.mp3";
import { getCartItems, getProducts, addToCart as addItemToCart, clearCart } from "../../api/api";
import { ArrowUp } from "lucide-react";
import { categories } from "../../api/category";

function Home() {
  const [category, setCategory] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const machineId = localStorage.getItem("machineId");
  const queryClient = useQueryClient();
  const [isChanged, setIsChanged] = useState(false);

  const {
    data: products,
    isLoading: productsLoading,
    error: productsError,
    refetch: productRefetch,
  } = useQuery({ queryKey: ["products"], queryFn: async () => {
    
    let products = await getProducts()
    const products1 = products.data.data.sort((a, b) => a.productNumber - b.productNumber);
    products.data.data = products1
    console.log(products)
    return products
  }, staleTime: 10*1000 });

  const {
    data: cartItems,
    isLoading: cartLoading,
    error: cartError,
    refetch: cartRefetch,
  } = useQuery({ queryKey: ["cartItems", machineId], queryFn: getCartItems });

  // Update filtered products when products data or category changes
  useEffect(() => {
    if (products) {
      setFilteredProducts(filterProducts(products.data.data, category));
    }
  }, [products, category]);

  const openKeypad = () => {
    setShowModal(!showModal);
  };

  const closeKeypad = () => {
    setShowModal(false);
  };

  const sortByCat = (myCategory) => {
    setCategory(myCategory);
    setFilteredProducts(filterProducts(products.data.data, myCategory));
  };

  const filterProducts = (products, category) => {
    return category === ""
      ? products
      : products.filter((product) => product.category === category);
  };

  const filterProductsByProductNumber = (number) => {
    setInputValue(number);

    // Check for exact match first
    const exactMatch = products?.data?.data.find(
      (product) => product.productNumber.toString() === number
    );

    if (exactMatch) {
      // If exact match is found, only show that product
      setFilteredProducts([exactMatch]);
    } else {
      // If no exact match, show products that include the number
      setFilteredProducts(
        products?.data?.data.filter((product) =>
          product.productNumber.toString().includes(number)
        )
      );
    }
  };

  const handleClearCart = async () => {
    await clearCart();
    setIsChanged(false);
    await productRefetch();
    await cartRefetch();
  };

  return (
    <div onContextMenu={(e) => e.preventDefault()}>
      {/* Navbar */}
      <nav className="flex w-full justify-between bg-gray-200 p-4 mb-8 px-6 items-center fixed z-50" id="topnav">
        <Link to="/" className="flex items-center font-bold text-2xl">
          <img src={VendingIcon} alt="Vending Machine" />
          <h1>Vending</h1>
        </Link>
        <div className="flex gap-6">
          <button
            onClick={handleClearCart}
            className={`bg-orange-500 text-white font-bold py-[0.35rem] px-4 rounded-md ${cartItems?.data?.data.length || isChanged ? "flex" : "hidden"}`}
          >
            Clear
          </button>
          <div className="relative">
            <Link to="/cartsLocal">
              <img src={CartIcon} alt="Cart" className="w-8 h-8" />
              {(cartItems?.data?.data.length > 0 || isChanged) && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                  {cartItems.data.data.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {/* Spacer for Navbar */}
      <div className="p-14"></div>

      {/* Category Buttons */}
      
      <CategoryButtons
        categories={categories}
        onCategorySelect={sortByCat}
        activeCategory={category}
      />

      {/* Product Cards */}
      <div className="bg-white items-center justify-center">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {productsLoading || cartLoading ? (
            <div>Loading...</div>
          ) : productsError || cartError ? (
            <div>Error loading data</div>
          ) : (
            <div
              id="product-container"
              className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8"
            >
              {filteredProducts?.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  refetch={{ productRefetch, cartRefetch }}
                  myCart={cartItems.data.data}
                  setIsChanged={setIsChanged}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        className="fixed bottom-20 right-4 z-50 rounded-full px-3 pt-3 pb-2 bg-gray-400 opacity-40 cursor-pointer"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ArrowUp className="h-8 w-8" />
      </button>

      {/* Open Keypad Button */}
      <div
        className="fixed bottom-4 right-4 z-50 rounded-full px-3 pt-3 pb-2 bg-orange-400 cursor-pointer"
        onClick={openKeypad}
      >
        <img src={KeyPad} alt="Keypad" className="h-8 w-8" />
      </div>

      {/* Keypad Modal */}
      {showModal && (
        <KeypadModal
          inputValue={inputValue}
          onInputChange={filterProductsByProductNumber}
          onClose={closeKeypad}
          className={showModal ? "show" : "hide"}
          productLength={filteredProducts?.length}
          qty={filteredProducts[0]?.qty || 0}
        />
      )}
      <div className="p-4"></div>
    </div>
  );
}

export default Home;

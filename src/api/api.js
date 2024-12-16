import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL;
// const baseURL = 'http://localhost:8001/api/v1';
// const baseURL = "https://vendingao-api.xyz/api/v1"

let accessToken = localStorage.getItem('accessToken') || '';

let machineId = localStorage.getItem("machineId") || "66d80057da82f664156f58b0";

const apiClient = axios.create({
  baseURL,
  headers: { Authorization: `Bearer ${accessToken}` },
});

apiClient.interceptors.request.use((req) => {
    const accessToken = localStorage.getItem('accessToken') || '';
  
    if (accessToken) {
      req.headers.Authorization = `Bearer ${accessToken}`;
    } else {
      console.log("You must log in first");
    }
  
    return req;
  }, error => {
    return Promise.reject(error);
});

// export const generateQR = async ()=>{
//   let qrResponse = {}
  
// }

// Cart Operations
  export const addToCart = async (productId) => {
    let cartData = {}
    cartData.machineId = machineId; // Ensure machineId is included
    return await apiClient.post(`/carts/${productId}`, cartData);
  };

  export const addAllToCart = async () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
    if (!cart.length || !machineId) {
      return;
    }

    return  await apiClient.post('/carts/allToCart', {
        machineId,
        cartItems: cart,
      });
  };
  
  export const addToCartByPN = async (productNumber) => {
    let cartData = {}
    cartData.machineId = machineId; // Ensure machineId is included
    return await apiClient.post(`/carts/productNumber/${productNumber}/?machineId=${machineId}`, cartData);
  };
  
  export const getCartItems = async () => {
    return await apiClient.get(`/carts?machineId=${machineId}`); // Include machineId in the request
  };
  
  export const removeCartItem = async (cartItemId) => {
    return await apiClient.delete(`/carts/${cartItemId}?machineId=${machineId}`); // Include machineId in the request
  };
  
  export const clearCart = async () => {
    return await apiClient.delete(`/carts/${machineId}/clear`);
  };
  
  export const getUnpaidCartsByMachine = async () => {
    return await apiClient.get(`/carts/unpaid?machineId=${machineId}`); // Include machineId in the request
  };

  export const getPaidCartsByMachine = async (machineIdy) => {
    return await apiClient.get(`/carts/paid/${machineIdy}`); // Include machineId in the request
  };

  export const updateCartItem = async (cartItemId, quantity)=>{
    return await apiClient.patch(`/carts/${cartItemId}`, {quantity})
  }
  
  // Payment Operations
  export const initiatePayment = async () => {
    let paymentData = {}
    paymentData.machineId = machineId; // Ensure machineId is included
    return await apiClient.post("/payments/", {machineId});
  };
  
  export const finalizePayment = async () => {
    // paymentData.machineId = machineId; // Ensure machineId is included
    return await apiClient.post("/payments/finalize", {machineId});
  };
  
  // Product Operations
  export const createProduct = async (productData) => {
    // productData.machineId = machineId; // Ensure machineId is included
    return await apiClient.post("/products", productData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  };
  
  export const updateProduct = async (productId, productData) => {
    return await apiClient.patch(`/products/${productId}`, productData);
  };
  
  export const getProducts = async (machineIdy=machineId) => {
    return await apiClient.get(`/products?machineId=${machineIdy}`); // Include machineId in the request
  };

  export const getAllProducts = async (machineIdy=machineId) => {
    return await apiClient.get(`/products/allProducts?machineId=${machineIdy}`); // Include machineId in the request
  };
  
  export const getProductDetails = async (productId) => {
    return await apiClient.get(`/products/${productId}?machineId=${machineId}`); // Include machineId in the request
  };
  
  export const deleteProduct = async (productId) => {
    return await apiClient.delete(`/products/${productId}?machineId=${machineId}`); // Include machineId in the request
  };

  export const duplicateProduct = async (productId) => {
    return await apiClient.post(`/products/duplicate/${productId}`); // Include machineId in the request
  };

  export const fillStock = async (productId)=>{
    return await apiClient.post(`/products/fillStock/${productId}`, {})
  }
  
  // User Operations
  export const registerUser = async (userData) => {
    return await apiClient.post("/users/register", userData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  };
  
  export const loginUser = async (userData) => {
    const res = await apiClient.post("/users/login", userData);
    localStorage.setItem('accessToken', res.data.data.accessToken);
    localStorage.setItem('refreshToken', res.data.data.refreshToken);
    return res;
  };
  
  export const logoutUser = async () => {
    const res = await apiClient.post("/users/logout");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    return res;
  };
  
  export const getCurrentUser = async () => {
    return await apiClient.get("/users/current-user");
  };
  
  export const updateAccountDetails = async (accountData) => {
    return await apiClient.patch("/users/update-account", accountData);
  };
  
  export const updateFonePayDetails = async (fonePayData) => {
    return await apiClient.patch("/users/fonePayDetails", fonePayData);
  };
  
  export const getFonePayDetails = async () => {
    return await apiClient.get("/users/fonePayDetails");
  };
  
  export const updateUserAvatar = async (avatarData) => {
    return await apiClient.patch("/users/avatar", avatarData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  };
  
  // Vending Machine Operations
  export const createVendingMachine = async (machineData) => {
    return await apiClient.post("/vending-machines", machineData);
  };
  
  export const updateVendingMachine = async (machineId, machineData) => {
    return await apiClient.patch(`/vending-machines/${machineId}`, machineData);
  };
  
  export const getVendingMachinesByOwner = async () => {
    return await apiClient.get(`/vending-machines/owner`); // Include machineId in the request
  };
  
  export const getVendingMachineDetails = async (machineIdy) => {
    return await apiClient.get(`/vending-machines/${machineIdy}`);
  };
  
  export const addMaintenanceRecord = async (recordData) => {
    recordData.machineId = machineId; // Ensure machineId is included
    return await apiClient.post(`/vending-machines/${machineId}/maintenance`, recordData);
  };
  
  export const getMaintenanceRecords = async () => {
    return await apiClient.get(`/vending-machines/${machineId}/maintenance`);
  };
  
  export const deleteVendingMachine = async (machineId) => {
    return await apiClient.delete(`/vending-machines/${machineId}`);
  };
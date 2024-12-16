import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Customers/Home';
import Carts from './pages/Customers/Carts';
import AdminProducts from './pages/Products/AdminProducts';
import AdminUser from './pages/AdminUser';
import AdminVendingMachines from './pages/Vending/AdminVendingMachines';
import { useAuth } from './hooks/useAuth'; // Custom hook to check authentication
import Register from './pages/Register';
import Login from './pages/Login';
import Checkout from './pages/Customers/Checkout';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from './store/authSlice';
import { getCurrentUser } from './api/api';
import AdminVendingEdit from './pages/Vending/AdminVendingEdit';
import AdminProductEdit from './pages/Products/AdminProductEdit';
import AdminProductAdd from './pages/Products/AdminAddProduct';
import Sidebar from './components/Sidebar';
import GetPaidCarts from './pages/Carts/GetPaidCarts';
import AdminVendingCreate from './pages/Vending/AdminVendingCreate';
import UploadFonePay from './pages/UploadFonePay';
import { closeSerialPort, initializeSerial } from './utils/SerialUtils';
import HomeLocal from './pages/Customers/HomeLocal';  
import CartLocal from './pages/Customers/CartsLocal';
import AdminFillStock from './pages/Products/AdminFillStock';
import Links from './pages/LinkStack/Links';
import usePreventSwipeNavigation from './hooks/usePreventSwipeNavigation';
import PurchaseLogs from './pages/Carts/PurchaseLogs';
import PrintDetails from './pages/Carts/PrintDetails';


function AppRouter() {
  const { isAuthenticated, user } = useAuth();
  usePreventSwipeNavigation()
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState({})
  const userDatas = useSelector(state=>state.auth.userData)

  localStorage.setItem("machineId", import.meta.env.VITE_HOME_MACHINE_ID)

  const dispatch = useDispatch();

  useEffect(() => {

    // Prevent right-click
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener('contextmenu', handleContextMenu);

    // Prevent text selection
    document.body.style.userSelect = 'none';

    // Prevent zooming on mobile
    const metaTag = document.createElement('meta');
    metaTag.name = 'viewport';
    metaTag.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
    document.head.appendChild(metaTag);

    getCurrentUser()
      .then((userData) => {
        if (userData) {
          // Extract serializable data from headers and config
          setUserData(userData)
          const { data } = userData;
          dispatch(login({ userData: data }));
        } else {
          dispatch(logout());
        }
      })
      .finally(() => setLoading(false));

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      // document.removeEventListener('touchstart', handleTouchStart);
      closeSerialPort();
    };
  }, []);

  if (loading) return <h1>Loading...</h1>
  return (
    <Router>
      <Routes>
        {/* Non-logged-in user routes */}
        <Route path="/homeLocal" element={<Home />} />
        <Route path="/" element={<HomeLocal />} />
        {/* <Route path="/try" element={<SerialPort />} /> */}
        <Route path="/cartsLocal" element={<Carts />} />
        <Route path="/carts" element={<CartLocal />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/register" element={<Register />} />
        <Route path="/admin/products/fillStock/:machineId" element={<AdminFillStock />} />
        <Route path="/links" element={<Links />} />



        {/* Logged-in user routes */}
        {userDatas?.success ? (
          <>
          {/* Products */}
            <Route path="/admin/products/:machineId" element={<AdminProducts />} />
            <Route path="/admin/products/edit/:productId" element={<AdminProductEdit />} />
            <Route path="/admin/products/add/:machineId" element={<AdminProductAdd />} />
            <Route path="/admin/carts/paid/:machineId" element={<GetPaidCarts />} />
            <Route path="/admin/carts/purchaselogs/:machineId" element={<PurchaseLogs />} />
            <Route path="/admin/carts/printDetails/:machineId" element={<PrintDetails />} />

          {/* Users */}
            <Route path="/admin/users" element={
              <Sidebar>
            <AdminUser /></Sidebar>
            } />
            <Route path="/admin/users/fonepay" element={
              <Sidebar>
            <UploadFonePay /></Sidebar>
            } />


          {/* Vending */}
            <Route path="/admin/vending-machines" element={<AdminVendingMachines />} />
            <Route path="/admin/vending-machines/create" element={<AdminVendingCreate />} />
            <Route path="/admin/vending-machines/edit/:machineId" element={<AdminVendingEdit />} />
          </>
        ) : <Route path="/admin/*" element={<Navigate to="/admin/login" replace />} /> // Default
        }
        
        {/* Catch-all route for undefined paths */}
        {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
      </Routes>
    </Router>
  );
}

export default AppRouter;

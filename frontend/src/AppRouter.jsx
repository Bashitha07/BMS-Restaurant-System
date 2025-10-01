import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import UserLayout from './components/layouts/UserLayout';
import AdminLayout from './components/layouts/AdminLayout';
import CartSidebar from './components/CartSidebar';
import Home from './pages/user/Home';
import Menu from './pages/Menu';
import Cart from './pages/user/Cart';
import Checkout from './pages/user/Checkout';
import OrderHistory from './pages/user/OrderHistory';
import Reservations from './pages/Reservations';
import PaymentPortal from './pages/user/PaymentPortal';
import Dashboard from './pages/admin/Dashboard';
import MenuManagement from './pages/admin/MenuManagement';
import OrderManagement from './pages/admin/OrderManagement';
import PaymentManagement from './pages/admin/PaymentManagement';
import DeliveryDrivers from './pages/admin/DeliveryDrivers';
import LoginModal from './components/auth/LoginModal';
import RegisterModal from './components/auth/RegisterModal';
import Profile from './pages/user/Profile';
import UserManagement from './pages/admin/UserManagement';
import ReservationManagement from './pages/admin/ReservationManagement';
import DeliveryManagement from './pages/admin/DeliveryManagement';

const AppRouter = () => {
  const { user } = useAuth();

  return (
    <>
      <CartSidebar />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginModal />} />
        <Route path="/register" element={<RegisterModal />} />

        {/* User Routes */}
        <Route path="/" element={<UserLayout><Home /></UserLayout>} />
        <Route path="/menu" element={<UserLayout><Menu /></UserLayout>} />
        <Route path="/cart" element={<UserLayout><Cart /></UserLayout>} />
        <Route path="/checkout" element={<UserLayout><Checkout /></UserLayout>} />
        <Route path="/order-history" element={<UserLayout><OrderHistory /></UserLayout>} />
        <Route path="/reservations" element={<UserLayout><Reservations /></UserLayout>} />
        <Route path="/profile" element={<UserLayout><Profile /></UserLayout>} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminLayout><Dashboard /></AdminLayout>} />
        <Route path="/admin/users" element={<AdminLayout><UserManagement /></AdminLayout>} />
        <Route path="/admin/menu" element={<AdminLayout><MenuManagement /></AdminLayout>} />
        <Route path="/admin/orders" element={<AdminLayout><OrderManagement /></AdminLayout>} />
        <Route path="/admin/payments" element={<AdminLayout><PaymentManagement /></AdminLayout>} />
        <Route path="/admin/reservations" element={<AdminLayout><ReservationManagement /></AdminLayout>} />
        <Route path="/admin/deliveries" element={<AdminLayout><DeliveryManagement /></AdminLayout>} />
        <Route path="/admin/delivery-drivers" element={<AdminLayout><DeliveryDrivers /></AdminLayout>} />
      </Routes>
    </>
  );
};

export default AppRouter;

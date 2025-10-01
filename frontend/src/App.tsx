import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { MainLayout } from './components/layouts/MainLayout';
import { Menu } from './pages/Menu';
import { Orders } from './pages/Orders';
import { Reservations } from './pages/Reservations';
import { Checkout } from './pages/Checkout';
import { Profile } from './pages/Profile';
import { AdminDashboard } from './pages/admin/Dashboard';
import { MenuManagement } from './pages/admin/MenuManagement';
import { OrderManagement } from './pages/admin/OrderManagement';
import { CartSidebar } from './components/cart/CartSidebar';
export function App() {
  return <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <CartSidebar />
          <Routes>
            <Route path="/" element={<MainLayout>
                  <Menu />
                </MainLayout>} />
            <Route path="/orders" element={<MainLayout>
                  <Orders />
                </MainLayout>} />
            <Route path="/reservations" element={<MainLayout>
                  <Reservations />
                </MainLayout>} />
            <Route path="/checkout" element={<MainLayout>
                  <Checkout />
                </MainLayout>} />
            <Route path="/profile" element={<MainLayout>
                  <Profile />
                </MainLayout>} />
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<MainLayout>
                  <AdminDashboard />
                </MainLayout>} />
            <Route path="/admin/menu" element={<MainLayout>
                  <MenuManagement />
                </MainLayout>} />
            <Route path="/admin/orders" element={<MainLayout>
                  <OrderManagement />
                </MainLayout>} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>;
}
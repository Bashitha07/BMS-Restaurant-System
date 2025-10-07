import React, { Suspense, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import UserLayout from './components/layouts/UserLayout';
import AdminLayout from './components/layouts/AdminLayout';
import DriverLayout from './components/layouts/DriverLayout';
import CartSidebar from './components/CartSidebar';
import LoadingSpinner from './components/ui/LoadingSpinner';
import { routes } from './routes';

const AppRouter = () => {
  const { user, isAdmin, isDriver } = useAuth();
  const location = useLocation();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const renderRoute = (route) => {
    if (route.requireAuth && !user) {
      return <Navigate to="/login" />;
    }
    if (route.requireAdmin && !isAdmin) {
      return <Navigate to="/" />;
    }
    if (route.requireDriver && !isDriver) {
      return <Navigate to="/driver/login" />;
    }
    return <route.Component />;
  };

  const isAuthRoute = location.pathname.toLowerCase() === '/login' || 
                     location.pathname.toLowerCase() === '/register' ||
                     location.pathname.toLowerCase() === '/forgot-password' ||
                     location.pathname.toLowerCase() === '/driver/login' ||
                     location.pathname.toLowerCase() === '/driver/register';

  return (
    <div className="app-router">
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                route.path.toLowerCase() === '/login' || 
                route.path.toLowerCase() === '/register' || 
                route.path.toLowerCase() === '/forgot-password' ||
                route.path.toLowerCase() === '/driver/login' ||
                route.path.toLowerCase() === '/driver/register' ? (
                  renderRoute(route)
                ) : route.requireAdmin ? (
                  <AdminLayout>{renderRoute(route)}</AdminLayout>
                ) : route.requireDriver ? (
                  <DriverLayout>{renderRoute(route)}</DriverLayout>
                ) : (
                  <UserLayout onCartClick={() => setIsCartOpen(true)}>{renderRoute(route)}</UserLayout>
                )
              }
            />
          ))}
        </Routes>
        {!isAuthRoute && (
          <CartSidebar
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
          />
        )}
      </Suspense>
    </div>
  );
};

export default AppRouter;

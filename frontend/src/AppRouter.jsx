import React, { Suspense, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import UserLayout from './components/layouts/UserLayout';
import AdminLayout from './components/layouts/AdminLayout';
import DriverLayout from './components/layouts/DriverLayout';
import KitchenLayout from './components/layouts/KitchenLayout';
import ManagerLayout from './components/layouts/ManagerLayout';
import CartSidebar from './components/common/CartSidebar';
import LoadingSpinner from './components/ui/LoadingSpinner';
import { routes } from './routes';

const AppRouter = () => {
  const { user, isAdmin, isDriver, isKitchen, isManager } = useAuth();
  const location = useLocation();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const renderRoute = (route) => {
    // Add a check to prevent redirection during page refresh or when backend is unavailable
    const isPageRefresh = performance.navigation && performance.navigation.type === 1;
    const hasLocalStorageUser = localStorage.getItem('user') !== null;
    
    // If this is a page refresh and we have a user in localStorage, don't redirect
    if (route.requireAuth && !user && hasLocalStorageUser) {
      console.log('Page refreshed with stored user data. Preventing redirect to login.');
      return <route.Component />;
    }
    
    // Normal auth checks
    if (route.requireAuth && !user) {
      return <Navigate to="/login" />;
    }
    if (route.requireAdmin && !isAdmin) {
      // If user has admin role in localStorage but context hasn't loaded yet, don't redirect
      const storedUser = localStorage.getItem('user');
      const isLocalAdmin = storedUser && JSON.parse(storedUser).role === 'ADMIN';
      if (isLocalAdmin) {
        return <route.Component />;
      }
      return <Navigate to="/" />;
    }
    if (route.requireDriver && !isDriver) {
      return <Navigate to="/driver/login" />;
    }
    if (route.requireKitchen && !isKitchen) {
      return <Navigate to="/" />;
    }
    if (route.requireManager && !isManager) {
      return <Navigate to="/" />;
    }
    return <route.Component />;
  };

  const isAuthRoute = location.pathname.toLowerCase() === '/login' || 
                     location.pathname.toLowerCase() === '/register' ||
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
                route.path.toLowerCase() === '/driver/login' ||
                route.path.toLowerCase() === '/driver/register' ? (
                  renderRoute(route)
                ) : route.requireAdmin ? (
                  <AdminLayout>{renderRoute(route)}</AdminLayout>
                ) : route.requireDriver ? (
                  <DriverLayout>{renderRoute(route)}</DriverLayout>
                ) : route.requireKitchen ? (
                  <KitchenLayout>{renderRoute(route)}</KitchenLayout>
                ) : route.requireManager ? (
                  <ManagerLayout>{renderRoute(route)}</ManagerLayout>
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

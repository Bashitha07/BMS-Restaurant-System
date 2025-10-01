import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCartIcon, UserIcon, MenuIcon, XIcon, SearchIcon, UtensilsIcon, CogIcon, LogOutIcon, UsersIcon, PlusIcon, TruckIcon, CreditCardIcon, CalendarIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { LoginModal } from '../auth/LoginModal';
import { RegisterModal } from '../auth/RegisterModal';
import { Button } from '../ui/Button';
export function MainHeader() {
  const {
    user,
    logout
  } = useAuth();
  const {
    getTotalItems
  } = useCart();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const openLoginModal = () => {
    setIsLoginModalOpen(true);
    setIsRegisterModalOpen(false);
  };
  const openRegisterModal = () => {
    setIsRegisterModalOpen(true);
    setIsLoginModalOpen(false);
  };
  const closeModals = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(false);
  };
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const toggleCart = () => {
    document.getElementById('cartSidebar')?.classList.toggle('open');
  };
  return <header className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-white flex items-center gap-2">
            <UtensilsIcon size={28} />
            BMS Kingdom of taste
          </Link>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-white hover:bg-white/20 px-3 py-2 rounded-full transition-all transform hover:-translate-y-0.5">
              Menu
            </Link>
            <Link to="/orders" className="text-white hover:bg-white/20 px-3 py-2 rounded-full transition-all transform hover:-translate-y-0.5">
              Orders
            </Link>
            <Link to="/reservations" className="text-white hover:bg-white/20 px-3 py-2 rounded-full transition-all transform hover:-translate-y-0.5">
              Reservations
            </Link>
            {!user && <>
                <Link to="#" onClick={openLoginModal} className="text-white hover:bg-white/20 px-3 py-2 rounded-full transition-all transform hover:-translate-y-0.5">
                  Login
                </Link>
                <Link to="#" onClick={openRegisterModal} className="text-white hover:bg-white/20 px-3 py-2 rounded-full transition-all transform hover:-translate-y-0.5">
                  Register
                </Link>
              </>}
            {user && user.role === 'admin' && <div className="relative group">
                <button className="flex items-center space-x-1 text-white hover:bg-white/20 px-3 py-2 rounded-full">
                  <CogIcon size={20} />
                  <span>Admin</span>
                </button>
                <div className="absolute right-0 w-48 mt-2 bg-white rounded-md shadow-lg hidden group-hover:block z-10">
                  <Link to="/admin/dashboard" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-indigo-100">
                    <CogIcon size={16} />
                    <span>Dashboard</span>
                  </Link>
                  <Link to="/admin/menu" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-indigo-100">
                    <PlusIcon size={16} />
                    <span>Manage Menu</span>
                  </Link>
                  <Link to="/admin/users" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-indigo-100">
                    <UsersIcon size={16} />
                    <span>Manage Users</span>
                  </Link>
                  <Link to="/admin/orders" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-indigo-100">
                    <TruckIcon size={16} />
                    <span>Manage Orders</span>
                  </Link>
                  <Link to="/admin/payments" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-indigo-100">
                    <CreditCardIcon size={16} />
                    <span>Manage Payments</span>
                  </Link>
                  <Link to="/admin/reservations" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-indigo-100">
                    <CalendarIcon size={16} />
                    <span>Manage Reservations</span>
                  </Link>
                </div>
              </div>}
            {user && <div className="relative group">
                <button className="flex items-center space-x-1 text-white hover:bg-white/20 px-3 py-2 rounded-full">
                  <UserIcon size={20} />
                  <span>{user.name}</span>
                </button>
                <div className="absolute right-0 w-48 mt-2 bg-white rounded-md shadow-lg hidden group-hover:block z-10">
                  <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-indigo-100">
                    <UserIcon size={16} />
                    <span>Profile</span>
                  </Link>
                  <button onClick={logout} className="flex items-center gap-2 w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-100">
                    <LogOutIcon size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>}
            <button onClick={toggleCart} className="text-white hover:bg-white/20 p-2 rounded-full relative transition-all transform hover:-translate-y-0.5">
              <ShoppingCartIcon size={24} />
              {getTotalItems() > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>}
            </button>
          </nav>
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <button onClick={toggleCart} className="text-white relative">
              <ShoppingCartIcon size={24} />
              {getTotalItems() > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>}
            </button>
            <button onClick={toggleMenu} className="text-white">
              {isMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        {isMenuOpen && <nav className="md:hidden mt-4 py-2 border-t border-white/20">
            <Link to="/" className="block py-2 text-white hover:bg-white/20 px-3 rounded-md" onClick={() => setIsMenuOpen(false)}>
              Menu
            </Link>
            <Link to="/orders" className="block py-2 text-white hover:bg-white/20 px-3 rounded-md" onClick={() => setIsMenuOpen(false)}>
              Orders
            </Link>
            <Link to="/reservations" className="block py-2 text-white hover:bg-white/20 px-3 rounded-md" onClick={() => setIsMenuOpen(false)}>
              Reservations
            </Link>
            {user ? <>
                <div className="py-2 border-t border-white/20 mt-2">
                  <p className="text-white/80 px-3">Logged in as {user.name}</p>
                  {user.role === 'admin' && <>
                      <Link to="/admin/dashboard" className="flex items-center gap-2 py-2 text-white hover:bg-white/20 px-3 rounded-md" onClick={() => setIsMenuOpen(false)}>
                        <CogIcon size={16} />
                        <span>Dashboard</span>
                      </Link>
                      <Link to="/admin/menu" className="flex items-center gap-2 py-2 text-white hover:bg-white/20 px-3 rounded-md" onClick={() => setIsMenuOpen(false)}>
                        <PlusIcon size={16} />
                        <span>Manage Menu</span>
                      </Link>
                      <Link to="/admin/users" className="flex items-center gap-2 py-2 text-white hover:bg-white/20 px-3 rounded-md" onClick={() => setIsMenuOpen(false)}>
                        <UsersIcon size={16} />
                        <span>Manage Users</span>
                      </Link>
                      <Link to="/admin/orders" className="flex items-center gap-2 py-2 text-white hover:bg-white/20 px-3 rounded-md" onClick={() => setIsMenuOpen(false)}>
                        <TruckIcon size={16} />
                        <span>Manage Orders</span>
                      </Link>
                      <Link to="/admin/payments" className="flex items-center gap-2 py-2 text-white hover:bg-white/20 px-3 rounded-md" onClick={() => setIsMenuOpen(false)}>
                        <CreditCardIcon size={16} />
                        <span>Manage Payments</span>
                      </Link>
                      <Link to="/admin/reservations" className="flex items-center gap-2 py-2 text-white hover:bg-white/20 px-3 rounded-md" onClick={() => setIsMenuOpen(false)}>
                        <CalendarIcon size={16} />
                        <span>Manage Reservations</span>
                      </Link>
                    </>}
                  <Link to="/profile" className="flex items-center gap-2 py-2 text-white hover:bg-white/20 px-3 rounded-md" onClick={() => setIsMenuOpen(false)}>
                    <UserIcon size={16} />
                    <span>Profile</span>
                  </Link>
                  <button onClick={() => {
              logout();
              setIsMenuOpen(false);
            }} className="flex items-center gap-2 w-full text-left py-2 text-white hover:bg-white/20 px-3 rounded-md">
                    <LogOutIcon size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </> : <div className="py-2 border-t border-white/20 mt-2 space-y-2 px-3">
                <Button onClick={openLoginModal} fullWidth>
                  Log In
                </Button>
                <Button variant="outline" onClick={openRegisterModal} fullWidth className="bg-transparent text-white border-white hover:bg-white hover:text-indigo-600">
                  Register
                </Button>
              </div>}
          </nav>}
      </div>
      <LoginModal isOpen={isLoginModalOpen} onClose={closeModals} onSwitchToRegister={openRegisterModal} />
      <RegisterModal isOpen={isRegisterModalOpen} onClose={closeModals} onSwitchToLogin={openLoginModal} />
    </header>;
}
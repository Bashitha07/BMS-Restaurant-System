import React, { useState } from 'react';
import Modal from './ui/Modal';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode);

  const handleClose = () => {
    setMode('login');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={mode === 'login' ? 'Welcome Back' : 'Create Your Account'}
    >
      {mode === 'login' ? (
        <LoginForm
          onClose={handleClose}
          showRegister={() => setMode('register')}
        />
      ) : (
        <RegisterForm
          onClose={handleClose}
          showLogin={() => setMode('login')}
        />
      )}
    </Modal>
  );
};

export default AuthModal;
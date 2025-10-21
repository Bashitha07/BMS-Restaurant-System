import React, { useEffect } from 'react';
import AppRouter from './AppRouter';
import { Toaster } from 'react-hot-toast';
import { preloadCriticalImages } from './utils/enhancedImageUtils';
import './styles/main.css';

function App() {
  // Preload critical images for better performance
  useEffect(() => {
    preloadCriticalImages();
  }, []);
  
  return (
    <div className="App">
      <AppRouter />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
}

export default App;

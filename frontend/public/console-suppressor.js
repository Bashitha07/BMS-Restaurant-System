// Console error handler to suppress known development warnings and browser extension errors
(function() {
  'use strict';
  
  // Store original console methods
  const originalError = console.error;
  const originalWarn = console.warn;
  
  // List of error patterns to suppress
  const suppressedErrors = [
    'A listener indicated an asynchronous response by returning true',
    'message channel closed before a response was received',
    'Download the React DevTools',
    'Extension context invalidated',
    'Could not establish connection'
  ];
  
  // Override console.error
  console.error = function(...args) {
    const message = args.join(' ');
    
    // Check if this is a suppressed error
    const shouldSuppress = suppressedErrors.some(pattern => 
      message.includes(pattern)
    );
    
    if (!shouldSuppress) {
      originalError.apply(console, args);
    }
  };
  
  // Override console.warn
  console.warn = function(...args) {
    const message = args.join(' ');
    
    // Check if this is a suppressed warning
    const shouldSuppress = suppressedErrors.some(pattern => 
      message.includes(pattern)
    );
    
    if (!shouldSuppress) {
      originalWarn.apply(console, args);
    }
  };
  
  // Handle unhandled promise rejections (browser extension errors)
  window.addEventListener('unhandledrejection', function(event) {
    const message = event.reason?.message || event.reason || '';
    
    // Check if this is a browser extension error
    const isBrowserExtensionError = suppressedErrors.some(pattern => 
      message.includes(pattern)
    );
    
    if (isBrowserExtensionError) {
      event.preventDefault(); // Prevent the error from being logged
    }
  });
  
})();
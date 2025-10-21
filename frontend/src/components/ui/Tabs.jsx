import React, { createContext, useContext, useState } from 'react';

// Create a context for the tabs
const TabsContext = createContext({});

export const Tabs = ({ defaultValue, value, onValueChange, className, children, ...props }) => {
  const [tabValue, setTabValue] = useState(value || defaultValue);

  const handleValueChange = (newValue) => {
    setTabValue(newValue);
    if (onValueChange) onValueChange(newValue);
  };

  return (
    <TabsContext.Provider value={{ value: value !== undefined ? value : tabValue, onValueChange: handleValueChange }}>
      <div className={`tabs ${className || ''}`} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

export const TabsList = ({ className, children, ...props }) => {
  return (
    <div className={`tabs-list flex ${className || ''}`} role="tablist" {...props}>
      {children}
    </div>
  );
};

export const TabsTrigger = ({ value, className, children, ...props }) => {
  const { value: selectedValue, onValueChange } = useContext(TabsContext);
  const isActive = selectedValue === value;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      data-state={isActive ? 'active' : 'inactive'}
      onClick={() => onValueChange(value)}
      className={`tabs-trigger text-sm px-4 py-2 
        ${isActive 
          ? 'bg-white border-b-2 border-blue-600 text-blue-600 font-medium' 
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'} 
        ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ value, className, children, ...props }) => {
  const { value: selectedValue } = useContext(TabsContext);
  const isActive = selectedValue === value;

  if (!isActive) return null;

  return (
    <div
      role="tabpanel"
      data-state={isActive ? 'active' : 'inactive'}
      className={`tabs-content ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  );
};
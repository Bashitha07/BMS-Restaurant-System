# Frontend Structure

This document describes the organized frontend structure for the Restaurant Management System.

## Directory Organization

The frontend code is organized by component type and user role for better maintainability and reusability.

### **Directory Structure**

```
frontend/src/
├── App.jsx                      # Main application component
├── AppRouter.jsx                # Route configuration
├── main.jsx                     # Application entry point (used by Vite)
├── index.jsx                    # Alternative entry point
├── index.pcss                   # PostCSS styles
│
├── assets/                      # Static assets (images, fonts, etc.)
│
├── components/                  # React Components (organized by type/feature)
│   ├── common/                  # Shared/common components
│   │   ├── CartSidebar.jsx      # Shopping cart sidebar
│   │   ├── ErrorBoundary.jsx    # Error boundary wrapper
│   │   ├── FoodImage.jsx        # Food image component
│   │   ├── Invoice.jsx          # Invoice display
│   │   ├── Layout.jsx           # Base layout wrapper
│   │   ├── PrivateRoute.jsx     # Route protection
│   │   ├── Navbar.jsx           # Navigation bar
│   │   └── Navbar_new.jsx       # Updated navbar (to be consolidated)
│   │
│   ├── forms/                   # Form components
│   │   ├── LoginForm.jsx        # Login form
│   │   ├── RegisterForm.jsx     # Registration form
│   │   ├── OrderForm.jsx        # Order placement form
│   │   └── ReservationForm.jsx  # Reservation booking form
│   │
│   ├── admin/                   # Admin-specific components
│   │   ├── AdminMenu.jsx        # Admin menu management
│   │   ├── AdminOrders.jsx      # Admin order management
│   │   ├── AdminReservations.jsx # Admin reservation management
│   │   ├── AdminDeliveryDrivers.jsx # Driver management
│   │   ├── AdminUserManagement.jsx
│   │   ├── AdminMenuManagement.jsx
│   │   └── AdminReservationManagement.jsx
│   │
│   ├── driver/                  # Driver-specific components
│   │   └── (driver components)
│   │
│   ├── menu/                    # Menu-related components
│   │   ├── MenuItem.jsx         # Individual menu item
│   │   └── (other menu components)
│   │
│   ├── payment/                 # Payment components
│   │   └── PaymentPortal.jsx    # Payment processing portal
│   │
│   ├── auth/                    # Authentication components
│   │   └── AuthModal.jsx        # Authentication modal
│   │
│   ├── layouts/                 # Layout components
│   │   ├── UserLayout.jsx       # User dashboard layout
│   │   ├── AdminLayout.jsx      # Admin dashboard layout
│   │   ├── DriverLayout.jsx     # Driver dashboard layout
│   │   ├── KitchenLayout.jsx    # Kitchen dashboard layout
│   │   └── ManagerLayout.jsx    # Manager dashboard layout
│   │
│   └── ui/                      # UI components (buttons, modals, etc.)
│       └── LoadingSpinner.jsx
│
├── pages/                       # Page Components (organized by role)
│   ├── public/                  # Public pages (no authentication)
│   │   ├── Home.jsx             # Landing page
│   │   ├── About.jsx            # About page
│   │   ├── RestaurantHome.jsx   # Restaurant home
│   │   ├── RestaurantLogin.jsx  # Login page
│   │   ├── RestaurantMenu.jsx   # Public menu view
│   │   └── RestaurantReservations.jsx
│   │
│   ├── user/                    # Customer pages
│   │   ├── Home.jsx             # User dashboard
│   │   ├── Menu.jsx             # Menu browsing
│   │   ├── Cart.jsx             # Shopping cart
│   │   ├── Checkout.jsx         # Checkout process
│   │   ├── OrderHistory.jsx     # Order history
│   │   └── PaymentDetails.jsx   # Payment details
│   │
│   ├── admin/                   # Admin pages
│   │   └── (admin dashboard pages)
│   │
│   ├── driver/                  # Driver pages
│   │   ├── DriverDashboard.jsx
│   │   └── DriverRegisterPage.jsx
│   │
│   ├── kitchen/                 # Kitchen staff pages
│   │   └── (kitchen pages)
│   │
│   ├── manager/                 # Manager pages
│   │   └── (manager pages)
│   │
│   └── auth/                    # Authentication pages
│       └── Login.jsx
│
├── contexts/                    # React Context Providers
│   ├── AuthContext.jsx          # Authentication state
│   ├── CartContext.jsx          # Shopping cart state
│   └── NotificationContext.jsx  # Notifications state
│
├── services/                    # API Service Layer
│   ├── api.js                   # Base API configuration (Axios)
│   ├── authService.js           # Authentication API calls
│   ├── adminService.js          # Admin API calls
│   ├── driverService.js         # Driver API calls
│   ├── kitchenService.js        # Kitchen API calls
│   ├── managerService.js        # Manager API calls
│   └── paymentService.js        # Payment API calls
│
├── hooks/                       # Custom React Hooks
│   └── (custom hooks)
│
├── routes/                      # Route Definitions
│   └── (route configuration files)
│
├── styles/                      # Global Styles
│   └── main.css                 # Main stylesheet
│
├── utils/                       # Utility Functions
│   └── (helper functions)
│
└── data/                        # Static Data/Constants
    └── (data files)
```

## Design Principles

### 1. **Component Organization**
- **common/**: Reusable across all user roles
- **forms/**: Form-specific components
- **admin/**, **driver/**, etc.: Role-specific components
- **layouts/**: Layout templates for different user types
- **ui/**: Pure UI components (buttons, modals, cards)

### 2. **Page Organization**
- **public/**: No authentication required
- **user/**: Customer-facing pages
- **admin/**: Admin dashboard pages
- **driver/**: Driver-specific pages
- **kitchen/**: Kitchen staff pages
- **manager/**: Manager pages
- **auth/**: Authentication/authorization pages

### 3. **Separation of Concerns**
```
Pages → Components → Services → API
  ↓         ↓          ↓
Context   Hooks     Utils
```

## Component Types

### **Common Components** (`components/common/`)
Shared across all roles:
- Navigation (Navbar)
- Layout wrappers
- Error boundaries
- Loading states
- Route protection

### **Form Components** (`components/forms/`)
Reusable form components:
- Login/Register forms
- Order placement forms
- Reservation forms
- Validation logic included

### **Role-Specific Components**
Specialized for each user role:
- **Admin**: Management interfaces
- **Driver**: Delivery tracking
- **Kitchen**: Order preparation
- **Manager**: Operations oversight

### **Layout Components** (`components/layouts/`)
Different layouts for different user roles:
- Consistent navigation per role
- Role-specific sidebars
- Customized dashboards

## Service Layer

### **API Services** (`services/`)
Centralized API communication:

```javascript
// services/api.js - Base configuration
const API_BASE_URL = 'http://localhost:8084';

// services/authService.js - Authentication
export const login = (credentials) => { ... }
export const register = (userData) => { ... }

// services/adminService.js - Admin operations
export const getAllUsers = () => { ... }
export const updateMenu = (menuId, data) => { ... }
```

### **Service Organization**
- Each service corresponds to a backend controller group
- Handles request/response transformation
- Error handling and token management
- Axios interceptors for authentication

## State Management

### **Context Providers** (`contexts/`)

1. **AuthContext**: User authentication state
   ```javascript
   - currentUser
   - isAuthenticated
   - login()
   - logout()
   - register()
   ```

2. **CartContext**: Shopping cart state
   ```javascript
   - cartItems
   - addToCart()
   - removeFromCart()
   - clearCart()
   ```

3. **NotificationContext**: Notifications
   ```javascript
   - notifications
   - addNotification()
   - clearNotifications()
   ```

## Routing Structure

### **Route Organization**
```
/                      → Home (public)
/login                 → Login page
/register              → Registration

# User routes (authenticated)
/user/menu             → Browse menu
/user/cart             → Shopping cart
/user/checkout         → Checkout
/user/orders           → Order history

# Admin routes (admin only)
/admin/dashboard       → Admin dashboard
/admin/users           → User management
/admin/menu            → Menu management
/admin/orders          → Order management
/admin/reservations    → Reservation management

# Driver routes (driver only)
/driver/dashboard      → Driver dashboard
/driver/orders         → Assigned deliveries

# Kitchen routes (kitchen staff)
/kitchen/orders        → Kitchen order queue

# Manager routes (manager only)
/manager/dashboard     → Manager overview
```

## Best Practices

### 1. **Naming Conventions**
- Components: PascalCase (`MenuComponent.jsx`)
- Utilities: camelCase (`formatPrice.js`)
- CSS files: kebab-case (`menu-item.css`)
- Services: camelCase with Service suffix (`authService.js`)

### 2. **File Organization**
```
ComponentName/
├── ComponentName.jsx      # Component logic
├── ComponentName.css      # Component styles (if not using Tailwind)
└── ComponentName.test.jsx # Component tests
```

### 3. **Import Order**
```javascript
// 1. React imports
import React, { useState, useEffect } from 'react';

// 2. External libraries
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// 3. Internal components
import { Button } from '@/components/ui';
import MenuCard from '@/components/menu/MenuCard';

// 4. Contexts and hooks
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/hooks/useCart';

// 5. Services and utils
import { getMenuItems } from '@/services/api';
import { formatPrice } from '@/utils/format';

// 6. Styles
import './Menu.css';
```

### 4. **Component Structure**
```jsx
import React, { useState, useEffect } from 'react';

const ComponentName = ({ props }) => {
  // 1. State declarations
  const [state, setState] = useState(initialValue);
  
  // 2. Context and hooks
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // 3. Side effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);
  
  // 4. Event handlers
  const handleClick = () => {
    // Handler logic
  };
  
  // 5. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

export default ComponentName;
```

### 5. **Adding New Features**

**For a new user role:**
1. Create layout: `components/layouts/[Role]Layout.jsx`
2. Create pages: `pages/[role]/`
3. Create services: `services/[role]Service.js`
4. Add routes in `AppRouter.jsx`

**For a new feature:**
1. Create components in appropriate directory
2. Add API calls to relevant service
3. Update context if state management needed
4. Add routes if new pages required

## Entry Point

### **main.jsx** (Primary Entry Point)
Used by Vite build system:
```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/main.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

### **Configuration**
- Vite config: `vite.config.js`
- Tailwind config: `tailwind.config.js`
- PostCSS config: `postcss.config.js`

## Styling

### **Tailwind CSS**
- Utility-first CSS framework
- Configured in `tailwind.config.js`
- Custom styles in `styles/main.css`

### **PostCSS**
- CSS preprocessing
- Configured in `postcss.config.js`

## Benefits of This Structure

1. **Role-Based Organization**: Clear separation by user type
2. **Component Reusability**: Common components shared across roles
3. **Maintainability**: Easy to locate and update code
4. **Scalability**: Clear structure for adding features
5. **Team Collaboration**: Clear boundaries between modules
6. **Type Safety**: Organized structure supports TypeScript migration
7. **Testing**: Isolated components easier to test

## Removed Duplicate Files

The following duplicate/unused files were removed:
- ❌ `WorkingApp.jsx` (old/unused component)
- ❌ `index.css` (consolidated into styles/)
- ❌ `main.css` (consolidated into styles/)
- ❌ `Menu.jsx` (duplicate, kept role-specific versions)
- ❌ `MenuNew.jsx` (duplicate)
- ❌ `Orders.jsx` (duplicate, kept role-specific versions)
- ❌ `Reservations.jsx` (duplicate)
- ❌ `Admin.jsx` (duplicate)
- ❌ `components/Menu.jsx` (duplicate)

## Migration Notes

After reorganization:
1. Clean install: `npm install`
2. Update imports in existing components
3. Test all routes and functionality
4. Verify build: `npm run build`
5. Check console for any import errors

## Development Workflow

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Lint code
npm run lint
```

## Related Documentation

- Backend Structure: See `src/main/java/com/bms/restaurant_system/STRUCTURE.md`
- API Documentation: See `bruno-api-tests/`
- Component Library: See `components/ui/README.md`

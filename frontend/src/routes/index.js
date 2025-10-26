import { lazy } from 'react';

// Auth pages
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));

// Driver pages
const DriverLogin = lazy(() => import('../components/driver/DriverLogin'));
const DriverRegisterPage = lazy(() => import('../pages/driver/DriverRegisterPage'));
const DriverDashboard = lazy(() => import('../pages/driver/DriverDashboard'));

// Lazy load page components
const Home = lazy(() => import('../pages/public/Home'));
const About = lazy(() => import('../pages/public/About'));
const Menu = lazy(() => import('../pages/user/Menu'));
const Cart = lazy(() => import('../pages/user/Cart'));
const Checkout = lazy(() => import('../pages/user/Checkout'));
const OrderHistory = lazy(() => import('../pages/user/OrderHistory'));
const PaymentDetails = lazy(() => import('../pages/user/PaymentDetails'));
const Reservations = lazy(() => import('../pages/user/Reservations'));
const Profile = lazy(() => import('../pages/user/Profile'));
const PaymentSlipManagement = lazy(() => import('../components/payment/PaymentSlipManagement'));

// Admin components
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const AdminUserManagement = lazy(() => import('../components/admin/AdminUserManagement'));
const AdminMenuManagement = lazy(() => import('../components/admin/AdminMenuManagement'));
const AdminReservationManagement = lazy(() => import('../components/admin/AdminReservationManagement'));
const AdminSettings = lazy(() => import('../pages/admin/AdminSettings'));

// Admin routes
const adminRoutes = [
  {
    path: '/admin',
    Component: AdminDashboard,
    requireAuth: true,
    requireAdmin: true,
  },
  {
    path: '/admin/dashboard',
    Component: AdminDashboard,
    requireAuth: true,
    requireAdmin: true,
  },
  {
    path: '/admin/users',
    Component: AdminUserManagement,
    requireAuth: true,
    requireAdmin: true,
  },
  {
    path: '/admin/menu',
    Component: AdminMenuManagement,
    requireAuth: true,
    requireAdmin: true,
  },
  {
    path: '/admin/menus',
    Component: AdminMenuManagement,
    requireAuth: true,
    requireAdmin: true,
  },
  {
    path: '/admin/orders',
    Component: lazy(() => import('../components/admin/AdminOrders')),
    requireAuth: true,
    requireAdmin: true,
  },
  {
    path: '/admin/orders/old',
    Component: lazy(() => import('../pages/admin/OrderManagement')),
    requireAuth: true,
    requireAdmin: true,
  },
  {
    path: '/admin/payments',
    Component: PaymentSlipManagement,
    requireAuth: true,
    requireAdmin: true,
  },
  {
    path: '/admin/payment-slips',
    Component: PaymentSlipManagement,
    requireAuth: true,
    requireAdmin: true,
  },
  {
    path: '/admin/reservations',
    Component: AdminReservationManagement,
    requireAuth: true,
    requireAdmin: true,
  },
  {
    path: '/admin/delivery',
    Component: lazy(() => import('../pages/admin/DeliveryManagement')),
    requireAuth: true,
    requireAdmin: true,
  },
  {
    path: '/admin/settings',
    Component: AdminSettings,
    requireAuth: true,
    requireAdmin: true,
  },
];

// Kitchen routes
const kitchenRoutes = [
  {
    path: '/kitchen/dashboard',
    Component: lazy(() => import('../pages/kitchen/KitchenDashboard')),
    requireAuth: true,
    requireKitchen: true,
  },
];

// Manager routes
const managerRoutes = [
  {
    path: '/manager/dashboard',
    Component: lazy(() => import('../pages/manager/ManagerDashboard')),
    requireAuth: true,
    requireManager: true,
  },
];

// Driver routes
const driverRoutes = [
  {
    path: '/driver',
    Component: DriverDashboard,
    requireAuth: true,
    requireDriver: true,
  },
  {
    path: '/driver/login',
    Component: DriverLogin,
    requireAuth: false,
  },
  {
    path: '/driver/register',
    Component: DriverRegisterPage,
    requireAuth: false,
  },
  {
    path: '/driver/dashboard',
    Component: DriverDashboard,
    requireAuth: true,
    requireDriver: true,
  },
];

// Auth routes
const authRoutes = [
  {
    path: '/login',
    Component: Login,
    requireAuth: false,
  },
  {
    path: '/register',
    Component: Register,
    requireAuth: false,
  },
];

// User routes
const userRoutes = [
  {
    path: '/',
    Component: Home,
  },
  {
    path: '/about',
    Component: About,
  },
  {
    path: '/menu',
    Component: Menu,
  },
  {
    path: '/cart',
    Component: Cart,
    requireAuth: true,
  },
  {
    path: '/checkout',
    Component: Checkout,
    requireAuth: true,
  },
  {
    path: '/order-history',
    Component: OrderHistory,
    requireAuth: true,
  },
  {
    path: '/payment/:orderId',
    Component: PaymentDetails,
    requireAuth: true,
  },
  {
    path: '/reservations',
    Component: Reservations,
    requireAuth: true,
  },
  {
    path: '/profile',
    Component: Profile,
    requireAuth: true,
  },
  {
    path: '/payment-slips',
    Component: PaymentSlipManagement,
    requireAuth: true,
  },
];

export const routes = [
  ...authRoutes,
  ...userRoutes,
  ...adminRoutes,
  ...driverRoutes,
  ...kitchenRoutes,
  ...managerRoutes,
];
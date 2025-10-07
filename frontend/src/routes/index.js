import { lazy } from 'react';

// Auth pages
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const ForgotPassword = lazy(() => import('../components/auth/ForgotPassword'));

// Driver pages
const DriverLogin = lazy(() => import('../components/driver/DriverLogin'));
const DriverRegisterPage = lazy(() => import('../pages/driver/DriverRegisterPage'));
const DriverDashboard = lazy(() => import('../components/driver/DriverDashboard'));

// Lazy load page components
const Home = lazy(() => import('../pages/Home'));
const About = lazy(() => import('../pages/About'));
const Menu = lazy(() => import('../pages/Menu'));
const ImageDiagnostic = lazy(() => import('../pages/ImageDiagnostic'));
const Cart = lazy(() => import('../pages/user/Cart'));
const Checkout = lazy(() => import('../pages/user/Checkout'));
const OrderHistory = lazy(() => import('../pages/user/OrderHistory'));
const PaymentDetails = lazy(() => import('../pages/user/PaymentDetails'));
const Reservations = lazy(() => import('../pages/Reservations'));
const Profile = lazy(() => import('../pages/user/Profile'));
const PaymentSlipManagement = lazy(() => import('../components/payment/PaymentSlipManagement'));

// Admin components
const AdminUserManagement = lazy(() => import('../components/admin/AdminUserManagement'));
const AdminMenuManagement = lazy(() => import('../components/admin/AdminMenuManagement'));
const AdminReservationManagement = lazy(() => import('../components/admin/AdminReservationManagement'));

// Admin routes
const adminRoutes = [
  {
    path: '/admin',
    Component: AdminUserManagement,
    requireAuth: true,
    requireAdmin: true,
  },
  {
    path: '/admin/dashboard',
    Component: AdminUserManagement,
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
  {
    path: '/forgot-password',
    Component: ForgotPassword,
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
    path: '/diagnostic',
    Component: ImageDiagnostic,
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
];
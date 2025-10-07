# Restaurant System Integration Guide

## Backend-Frontend Integration Setup

### Prerequisites
- Java 17+ installed
- Node.js 18+ installed
- Maven installed

### 1. Backend Setup (Spring Boot)

#### Start the Backend Server
```bash
cd C:\SpringBoot\restaurant-system
mvn clean install
mvn spring-boot:run
```

The backend will start on: `http://localhost:8084`

#### Backend API Endpoints
- **Authentication**: `/api/auth/*`
- **Users**: `/api/users/*`
- **Admin Users**: `/api/admin/users/*`
- **Menus**: `/api/menus/*`
- **Admin Menus**: `/api/admin/menus/*`
- **Reservations**: `/api/reservations/*`
- **Admin Reservations**: `/api/admin/reservations/*`
- **Orders**: `/api/orders/*`
- **Payment Slips**: `/api/payment-slips/*`
- **Admin Payment Slips**: `/api/admin/payment-slips/*`
- **Driver Auth**: `/api/driver/auth/*`
- **Driver Operations**: `/api/driver/*`
- **Admin Driver Management**: `/api/admin/drivers/*`

### 2. Frontend Setup (React)

#### Install Dependencies
```bash
cd C:\SpringBoot\restaurant-system\frontend
npm install
```

#### Start the Frontend Server
```bash
npm run dev
```

The frontend will start on: `http://localhost:3000`

### 3. Integration Features

#### CORS Configuration
- Backend configured to accept requests from `http://localhost:3000`
- All HTTP methods supported (GET, POST, PUT, DELETE, OPTIONS, PATCH)
- Credentials and authentication headers allowed

#### Authentication Flow
- JWT tokens stored in localStorage
- Automatic token attachment to API requests
- Role-based routing and access control
- Separate driver authentication system

#### File Upload Support
- Payment slip upload configured for 10MB max file size
- Supports PDF, JPG, PNG formats
- Secure file handling on backend

### 4. Available User Roles

#### User Role
- Browse menu
- Place orders
- Make reservations
- Upload payment slips
- View order history

#### Admin Role
- Full system management
- User management and driver registration
- Menu CRUD operations
- Reservation management
- Payment slip verification
- Order tracking
- Delivery management

#### Driver Role
- View assigned deliveries
- Update delivery status
- GPS location tracking
- Real-time status updates

### 5. Testing the Integration

#### Test Users (Default/Mock)
```
Admin Login:
- Username: admin
- Password: admin123

User Login:
- Username: user
- Password: user123
```

#### Driver Registration
- Admins can register drivers through the admin panel
- Drivers receive login credentials
- Separate driver authentication portal

### 6. API Integration Points

#### Frontend Services
- `authService.js` - User authentication
- `driverService.js` - Driver operations
- `adminService.js` - Admin operations
- `paymentService.js` - Payment handling

#### Backend Controllers
- `AuthController` - User authentication
- `DriverAuthController` - Driver authentication
- `AdminController` - Admin operations
- `UserController` - User operations
- `MenuController` - Menu operations
- `ReservationController` - Reservation operations
- `PaymentSlipController` - Payment handling

### 7. Database Access
- H2 Console: `http://localhost:8084/h2-console`
- JDBC URL: `jdbc:h2:file:./data/restaurant_db`
- Username: `sa`
- Password: (empty)

### 8. Development Workflow

#### Starting Both Servers
```bash
# Terminal 1 - Backend
cd C:\SpringBoot\restaurant-system
mvn spring-boot:run

# Terminal 2 - Frontend
cd C:\SpringBoot\restaurant-system\frontend
npm run dev
```

#### API Proxy Configuration
- Vite proxy configured to forward `/api/*` requests to `http://localhost:8084`
- No need for CORS in development
- Production deployment will require proper CORS setup

### 9. Production Deployment

#### Backend Deployment
- Build JAR: `mvn clean package`
- Deploy JAR to server
- Configure production database
- Set proper CORS origins

#### Frontend Deployment
- Build for production: `npm run build`
- Deploy dist folder to web server
- Configure API base URL for production

### 10. Troubleshooting

#### Common Issues
1. **CORS Errors**: Ensure backend CORS is properly configured
2. **401 Unauthorized**: Check JWT token validity and storage
3. **404 Not Found**: Verify API endpoint mappings
4. **File Upload Issues**: Check file size limits and formats

#### Debug Steps
1. Check browser network tab for API calls
2. Verify backend logs for errors
3. Ensure both servers are running
4. Check localStorage for authentication tokens

### 11. Feature Integration Status

✅ **Completed Integrations:**
- User authentication and registration
- Driver authentication system
- Admin user management
- Menu management (admin)
- Reservation management (admin)
- Payment slip upload/verification
- Role-based access control
- Real-time status updates
- File upload/download
- GPS tracking for drivers

🔄 **Ready for Testing:**
- End-to-end user workflows
- Admin management operations
- Driver delivery operations
- Payment verification processes
- Multi-role authentication flows

The integration is complete and ready for comprehensive testing!
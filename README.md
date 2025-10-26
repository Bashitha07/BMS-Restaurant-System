# 🍽️ BMS Kingdom of Taste - Restaurant Management System

## Version 3.0

A full-stack restaurant management system with online ordering, delivery tracking, table reservations, admin management dashboard, and driver delivery management.

## 📋 Features

- **Customer Portal**: Browse menu, place orders, track deliveries, make reservations
- **Admin Dashboard**: Manage orders, menus, users, drivers, payment verification, delivery assignment
- **Driver Portal**: View assigned deliveries, update delivery status (Ready for Pickup → Out for Delivery → Delivered)
- **Real-time Notifications**: Order status updates, payment confirmations
- **Payment Methods**: Cash on Delivery, Deposit Slip (Bank Transfer) with image upload
- **Driver Management**: Auto-assignment, delivery tracking, status updates, COD collection tracking

## 🏗️ Tech Stack

### Backend
- **Spring Boot 3.5.6** - Java framework
- **Java 24** - Programming language
- **MySQL 8.0** - Database
- **Spring Security** - Authentication & Authorization
- **JWT** - Token-based authentication
- **JPA/Hibernate** - ORM
- **Maven** - Dependency management

### Frontend
- **React 18** - UI library
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Router DOM** - Client-side routing
- **React Hot Toast** - Notifications

## 🚀 Installation & Setup

### Prerequisites
- **Java 17+** (JDK 24 recommended)
- **MySQL 8.0+**
- **Node.js 18+** with npm
- **Maven 3.9+**

### Step 1: Clone Repository
```bash
git clone https://github.com/Bashitha07/BMS-Restaurant-System.git
cd BMS-Restaurant-System
```

### Step 2: Database Setup

**Run the database script:**
```bash
# Windows PowerShell
Get-Content database-setup.sql | mysql -u root

# Linux/Mac
mysql -u root < database-setup.sql
```

**Verify installation:**
```sql
-- Login to MySQL
mysql -u root

-- Check database
USE restaurant_db;
SHOW TABLES;
-- Should show 14 tables

-- Check sample data
SELECT COUNT(*) FROM users;    -- Should have 11 users
SELECT COUNT(*) FROM menus;    -- Should have 15 menu items
SELECT COUNT(*) FROM drivers;  -- Should have 8 drivers
```

### Step 3: Configure Backend

Edit `backend/src/main/resources/application.properties`:
```properties
# Database connection (no password for root)
spring.datasource.url=jdbc:mysql://localhost:3306/restaurant_db
spring.datasource.username=root
spring.datasource.password=

# Server port
server.port=8084

# JPA settings - use validate after initial setup
spring.jpa.hibernate.ddl-auto=validate
```

### Step 4: Start Backend Server

```bash
cd backend
mvnw spring-boot:run
```

Backend will start on `http://localhost:8084`

### Step 5: Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will start on `http://localhost:5174`

### Step 6: Login

**Default Admin Credentials:**
- Username: `admin`
- Password: `password123`

**Test User Accounts:**
- Username: `john.doe` / Password: `password123`
- Username: `jane.smith` / Password: `password123`

**Test Driver Accounts:**
- Username: `DrivTest` / Password: `password123`
- Username: `driver1` / Password: `password123`
- Login at: `http://localhost:5174/driver/login`

## 📂 Project Structure

```
restaurant-system/
├── backend/                 # Spring Boot backend
│   ├── src/main/java/
│   │   └── com/bms/restaurant_system/
│   │       ├── controller/  # REST API endpoints
│   │       │   ├── admin/   # Admin-specific endpoints
│   │       │   ├── auth/    # Authentication endpoints
│   │       │   └── user/    # User endpoints
│   │       ├── service/     # Business logic
│   │       │   ├── order/   # Order management
│   │       │   ├── menu/    # Menu management
│   │       │   └── user/    # User management
│   │       ├── entity/      # Database models (JPA entities)
│   │       ├── repository/  # Data access layer (Spring Data JPA)
│   │       ├── dto/         # Data transfer objects
│   │       └── config/      # Security & application config
│   ├── src/main/resources/
│   │   └── application.properties  # Backend configuration
│   └── bruno-api-tests/     # API testing collection
│
├── frontend/                # React frontend
│   ├── public/
│   │   └── images/          # 📁 Menu item images (46 food images)
│   ├── src/
│   │   ├── components/      # UI components
│   │   │   ├── admin/       # Admin dashboard components
│   │   │   ├── driver/      # Driver portal components
│   │   │   ├── layouts/     # Layout wrappers
│   │   │   └── common/      # Shared components
│   │   ├── pages/           # Page components
│   │   │   ├── admin/       # Admin pages
│   │   │   ├── driver/      # Driver pages
│   │   │   ├── user/        # Customer pages
│   │   │   └── public/      # Public pages
│   │   ├── services/        # API service layer
│   │   │   ├── driverService.js   # Driver API calls
│   │   │   ├── orderService.js    # Order API calls
│   │   │   └── authService.js     # Auth API calls
│   │   ├── contexts/        # React contexts (Auth, Cart, Notifications)
│   │   ├── routes/          # Route configuration
│   │   └── App.jsx
│   └── package.json
│
├── database-setup.sql       # Complete DB schema + sample data
└── *.sql                    # Additional SQL scripts for setup

```

## 📁 File Storage Locations

### Payment Slip Uploads
- **Storage Path**: `${user.home}/restaurant-system/uploads/payment-slips/`
- **Windows Example**: `C:\Users\YourUsername\restaurant-system\uploads\payment-slips\`
- **Linux/Mac Example**: `/home/username/restaurant-system/uploads/payment-slips/`
- **File Format**: JPEG, PNG, PDF
- **Max Size**: 10MB per file
- **Access**: Admin can view/verify uploaded slips in Payment Management section

### Menu Item Images
- **Storage Path**: `frontend/public/images/`
- **Full Path**: `c:\SpringBoot\restaurant-system\frontend\public\images\`
- **Files**: 46 menu item images (JPG format)
- **Access**: Publicly accessible via frontend at `/images/filename.jpg`
- **Examples**: 
  - Biryani.jpg
  - Cheese Chicken Burger.jpg
  - Margherita Pizza.jpg
  - Mango Juice.jpg

### Configuration
Located in `backend/src/main/resources/application.properties`:
```properties
# File upload settings
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
app.upload.dir=${user.home}/restaurant-system/uploads
```

## 🗄️ Database Schema

The system uses **17 tables**:

### Core Tables
1. **users** - User accounts (customers, admins, drivers, kitchen staff, managers)
2. **menus** - Restaurant menu items with pricing and images
3. **orders** - Customer orders with status tracking
4. **order_items** - Individual items in orders (quantity, price)
5. **drivers** - Driver profiles with vehicle info and availability
6. **deliveries** - Delivery tracking, assignment, and status updates
7. **reservations** - Table reservation bookings
8. **payment_slips** - Bank deposit slip uploads and verification

### Supporting Tables
9. **notifications** - User notification system
10. **order_tracking** - Order status change history with timestamps
11. **system_settings** - Application configuration (auto-enable drivers, etc.)
12. **delivery_drivers** - Legacy driver table (consolidated with drivers)
13. **feedbacks** - Customer feedback (future use)
14. **reviews** - Menu/service reviews (future use)
15. **payments** - Payment transactions (future use)
16. **categories** - Menu categories
17. **audit_log** - System activity logging

## 🔐 User Roles

1. **ADMIN** - Full system access, manage everything
2. **USER** - Customers who place orders
3. **DRIVER** - Delivery drivers with vehicle tracking
4. **MANAGER** - Restaurant manager (future use)
5. **KITCHEN** - Kitchen staff (future use)

## 🎯 Key Features

### For Customers
- Browse menu with categories, images, and search
- Add items to cart with quantity selection
- Place orders with multiple payment methods
- Upload bank deposit slips for verification
- Track order status in real-time (Pending → Confirmed → Preparing → Ready for Pickup → Out for Delivery → Delivered)
- Make table reservations with date/time selection
- View order history with reorder option
- Receive notifications for order updates

### For Admins
- Comprehensive dashboard with statistics (orders, revenue, users, drivers)
- Manage menu items (CRUD operations) with image upload
- View and update order status
- Assign drivers to deliveries with driver selection
- Verify and approve/reject payment slips
- Manage user accounts and roles
- Driver approval workflow (enable/disable drivers)
- View and manage reservations
- System settings configuration

### For Drivers
- Dedicated driver login portal (`/driver/login`)
- View assigned deliveries with customer details
- Update delivery status workflow:
  - **Ready for Pickup** → Mark as picked up → **Out for Delivery**
  - **Out for Delivery** → Mark as delivered → **Delivered**
- Handle Cash on Delivery (COD) payments with collection confirmation
- View customer phone numbers for contact
- Delivery address and instructions display
- Active delivery filtering (completed orders removed from view)
- Performance metrics and delivery history

## 🚦 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - New user registration
- `GET /api/auth/validate` - Validate JWT token
- `POST /api/driver/login` - Driver login (separate auth)

### Orders
- `GET /api/orders` - Get all orders (admin)
- `GET /api/orders/my-orders` - Get user's orders
- `POST /api/orders` - Create new order
- `PATCH /api/orders/{id}/status` - Update order status
- `PUT /api/orders/{id}/assign-driver` - Assign driver to delivery
- `POST /api/orders/{id}/payment-slip` - Upload payment slip

### Menu
- `GET /api/menu` - Get all menu items
- `GET /api/menu/{id}` - Get specific item
- `POST /api/menu` - Create menu item (admin)
- `PUT /api/menu/{id}` - Update menu item (admin)
- `DELETE /api/menu/{id}` - Delete menu item (admin)

### Drivers
- `GET /api/orders/admin/drivers` - Get all drivers
- `GET /api/drivers/my-deliveries` - Get driver's assigned deliveries
- `PUT /api/admin/users/{id}/enable` - Approve/enable driver
- `PUT /api/admin/users/{id}/disable` - Reject/disable driver

### Reservations
- `GET /api/reservations` - Get all reservations
- `POST /api/reservations` - Create reservation
- `PUT /api/reservations/{id}` - Update reservation status

### Notifications
- `GET /api/notifications/my-notifications` - Get user notifications
- `POST /api/notifications/mark-read/{id}` - Mark notification as read

## 🧪 Testing

**Sample Data Included:**
- 11 user accounts (1 admin, 2 customers, 8 drivers)
- 46 menu item images stored in `frontend/public/images/`
- 15+ menu items across categories (Mains, Appetizers, Beverages, Desserts)
- Sample orders with different statuses
- 8 driver profiles with vehicle details
- Table reservations

**Test Payment Slip Upload:**
1. Login as customer
2. Place order and select "Deposit Slip" payment method
3. Upload a sample image (JPEG/PNG/PDF, max 10MB)
4. Image saved to `${user.home}/restaurant-system/uploads/payment-slips/`
5. Admin can view and approve/reject from Payment Management

**Test Driver Workflow:**
1. Admin creates order and assigns driver (user_id 19: `DrivTest`)
2. Driver logs in at `/driver/login`
3. Driver sees assigned delivery in dashboard
4. Driver updates status: Ready for Pickup → Out for Delivery → Delivered
5. For COD orders, driver confirms cash collection
6. Database updated with delivery status and timestamps

**Test Driver Portal Restrictions:**
1. Login as driver at `/driver/login`
2. Attempt to navigate to `/` or `/menu` (user pages)
3. Driver automatically redirected to `/driver/dashboard`
4. Drivers can only access driver-specific routes

## 📱 Screenshots

*(Add screenshots here of:)*
- Home page with menu
- Admin dashboard
- Order tracking
- Driver management

## ⚙️ Configuration

### File Upload Configuration
**Payment Slips:** `${user.home}/restaurant-system/uploads/payment-slips/`
- Windows: `C:\Users\YourUsername\restaurant-system\uploads\payment-slips\`
- Linux/Mac: `/home/username/restaurant-system/uploads/payment-slips/`

**Menu Images:** `frontend/public/images/`
- 46 food images included (JPG format)
- Accessible at: `http://localhost:5174/images/filename.jpg`

### Ports
- **Backend**: `8084` (Spring Boot)
- **Frontend**: `5174` (Vite dev server)
- **Database**: `3306` (MySQL)

## 🐛 Troubleshooting

**Database Connection Failed:**
- Verify MySQL is running
- Check username/password in `application.properties`
- Ensure `restaurant_db` exists

**Port Already in Use:**
- Backend: Change port in `application.properties`
- Frontend: Kill process on port 5174 or change in `vite.config.js`

**Import Errors in IDE:**
- Run `mvn clean install` in backend folder
- Reload Maven/Gradle project
- Clean Java Language Server workspace

**Cannot Login:**
- Verify database has users (run `SELECT * FROM users;`)
- Check password is `password123` (default BCrypt hash)
- Clear browser cookies and localStorage
- For drivers, use `/driver/login` instead of `/login`

**Driver Can't Update Status:**
- Verify order is assigned to driver (`driver_id` in orders table)
- Check backend logs for transaction errors
- Ensure delivery record exists for the order
- Verify JWT token is valid (check localStorage)

**Payment Slip Upload Fails:**
- Check file size is under 10MB
- Verify upload directory exists: `${user.home}/restaurant-system/uploads/payment-slips/`
- Check file permissions on upload directory
- Supported formats: JPEG, PNG, PDF

**Images Not Loading:**
- Menu images should be in `frontend/public/images/`
- Verify image filenames match database `image_url` column
- Check file extensions are correct (case-sensitive)
- Restart frontend dev server after adding new images

## 📝 Development Notes

**System Architecture:**
- **Backend**: RESTful API with JWT authentication, role-based access control
- **Frontend**: SPA with protected routes, context-based state management
- **Database**: Relational schema with foreign keys and constraints
- **File Storage**: Local filesystem for uploads, public directory for static images

**Adding New Features:**
1. **Backend**: Entity → Repository → Service → Controller → DTO
2. **Frontend**: Service → Component → Route → Context (if needed)
3. **Database**: Update schema in SQL file, use `ddl-auto=validate`
4. Test API with Bruno API client (collection in `backend/bruno-api-tests/`)

**Database Management:**
- **Never** use `ddl-auto=create` (drops all data)
- Use `ddl-auto=validate` for production
- Use `ddl-auto=update` cautiously for development
- Make schema changes in `database-setup.sql` or dedicated migration scripts

**Security Notes:**
- JWT tokens stored in localStorage (user: `token`, driver: `driverToken`)
- Passwords hashed with BCrypt (strength: 12)
- CORS enabled for frontend origin
- File upload validation and sanitization implemented
- Role-based route protection on frontend and backend

## 🆕 Version 3.0 Updates

### New Features
✅ **Driver Portal Isolation** - Drivers redirected to dashboard, cannot access user pages
✅ **Enhanced Status Workflow** - Ready for Pickup → Out for Delivery → Delivered
✅ **COD Payment Tracking** - Cash collection confirmation for COD orders
✅ **Delivery Synchronization** - Order and delivery status automatically synced
✅ **Active Delivery Filtering** - Completed deliveries removed from driver view
✅ **Improved File Organization** - Removed obsolete script files

### Technical Improvements
- Updated delivery status mapping logic in `OrderService.java`
- Enhanced driver authentication with separate login portal
- Added route protection to prevent cross-role access
- Implemented timestamp tracking for pickup and delivery times
- Consolidated driver table structure (removed legacy tables)
- Added comprehensive logging for debugging

### File Structure Changes
- **Removed**: `update-images.bat`, `start-backend.bat`, `start-servers.sh`
- **Added**: Driver portal components and services
- **Updated**: README with version 3.0 documentation

## 👥 Contributors

- Bashitha07 - Full Stack Development

## 📄 License

This project is for educational purposes.

## 🔗 Links

- GitHub: https://github.com/Bashitha07/BMS-Restaurant-System
- Contact: bashitha.m@example.com

---

**Made with ❤️ for Database Management Systems Course**

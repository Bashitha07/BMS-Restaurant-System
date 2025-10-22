# Restaurant Management System

A comprehensive full-stack restaurant management system built with Spring Boot and React, featuring multi-user platform for customers, delivery drivers, managers, kitchen staff, and administrators with complete order management, reservations, payments, and delivery tracking.

## 🚀 Quick Start

### Prerequisites
- **Java 24** (or JDK 17+)
- **MySQL 8.0+** via XAMPP
- **Node.js 18+** and npm
- **Maven 3.9+**

### Installation (5 Minutes)

1. **Clone Repository**
   ```bash
   git clone https://github.com/Bashitha07/BMS-Restaurant-System.git
   cd BMS-Restaurant-System
   ```

2. **Setup Database**
   ```bash
   # Start XAMPP and ensure MySQL is running on port 3306
   
   # Login to MySQL
   mysql -u root
   
   # Run complete setup script
   source backend/database/database-schema-corrected.sql
   ```

3. **Configure Backend**
   ```bash
   # Edit backend/src/main/resources/application.properties
   spring.datasource.url=jdbc:mysql://localhost:3306/restaurant_db
   spring.datasource.username=root
   spring.datasource.password=
   ```

4. **Start Backend** (Terminal 1)
   ```bash
   cd backend
   mvn spring-boot:run
   # Or use: .\backend\scripts\start-backend.bat
   ```

5. **Start Frontend** (Terminal 2)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

6. **Access Application**
   - Frontend: http://localhost:5174
   - Backend API: http://localhost:8084
   - Login: `admin` / `admin123`

---

## 📊 Database Architecture

### Complete Schema (14 Tables)

**Database Tables:**
1. **users** - User accounts with roles (USER, ADMIN, MANAGER, KITCHEN, DRIVER)
2. **menus** - Menu items with pricing, categories, and inventory
3. **orders** - Customer orders with status tracking
4. **order_items** - Individual items in each order
5. **order_tracking** - Order status history and timeline
6. **reservations** - Table reservations with confirmation
7. **delivery_drivers** - Delivery driver accounts and performance metrics
8. **drivers** - Simplified driver records
9. **deliveries** - Delivery tracking with GPS and status updates
10. **payments** - Payment transactions and methods
11. **payment_slips** - Uploaded payment receipt images
12. **notifications** - User notifications and alerts
13. **feedbacks** - Menu item feedback from customers
14. **reviews** - Menu item ratings and reviews

### View Database Documentation
- **Complete Mapping:** See `DATABASE_FRONTEND_MAPPING.md` for detailed table structures
- **ER Diagrams:** Available in `backend/docs/diagrams/`

### Database Management

**Daily Operations:**
```sql
-- View all users
SELECT id, username, email, role, enabled FROM users;
INSERT INTO menus (name, description, category, price, is_available, preparation_time, ingredients)
VALUES ('Pizza Margherita', 'Classic Italian pizza', 'MAIN_COURSE', 12.99, TRUE, 20, 'Tomato, Mozzarella, Basil');

-- Update menu price
UPDATE menus SET price = 14.99, discounted_price = 12.99, discount_percentage = 14.3 WHERE id = 1;

-- View recent orders
SELECT o.id, o.order_date, o.status, o.total_amount, u.username 
FROM orders o JOIN users u ON o.user_id = u.id 
ORDER BY o.order_date DESC LIMIT 10;

-- Check low stock items
SELECT id, name, stock_quantity, low_stock_threshold 
FROM menus 
WHERE stock_quantity <= low_stock_threshold AND is_available = TRUE;
```

**Verify Schema:**
```bash
# Run verification script
mysql -u root -p restaurant_db < verify-database.sql

# Manual checks
mysql -u root -p restaurant_db -e "SELECT COUNT(*) FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'restaurant_db';"
# Should return: 10

mysql -u root -p restaurant_db -e "SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = 'restaurant_db' AND TABLE_NAME = 'menus';"
# Should return: 21
```

---

## 🎯 Technology Stack

### Backend
- **Java 24** - Latest Java version
- **Spring Boot 3.5.6** - Application framework
- **Spring Security 6.5.5** - JWT authentication
- **Spring Data JPA** - ORM with Hibernate
- **MySQL 8.0** - Database
- **Maven 3.9.11** - Build tool

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Axios** - HTTP client

### Security
- **JWT (JSON Web Tokens)** - Stateless authentication
- **BCrypt** - Password hashing (strength 10)
- **CORS** - Cross-origin resource sharing configured
- **Role-based access control** (USER, ADMIN, MANAGER, KITCHEN, DRIVER)
- **Spring Security 6.5.5** - Latest security framework

---

## 📋 Features

### User Management
- User registration and login (customers, drivers, staff)
- JWT-based authentication with refresh tokens
- Role management (USER, ADMIN, MANAGER, KITCHEN, DRIVER)
- Profile management with phone and address
- User enable/disable by admin
- Promo code and discount management

### Menu Management
- Create, read, update, delete menu items
- Category filtering (APPETIZER, MAIN_COURSE, DESSERT, BEVERAGE, etc.)
- Image upload with validation
- Stock quantity tracking with low stock alerts
- Dietary flags (vegetarian, vegan, gluten-free, spicy with levels)
- Discount pricing support
- Featured items promotion
- Preparation time tracking
- Ingredients listing

### Order Management
- Place orders with multiple items and quantities
- Order status tracking (PENDING, CONFIRMED, PREPARING, READY_FOR_PICKUP, OUT_FOR_DELIVERY, DELIVERED, CANCELLED, REFUNDED)
- Order type selection (DELIVERY, PICKUP, DINE_IN)
- Payment method selection (CASH, CREDIT_CARD, DEBIT_CARD, ONLINE, BANK_TRANSFER, DIGITAL_WALLET)
- Payment status tracking
- Delivery address and phone management
- Special instructions per item and order
- Order history with filtering
- Real-time order tracking timeline
- Tax and delivery fee calculation

### Reservation Management
- Create table reservations with date/time
- Party size and customer details
- Status tracking (PENDING, CONFIRMED, SEATED, CANCELLED, NO_SHOW, COMPLETED)
- Special requests handling
- Table number assignment
- Confirmation and cancellation with reasons
- Admin notes and reminder system

### Delivery Management
- Driver registration and approval workflow
- Driver assignment to orders
- Delivery status tracking (PENDING, ASSIGNED, PICKED_UP, IN_TRANSIT, DELIVERED, FAILED, CANCELLED)
- GPS location tracking
- Estimated vs actual delivery time
- Driver performance metrics (ratings, total deliveries, earnings)
- Proof of delivery with images
- Customer feedback and ratings
- Distance calculation

### Payment Processing
- Multiple payment methods support
- Payment slip upload with image validation
- Admin approval/rejection workflow
- Transaction ID tracking
- Payment gateway integration ready
- Refund management
- Payment status history
- Payment status management

### Review System
- Rate menu items (1-5 stars)
- Written reviews
- Review management

---

## 🔐 API Endpoints

### Authentication
```
POST   /api/auth/register     - Register new user
POST   /api/auth/login        - Login and get JWT token
```

### Menu (Public)
```
GET    /api/menu              - Get all menu items
GET    /api/menu/{id}         - Get menu item by ID
GET    /api/menu/category/{category} - Filter by category
GET    /api/menu/search?query={query} - Search menu items
```

### Menu Admin
```
POST   /api/admin/menu        - Create menu item
PUT    /api/admin/menu/{id}   - Update menu item
DELETE /api/admin/menu/{id}   - Delete menu item
POST   /api/admin/menu/{id}/toggle-availability - Toggle availability
```

### Orders
```
POST   /api/orders            - Create new order
GET    /api/orders/user       - Get user's orders
GET    /api/admin/orders      - Get all orders (admin)
PUT    /api/admin/orders/{id}/status - Update order status
```

### Reservations
```
POST   /api/reservations      - Create reservation
GET    /api/reservations/user - Get user's reservations
GET    /api/admin/reservations - Get all reservations (admin)
PUT    /api/admin/reservations/{id}/status - Update reservation status
```

### Users (Admin)
```
GET    /api/admin/users       - Get all users
PUT    /api/admin/users/{id}/role - Update user role
PUT    /api/admin/users/{id}/status - Toggle user status
```

---

## 🧪 Testing

### Run All Tests
```bash
# Backend tests
mvn test

# Backend tests with coverage
mvn clean verify

# Frontend tests
cd frontend
npm test

# API tests (Bruno)
# 1. Open VS Code
# 2. Bruno extension should be installed
# 3. Open bruno-api-tests folder
# 4. Run tests sequentially
```

### Test Scripts

**JWT Configuration Test:**
```bash
# Start backend first, then run:
.\test-jwt-config.ps1

# Tests:
# ✓ Admin login
# ✓ JWT token generation
# ✓ Protected endpoint access
# ✓ Unauthorized access blocking
# ✓ Menu creation with JWT
# ✓ Database verification
```

**Complete System Test:**
```bash
.\run-all-tests.ps1

# Runs:
# 1. Prerequisites check
# 2. Backend/Frontend availability
# 3. Node.js integration tests
# 4. Manual test checklist
# 5. Database verification queries
```

### Bruno API Tests
Located in `bruno-api-tests/` folder:

1. **Authentication** - Login, Register
2. **Menu** - CRUD operations, filtering
3. **Orders** - Create, update, retrieve
4. **Reservations** - Create, manage, update
5. **Users** - Admin user management

**To Run:**
1. Install Bruno: https://www.usebruno.com/downloads
2. Open collection: `bruno-api-tests/`
3. Select 'local' environment
4. Run `00-START-HERE.bru` first
5. Execute tests in each folder

---

## 🏗️ Code Organization

### **Backend Structure** (Feature-Based Organization)

The backend follows a **feature-based architecture** for better maintainability:

```
src/main/java/com/bms/restaurant_system/
├── controller/
│   ├── admin/      - Admin management endpoints
│   ├── auth/       - Authentication endpoints
│   ├── user/       - User-facing endpoints
│   ├── driver/     - Driver operations
│   ├── kitchen/    - Kitchen operations
│   └── manager/    - Manager operations
│
├── service/
│   ├── user/       - User management
│   ├── order/      - Order processing
│   ├── payment/    - Payment processing
│   ├── delivery/   - Delivery management
│   ├── menu/       - Menu management
│   ├── reservation/ - Reservations
│   ├── notification/ - Notifications
│   ├── storage/    - File storage
│   └── database/   - Database utilities
│
├── dto/
│   ├── auth/       - Authentication DTOs
│   ├── user/       - User DTOs
│   ├── driver/     - Driver DTOs
│   ├── menu/       - Menu DTOs
│   ├── order/      - Order DTOs
│   ├── payment/    - Payment DTOs
│   └── reservation/ - Reservation DTOs
│
├── entity/         - JPA entities (database models)
├── repository/     - Spring Data repositories
├── config/         - Configuration classes
├── exception/      - Custom exceptions
└── util/           - Utility classes
```

**Benefits:**
- 🎯 Clear separation by feature and role
- 🔍 Easy to locate related code
- 📈 Scalable for new features
- 🤝 Better team collaboration
- 📚 See detailed documentation: `src/main/java/com/bms/restaurant_system/STRUCTURE.md`

### **Frontend Structure** (Role-Based Organization)

The frontend follows a **role-based architecture** with component separation:

```
frontend/src/
├── components/
│   ├── common/     - Shared components (Navbar, Layout, etc.)
│   ├── forms/      - Form components (Login, Register, etc.)
│   ├── admin/      - Admin-specific components
│   ├── driver/     - Driver-specific components
│   ├── menu/       - Menu-related components
│   ├── payment/    - Payment components
│   ├── layouts/    - Layout templates per role
│   └── ui/         - UI components (buttons, modals)
│
├── pages/
│   ├── public/     - Public pages (no auth)
│   ├── user/       - Customer pages
│   ├── admin/      - Admin dashboard
│   ├── driver/     - Driver pages
│   ├── kitchen/    - Kitchen pages
│   ├── manager/    - Manager pages
│   └── auth/       - Auth pages
│
├── contexts/       - React Context (Auth, Cart, Notifications)
├── services/       - API services (authService, adminService, etc.)
├── hooks/          - Custom React hooks
├── routes/         - Route definitions
├── styles/         - Global styles
└── utils/          - Utility functions
```

**Benefits:**
- 🎨 Role-based component organization
- ♻️ High component reusability
- 🧩 Modular and maintainable
- 🚀 Easy to add new roles/features
- 📚 See detailed documentation: `frontend/STRUCTURE.md`

---

## 🗂️ Project Structure

```
restaurant-system/
├── src/
│   ├── main/
│   │   ├── java/com/bms/restaurant_system/
│   │   │   ├── config/          # Security, CORS, JWT config
│   │   │   ├── controller/      # REST API controllers
│   │   │   ├── dto/             # Data Transfer Objects
│   │   │   ├── entity/          # JPA Entities (10 tables)
│   │   │   ├── repository/      # Spring Data repositories
│   │   │   ├── service/         # Business logic
│   │   │   └── util/            # Utility classes (JWT, etc.)
│   │   └── resources/
│   │       ├── application.properties         # Main MySQL config
│   │       ├── application-postgresql.properties  # PostgreSQL profile
│   │       ├── application-test.properties    # Test profile
│   │       └── static/images/   # Uploaded images
│   └── test/
│       ├── java/                # Unit & integration tests
│       └── resources/
│           └── application-test.properties  # Test configuration
├── frontend/
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── contexts/            # React contexts (Auth)
│   │   ├── pages/               # Page components
│   │   ├── services/            # API services
│   │   └── utils/               # Helper functions
│   └── tests/                   # Frontend tests
├── database/                    # Database SQL scripts
│   ├── database-setup.sql       # Main setup script
│   ├── setup-postgresql.sql     # PostgreSQL setup
│   ├── verify-database.sql      # Verification script
│   └── README.md                # Database documentation
├── scripts/                     # Executable scripts
│   ├── start-backend.ps1        # Backend startup
│   ├── start-frontend.ps1       # Frontend startup
│   ├── start-servers.bat        # Windows batch script
│   ├── start-servers.sh         # Linux/Mac script
│   ├── test-jwt-config.ps1      # JWT test script
│   ├── run-all-tests.ps1        # Complete test suite
│   └── README.md                # Scripts documentation
├── docs/                        # Documentation & diagrams
│   ├── diagrams/                # PlantUML diagrams
│   │   ├── Database_ER_Diagram.puml        # Detailed ER diagram
│   │   ├── Database_ER_Diagram_Simple.puml # Simple ER diagram
│   │   ├── Restaurant_System_*.puml        # System diagrams
│   │   ├── Login_*.puml         # Login/Auth diagrams
│   │   ├── Menu_*.puml          # Menu management diagrams
│   │   ├── Ordering_*.puml      # Order/Reservation diagrams
│   │   └── Payment_*.puml       # Payment diagrams
│   └── README.md                # Documentation guide
├── bruno-api-tests/             # Bruno API test collection
├── pom.xml                      # Maven configuration
└── README.md                    # This file (main documentation)
```

---

## 🔧 Configuration

### Backend Configuration
File: `src/main/resources/application.properties`

```properties
# Server
server.port=8084

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/restaurant_db
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
spring.jpa.hibernate.ddl-auto=update

# JWT
jwt.secret=your-super-secret-key-minimum-256-bits
jwt.expiration=86400000

# File Upload
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

# CORS
cors.allowed-origins=http://localhost:5176

# Logging
logging.level.com.bms.restaurant_system=DEBUG
```

### Frontend Configuration
File: `frontend/src/services/api.js`

```javascript
const API_BASE_URL = 'http://localhost:8084';
```

---

## 🐛 Troubleshooting

### Backend Won't Start

**Problem:** Port 8084 already in use
```bash
# Windows: Find and kill process
netstat -ano | findstr :8084
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8084 | xargs kill -9
```

**Problem:** Database connection failed
```bash
# Check MySQL is running
mysql -u root -p -e "SHOW DATABASES;"

# Verify credentials in application.properties
# Verify database exists
mysql -u root -p -e "SHOW DATABASES LIKE 'restaurant_db';"
```

**Problem:** JWT token errors
```bash
# Check JWT secret is set (minimum 256 bits)
# Edit application.properties:
jwt.secret=your-very-long-secret-key-at-least-256-bits-long-for-security

# Restart backend
```

### Frontend Won't Start

**Problem:** Port 5176 already in use
```bash
# Kill process on port 5176
netstat -ano | findstr :5176
taskkill /PID <PID> /F
```

**Problem:** API calls failing (CORS)
```bash
# Check backend CORS configuration in SecurityConfig.java
# Verify frontend URL matches cors.allowed-origins
```

**Problem:** Module not found errors
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Database Issues

**Problem:** Table doesn't exist
```bash
# Re-run database setup
mysql -u root -p < database-setup.sql
```

**Problem:** Wrong field count in menus table
```bash
# Verify schema
mysql -u root -p restaurant_db -e "DESCRIBE menus;"
# Should show 21 fields

# Check for calories/allergens (should be 0 rows)
mysql -u root -p restaurant_db -e "SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = 'restaurant_db' AND TABLE_NAME = 'menus' AND COLUMN_NAME IN ('calories', 'allergens');"
```

**Problem:** Sample data not inserted
```bash
# Check existing data
mysql -u root -p restaurant_db -e "SELECT COUNT(*) FROM users;"
mysql -u root -p restaurant_db -e "SELECT COUNT(*) FROM menus;"

# If empty, re-run setup
mysql -u root -p < database-setup.sql
```

---

## 📝 Development Guidelines

### Adding New Features

1. **Database Changes:**
   ```sql
   -- Add new field to existing table
   ALTER TABLE menus ADD COLUMN new_field VARCHAR(100);
   
   -- Create new table
   CREATE TABLE new_table (
       id BIGINT AUTO_INCREMENT PRIMARY KEY,
       -- fields here
   );
   ```

2. **Backend:**
   - Update Entity class
   - Update DTO if needed
   - Add service methods
   - Create controller endpoints
   - Write tests

3. **Frontend:**
   - Create/update components
   - Add API service calls
   - Update UI
   - Test functionality

### Code Style

**Backend (Java):**
- Use camelCase for variables/methods
- Use PascalCase for classes
- Follow Spring Boot conventions
- Document complex logic

**Frontend (JavaScript/React):**
- Use camelCase for variables/functions
- Use PascalCase for components
- Use arrow functions
- Keep components small and focused

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "Add: your feature description"

# Push to GitHub
git push origin feature/your-feature-name

# Create Pull Request on GitHub
```

---

## 🚀 Deployment

### Production Checklist

1. **Environment Variables:**
   ```properties
   spring.datasource.url=jdbc:mysql://production-db:3306/restaurant_db
   spring.datasource.username=${DB_USERNAME}
   spring.datasource.password=${DB_PASSWORD}
   jwt.secret=${JWT_SECRET}
   cors.allowed-origins=https://your-domain.com
   spring.jpa.hibernate.ddl-auto=validate
   ```

2. **Build for Production:**
   ```bash
   # Backend
   mvn clean package -DskipTests
   # Creates: target/restaurant-system-0.0.1-SNAPSHOT.jar
   
   # Frontend
   cd frontend
   npm run build
   # Creates: frontend/dist/
   ```

3. **Deploy:**
   ```bash
   # Run backend
   java -jar target/restaurant-system-0.0.1-SNAPSHOT.jar
   
   # Serve frontend (nginx, apache, or CDN)
   # Point to frontend/dist/
   ```

4. **Database Migration:**
   ```bash
   # Backup production database
   mysqldump -u root -p restaurant_db > backup.sql
   
   # Run migrations carefully
   mysql -u root -p restaurant_db < migration-script.sql
   ```

---

## 📄 License

This project is for educational purposes.

---

## 👥 Contributors

- Bashitha07 - Project Owner

---

## 🆘 Support

For issues or questions:
1. Check this README
2. Review troubleshooting section
3. Check closed issues on GitHub
4. Open new issue with details

---

## 📚 Additional Resources

### Project Organization
- **`backend/`** - Spring Boot application
  - `backend/database/` - All SQL scripts and schema files
  - `backend/docs/diagrams/` - PlantUML diagrams (ER, Use Case, Activity)
  - `backend/scripts/` - Startup and utility scripts
  - `backend/src/main/java/` - Java source code
  - `backend/src/main/resources/` - Configuration files
- **`frontend/`** - React application
  - `frontend/src/components/` - Reusable React components
  - `frontend/src/pages/` - Page components by role
  - `frontend/src/services/` - API service layer
  - `frontend/src/assets/` - Images and static files
- **`DATABASE_FRONTEND_MAPPING.md`** - Complete table-to-endpoint mapping
- **`.vscode/`** - VS Code configuration with launch.json for debugging

### Key Endpoints for Testing
```bash
# Health check
curl http://localhost:8084/api/menus

# Login
curl -X POST http://localhost:8084/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Get menus with JWT
curl http://localhost:8084/api/menus \
  -H "Authorization: Bearer YOUR_TOKEN"

# Update user status (admin only)
curl -X PUT "http://localhost:8084/api/admin/users/3/status?enabled=false" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

**Last Updated:** October 22, 2025  
**Version:** 2.0.0  
**Database Schema:** Complete (14 tables with full feature set)  
**Status:** ✅ Production Ready

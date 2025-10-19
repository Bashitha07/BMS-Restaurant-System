# Restaurant Management System

A comprehensive full-stack restaurant management system built with Spring Boot and React, featuring simplified database schema, order management, reservations, payments, and delivery tracking.

## 🚀 Quick Start

### Prerequisites
- **Java 24** (or JDK 17+)
- **MySQL 8.0+**
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
   # Login to MySQL
   mysql -u root -p
   
   # Run setup script
   source database-setup.sql
   # Or: mysql -u root -p < database-setup.sql
   ```

3. **Configure Backend**
   ```bash
   # Edit src/main/resources/application.properties
   spring.datasource.url=jdbc:mysql://localhost:3306/restaurant_db
   spring.datasource.username=root
   spring.datasource.password=YOUR_PASSWORD
   ```

4. **Start Backend** (Terminal 1)
   ```bash
   mvn spring-boot:run
   # Or use: .\start-backend.ps1
   ```

5. **Start Frontend** (Terminal 2)
   ```bash
   cd frontend
   npm install
   npm run dev
   # Or use: .\start-frontend.ps1
   ```

6. **Access Application**
   - Frontend: http://localhost:5176
   - Backend API: http://localhost:8084
   - Login: `admin` / `admin123`

---

## 📊 Database Architecture

### Simplified Schema (10 Tables, 93 Fields)

**Key Simplifications:**
- ✅ 38% field reduction (from 150 to 93 fields)
- ✅ Menus: 21 fields (NO calories, NO allergens)
- ✅ Users: 9 fields (USER/ADMIN roles only)
- ✅ Orders: 10 fields (removed calculated fields)
- ✅ Deliveries: 9 fields (removed GPS tracking)

**Tables:**
1. **users** (9 fields) - User accounts and authentication
2. **menus** (21 fields) - Menu items and inventory
3. **orders** (10 fields) - Customer orders
4. **order_items** (6 fields) - Order line items
5. **reservations** (12 fields) - Table reservations
6. **drivers** (7 fields) - Delivery drivers
7. **deliveries** (9 fields) - Delivery tracking
8. **payments** (8 fields) - Payment records
9. **payment_slips** (5 fields) - Payment slip uploads
10. **reviews** (6 fields) - Customer reviews

### View ER Diagram
```bash
# Option 1: VS Code PlantUML Extension
# 1. Install "PlantUML" extension by jebbs
# 2. Open Database_ER_Diagram.puml
# 3. Press Alt+D to preview

# Option 2: Online Viewer
# 1. Open Database_ER_Diagram_Simple.puml
# 2. Copy content
# 3. Paste at: http://www.plantuml.com/plantuml/uml/
```

### Database Management

**Daily Operations:**
```sql
-- Add menu item
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
- **BCrypt** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Role-based access control** (USER, ADMIN)

---

## 📋 Features

### User Management
- User registration and login
- JWT-based authentication
- Role management (USER, ADMIN)
- Profile management
- User enable/disable (admin only)

### Menu Management
- Create, read, update, delete menu items
- Category filtering (APPETIZER, MAIN_COURSE, DESSERT, BEVERAGE, etc.)
- Image upload and storage
- Stock quantity tracking
- Low stock alerts
- Dietary flags (vegetarian, vegan, gluten-free, spicy)
- Discount support
- Featured items

### Order Management
- Place orders with multiple items
- Order status tracking (PENDING, CONFIRMED, PREPARING, READY, DELIVERED, CANCELLED)
- Payment method selection
- Delivery address management
- Special instructions
- Order history

### Reservation Management
- Create table reservations
- Date and time selection
- Party size management
- Status tracking (PENDING, CONFIRMED, CANCELLED)
- Special requests

### Delivery Management
- Driver assignment
- Delivery status tracking
- Estimated delivery time
- Actual delivery time recording

### Payment Processing
- Multiple payment methods (CASH, CARD, ONLINE, DEPOSIT_SLIP)
- Payment slip upload
- Transaction tracking
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
│   │       ├── application.properties  # Main config
│   │       └── static/images/   # Uploaded images
│   └── test/                    # Unit & integration tests
├── frontend/
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── contexts/            # React contexts (Auth)
│   │   ├── pages/               # Page components
│   │   ├── services/            # API services
│   │   └── utils/               # Helper functions
│   └── tests/                   # Frontend tests
├── bruno-api-tests/             # Bruno API test collection
├── database-setup.sql           # Database schema & sample data
├── verify-database.sql          # Database verification script
├── Database_ER_Diagram.puml     # Detailed ER diagram
├── Database_ER_Diagram_Simple.puml  # Simple ER diagram
├── start-backend.ps1            # Backend startup script
├── start-frontend.ps1           # Frontend startup script
├── test-jwt-config.ps1          # JWT test script
├── run-all-tests.ps1            # Complete test suite
└── README.md                    # This file
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

### Files & Scripts
- `database-setup.sql` - Complete database schema
- `verify-database.sql` - Database validation
- `Database_ER_Diagram.puml` - Detailed ER diagram
- `Database_ER_Diagram_Simple.puml` - Simple ER diagram
- `start-backend.ps1` - Backend startup (Windows)
- `start-frontend.ps1` - Frontend startup (Windows)
- `test-jwt-config.ps1` - JWT authentication test
- `run-all-tests.ps1` - Complete test suite

### Key Endpoints for Testing
```bash
# Health check
curl http://localhost:8084/api/menu

# Login
curl -X POST http://localhost:8084/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Get menus with JWT
curl http://localhost:8084/api/menu \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

**Last Updated:** October 19, 2025  
**Version:** 1.0.0  
**Database Schema:** Simplified (93 fields, 10 tables)  
**Status:** ✅ Production Ready

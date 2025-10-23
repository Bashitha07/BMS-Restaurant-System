# Restaurant Management System

A full-stack restaurant management system built with Spring Boot and React.

## 🚀 Quick Start

### Prerequisites
- **Java 24** (or JDK 17+)
- **MySQL 8.0+** 
- **Node.js 18+** and npm
- **Maven 3.9+**

### Installation

1. **Clone Repository**
   ```bash
   git clone https://github.com/Bashitha07/BMS-Restaurant-System.git
   cd BMS-Restaurant-System
   ```

2. **Setup Database**
   ```bash
   # Start MySQL and ensure it's running on port 3306
   
   # Login to MySQL
   mysql -u root
   
   # Run database setup
   source backend/database/RESTAURANT_DB_COMPLETE.sql
   ```

3. **Configure Backend**
   ```properties
   # Edit backend/src/main/resources/application.properties
   spring.datasource.url=jdbc:mysql://localhost:3306/restaurant_db
   spring.datasource.username=root
   spring.datasource.password=
   ```

4. **Start Backend**
   ```bash
   cd backend
   mvn spring-boot:run
   ```

5. **Start Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

6. **Access Application**
   - Frontend: http://localhost:5174
   - Backend API: http://localhost:8084
   - Default Login: `admin` / `admin123`

---

## 🎯 Technology Stack

- **Backend:** Spring Boot 3.5.6, Java 24, Spring Security, JWT
- **Frontend:** React 18, Vite, Tailwind CSS
- **Database:** MySQL 8.0 (14 tables)
- **Build Tools:** Maven 3.9.11, npm

---

## 📊 Database Schema

### Tables (14)

1. `users` - User accounts with roles
2. `menus` - Menu items with pricing and categories
3. `orders` - Customer orders with status tracking
4. `order_items` - Individual items in orders
5. `order_tracking` - Order status timeline
6. `reservations` - Table reservations
7. `delivery_drivers` - Driver accounts
8. `drivers` - Driver records
9. `deliveries` - Delivery tracking
10. `payments` - Payment transactions
11. `payment_slips` - Payment receipts
12. `notifications` - User notifications
13. `feedbacks` - Customer feedback
14. `reviews` - Menu ratings

---

## 📋 Key Features

- User authentication with JWT
- Role-based access control (USER, ADMIN, MANAGER, KITCHEN, DRIVER)
- Menu management with categories and inventory
- Order processing with status tracking
- Table reservations
- Payment processing with slip upload
- Delivery tracking with driver assignment
- Real-time notifications

---

## 🔧 Configuration

### Backend (`application.properties`)
```properties
server.port=8084
spring.datasource.url=jdbc:mysql://localhost:3306/restaurant_db
spring.datasource.username=root
spring.datasource.password=
spring.jpa.hibernate.ddl-auto=none
jwt.secret=your-secret-key-minimum-256-bits
jwt.expiration=86400000
```

### Frontend (`src/services/api.js`)
```javascript
const API_BASE_URL = 'http://localhost:8084';
```

---

## 🐛 Troubleshooting

**Port already in use:**
```bash
# Windows
netstat -ano | findstr :8084
taskkill /PID <PID> /F
```

**Database connection failed:**
```bash
# Verify MySQL is running
mysql -u root -e "SHOW DATABASES;"
```

**Frontend dependencies:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

## � License

Educational purposes only.

---

##  Contributors

Bashitha07 - Project Owner

---

**Version:** 2.0.0  
**Last Updated:** October 23, 2025

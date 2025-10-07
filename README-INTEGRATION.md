# 🍽️ Restaurant Management System - Full Stack Integration

## 🚀 Quick Start Guide

### Prerequisites
- ✅ Java 17+
- ✅ Maven 3.6+
- ✅ Node.js 18+
- ✅ Git

### 🏃‍♂️ One-Command Startup

**Windows:**
```bash
# Double-click or run:
start-servers.bat
```

**Linux/Mac:**
```bash
chmod +x start-servers.sh
./start-servers.sh
```

### 📱 Access Points

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:3000 | Main application |
| **Backend API** | http://localhost:8084/api | REST API |
| **H2 Database** | http://localhost:8084/h2-console | Database admin |

## 🔐 Default Login Credentials

### Admin Access
```
Username: admin
Password: admin123
Features: Full system management
```

### User Access
```
Username: user  
Password: user123
Features: Menu, orders, reservations
```

### Driver Access
```
Drivers are registered by admin
Access: /driver/login
```

## 🎯 Feature Overview

### 👤 User Features
- 🍽️ Browse restaurant menu
- 🛒 Place orders with cart
- 📅 Make table reservations  
- 💳 Upload payment slips
- 📱 Order history tracking

### 👨‍💼 Admin Features
- 👥 User & driver management
- 🍽️ Menu CRUD operations
- 📅 Reservation management
- 💳 Payment verification
- 📊 Analytics dashboard
- 🚚 Delivery coordination

### 🚗 Driver Features
- 📦 View assigned deliveries
- 📍 GPS location tracking
- ✅ Update delivery status
- 📱 Real-time notifications

## 🏗️ Architecture

```
Frontend (React + Vite)     ←→     Backend (Spring Boot)
├── User Interface                 ├── REST APIs
├── Admin Dashboard               ├── Authentication
├── Driver Portal                 ├── Database (H2)
└── Authentication                └── File Upload
```

## 🔧 Development Setup

### 1. Clone & Setup
```bash
git clone <repository>
cd restaurant-system
```

### 2. Backend Setup
```bash
# Install dependencies & compile
mvn clean install

# Start backend server
mvn spring-boot:run
```
Backend runs on: **http://localhost:8084**

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server  
npm run dev
```
Frontend runs on: **http://localhost:3000**

## 🧪 Testing Integration

### Automated Test
```bash
node test-backend-integration.js
```

### Manual Testing
1. Start backend: `mvn spring-boot:run`
2. Start frontend: `cd frontend && npm run dev`
3. Open: http://localhost:3000
4. Login with admin/admin123

## 📁 Project Structure

```
restaurant-system/
├── src/main/java/          # Spring Boot backend
│   ├── controller/         # REST controllers
│   ├── service/           # Business logic
│   ├── entity/            # Database entities
│   └── config/            # Configuration
├── frontend/              # React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API services
│   │   ├── contexts/      # State management
│   │   └── utils/         # Utilities
│   └── public/            # Static assets
└── data/                  # H2 database files
```

## 🔌 API Integration

### Authentication Flow
```javascript
// User login
POST /api/auth/login
{
  "username": "admin",
  "password": "admin123"
}

// Driver login  
POST /api/driver/auth/login
{
  "driverId": "DRIVER001",
  "password": "password"
}
```

### Key Endpoints
- **Menus**: `/api/menus/*` and `/api/admin/menus/*`
- **Orders**: `/api/orders/*`
- **Reservations**: `/api/reservations/*` and `/api/admin/reservations/*`
- **Users**: `/api/admin/users/*`
- **Drivers**: `/api/driver/*` and `/api/admin/drivers/*`
- **Payments**: `/api/payment-slips/*` and `/api/admin/payment-slips/*`

## 🗄️ Database Access

### H2 Console
- **URL**: http://localhost:8084/h2-console
- **JDBC URL**: `jdbc:h2:file:./data/restaurant_db`
- **Username**: `sa`
- **Password**: (empty)

## 🚀 Production Deployment

### Backend
```bash
# Build JAR
mvn clean package

# Run production
java -jar target/restaurant-system-1.0.jar
```

### Frontend
```bash
cd frontend

# Build for production
npm run build

# Deploy dist/ folder to web server
```

## 🔧 Configuration

### Backend Config (`application.properties`)
```properties
server.port=8084
spring.datasource.url=jdbc:h2:file:./data/restaurant_db
jwt.secret=your-secret-key
```

### Frontend Config (`vite.config.js`)
```javascript
server: {
  proxy: {
    '/api': 'http://localhost:8084'
  }
}
```

## 🐛 Troubleshooting

### Common Issues

**CORS Errors**
- ✅ Backend CORS configured for `localhost:3000`
- ✅ Check browser developer tools

**401 Unauthorized**
- ✅ Check JWT token in localStorage
- ✅ Verify login credentials

**Connection Refused**
- ✅ Ensure backend is running on port 8084
- ✅ Check frontend proxy configuration

### Debug Steps
1. Check browser Network tab
2. Verify backend logs
3. Test API endpoints directly
4. Clear localStorage and retry

## 📊 System Status

✅ **Backend APIs** - All endpoints functional  
✅ **Frontend Components** - All UI components ready  
✅ **Authentication** - Multi-role auth working  
✅ **Database** - H2 configured and persistent  
✅ **File Upload** - Payment slip upload ready  
✅ **CORS** - Cross-origin requests configured  
✅ **Routing** - Role-based navigation working  

## 🎉 Success Checklist

- [ ] Backend starts without errors
- [ ] Frontend builds and runs
- [ ] Can login as admin/user
- [ ] Admin can manage users
- [ ] Menu management works
- [ ] File upload functions
- [ ] Database persists data
- [ ] All routes accessible

**🎊 Your restaurant management system is ready for use!**
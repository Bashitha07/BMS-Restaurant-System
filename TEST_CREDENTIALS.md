# 🔐 **BMS Restaurant System - Test Credentials & User Access Guide**

## **📋 Available Test Credentials**

### **👨‍💼 Admin Credentials:**
```
Username: admin
Password: admin123
Email: admin@example.com
Role: ADMIN
```

**Admin Access:**
- **Login URL**: `http://localhost:3001/login`
- **Admin Dashboard**: `http://localhost:3001/admin`
- **Admin Sections**:
  - Menu Management: `/admin/menu`
  - Order Management: `/admin/orders` 
  - Reservations: `/admin/reservations`
  - Driver Management: `/admin/drivers`
  - Payment Verification: `/admin/payments`

### **👤 Regular User Credentials:**
```
Username: user
Password: user123
Email: user@example.com
Role: USER
```

**User Access:**
- **Login URL**: `http://localhost:3001/login`
- **User Features**:
  - Browse Menu: `/menu`
  - Place Orders: `/checkout`
  - View Order History: `/orders`
  - Make Reservations: `/reservations`
  - Receive Notifications: Bell icon in navbar

### **🚗 Driver Access:**
```
Note: Driver credentials use the same login system
Currently configured drivers in system:
- Kamal Perera (CAR-1234)
- Sunil Silva (BIKE-5678) 
- Ravi Fernando (CAR-9876)
- Nimal Jayasinghe (BIKE-2468)
```

**Driver Access:**
- **Driver Dashboard**: `http://localhost:3001/driver/dashboard`
- **Driver Features**:
  - View assigned orders
  - Confirm pickup/delivery
  - Customer contact information
  - Order details and navigation

---

## **🎯 System Testing Workflow**

### **1. Admin Testing:**
1. **Login** as admin (admin/admin123)
2. **Navigate** to Admin Dashboard
3. **Test Driver Assignment**:
   - Go to `/admin/drivers`
   - View available drivers and pending orders
   - Assign orders to available drivers
4. **Test Payment Verification**:
   - Go to `/admin/payments`
   - Review deposit slips
   - Approve/reject payments

### **2. Customer Testing:**
1. **Login** as user (user/user123)
2. **Place Order**:
   - Browse menu at `/menu`
   - Add items to cart
   - Go to checkout
   - Select payment method (bank deposit)
   - Upload deposit slip
3. **Check Notifications**:
   - Bell icon shows order updates
   - Real-time status notifications

### **3. Driver Testing:**
1. **Access** Driver Dashboard at `/driver/dashboard`
2. **Test Order Workflow**:
   - View assigned orders
   - Click "Confirm Pickup"
   - Click "Confirm Delivery"
   - Check customer notifications update

---

## **🗄️ Database Test Data**

### **Test Users in Database:**
```sql
-- Admin User
Username: admin
Password: (bcrypt hashed)
Email: admin@example.com
Role: ADMIN

-- Regular User  
Username: user
Password: (bcrypt hashed)
Email: user@example.com
Role: USER
```

### **Sample Menu Items:**
- Margherita Pizza - Rs 27.50
- Caesar Salad - Rs 9.50
- Grilled Chicken Burger - Rs 13.50
- Chocolate Brownie - Rs 4.50
- Spaghetti Carbonara - Rs 11.50

---

## **🧪 API Testing Credentials**

### **Direct API Testing:**
```bash
# Login Test
POST http://localhost:8083/api/auth/login
Body: {"username":"admin","password":"admin123"}

# Registration Test
POST http://localhost:8083/api/users/register
Body: {"username":"newuser","email":"new@example.com","password":"password123"}
```

---

## **🚀 Quick Start Testing Guide**

### **Complete System Test Flow:**

1. **Admin Setup**:
   - Login as admin (admin/admin123)
   - Check driver availability at `/admin/drivers`
   - Review pending orders

2. **Customer Order**:
   - Login as user (user/user123)
   - Place order through checkout
   - Upload payment slip

3. **Admin Processing**:
   - Verify payment at `/admin/payments`
   - Assign driver at `/admin/drivers`

4. **Driver Delivery**:
   - Check driver dashboard
   - Confirm pickup and delivery

5. **Customer Tracking**:
   - Check notifications for real-time updates

---

## **🔑 Important Notes**

- **Fallback Authentication**: If backend is offline, frontend uses mock authentication
- **Mock Data**: Driver dashboard uses sample orders for testing
- **Development Mode**: All features work in development environment
- **Real-time Updates**: Notifications flow through entire system
- **Role-based Access**: Different features available per user role

---

## **📱 Access URLs Summary**

| Role | Login URL | Dashboard URL | Features |
|------|-----------|---------------|----------|
| **Admin** | `/login` | `/admin` | Driver assignment, payment verification, order management |
| **User** | `/login` | `/` | Order placement, history, notifications |
| **Driver** | `/login` | `/driver/dashboard` | Order pickup/delivery confirmation |

**Test with confidence!** 🎯 All credentials are pre-configured and ready for immediate testing.
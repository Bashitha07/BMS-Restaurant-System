# 🚀 **BMS Restaurant System - Testing Guide**

## **✅ System Status:**
- **Frontend**: Running on `http://localhost:3002`
- **Backend**: Ready to start (use Maven or manual startup)
- **Database**: H2 in-memory database (auto-configured)

## **🎯 Quick Start Testing:**

### **1. Access the Application:**
```
Main URL: http://localhost:3002
```

### **2. Test User Login:**
```
Username: user
Password: user123
```

**Testing Steps:**
1. Click "Login" in the navbar
2. Enter credentials: `user` / `user123`
3. Verify login success and navbar changes

### **3. Test Admin Login:**
```
Username: admin  
Password: admin123
```

**Testing Steps:**
1. Login with admin credentials
2. Navigate to Admin Dashboard
3. Test all admin features

## **📱 Feature Testing Checklist:**

### **🛍️ Customer Features:**
- [ ] **Browse Menu**: Navigate to `/menu`
- [ ] **Add to Cart**: Click items and add to cart
- [ ] **Checkout Process**: Complete order placement
- [ ] **Payment Upload**: Upload deposit slip image
- [ ] **Order History**: View past orders at `/orders`
- [ ] **Notifications**: Check bell icon for updates
- [ ] **Reservations**: Make table reservations

### **👨‍💼 Admin Features:**
- [ ] **Driver Management**: `/admin/drivers`
  - View available drivers
  - Assign orders to drivers
  - Update driver status
- [ ] **Payment Verification**: `/admin/payments`
  - Review deposit slips
  - Approve/reject payments
- [ ] **Order Management**: `/admin/orders`
  - Track order status
  - Update order progress
- [ ] **Menu Management**: `/admin/menu`
  - Add/edit menu items
  - Update prices and availability

### **🚗 Driver Features:**
- [ ] **Driver Dashboard**: `/driver/dashboard`
  - View assigned orders
  - Confirm pickup
  - Confirm delivery
  - Access customer contact info

## **🔧 Testing Scenarios:**

### **Scenario 1: Complete Order Flow**
1. **Customer**: Login → Browse menu → Add items → Checkout → Upload payment
2. **Admin**: Verify payment → Assign driver
3. **Driver**: Confirm pickup → Confirm delivery
4. **Customer**: Receive real-time notifications

### **Scenario 2: Driver Assignment**
1. **Admin**: Login → Go to `/admin/drivers`
2. **Action**: Click "Assign Driver" on pending order
3. **Verify**: Driver receives order in dashboard
4. **Check**: Customer gets driver assignment notification

### **Scenario 3: Payment Verification**
1. **Customer**: Complete order with deposit slip upload
2. **Admin**: Go to `/admin/payments`
3. **Action**: Review and approve payment
4. **Verify**: Customer receives payment confirmation

## **🛠️ Backend Setup (Optional):**

If you want to test with real backend:

```powershell
# In restaurant-system directory
./mvnw.cmd spring-boot:run

# Or with Maven installed
mvn spring-boot:run
```

**Backend Features:**
- RESTful API endpoints
- Database persistence
- Authentication & authorization
- Real-time order processing

## **📊 Mock Data Available:**

### **Users:**
- Admin: admin/admin123
- User: user/user123

### **Drivers:**
- Kamal Perera (CAR-1234) - Available
- Sunil Silva (BIKE-5678) - Busy
- Ravi Fernando (CAR-9876) - Available
- Nimal Jayasinghe (BIKE-2468) - Offline

### **Sample Orders:**
- Multiple pending orders ready for assignment
- Order history with various statuses
- Payment slips for verification

## **🎨 UI Features to Test:**

### **Design Elements:**
- [ ] Responsive design (mobile/desktop)
- [ ] Color-coded status indicators
- [ ] Real-time toast notifications
- [ ] Interactive modals and forms
- [ ] Image upload functionality
- [ ] Navigation between sections

### **User Experience:**
- [ ] Smooth login/logout flow
- [ ] Cart functionality with persistence
- [ ] Role-based navigation
- [ ] Real-time status updates
- [ ] Error handling and validation

## **🚨 Troubleshooting:**

### **Common Issues:**
1. **Port Conflicts**: Frontend auto-switches to available port
2. **Backend Offline**: System uses mock authentication
3. **Image Upload**: Supports PNG/JPG up to 5MB
4. **Browser Cache**: Clear cache if experiencing issues

### **Success Indicators:**
- ✅ Login redirects to appropriate dashboard
- ✅ Notifications appear in real-time
- ✅ Orders flow through complete lifecycle
- ✅ Admin actions trigger system updates
- ✅ Driver confirmations update customer status

## **📝 Test Results Tracking:**

Document your testing:
- [ ] All login credentials work
- [ ] Order placement successful
- [ ] Payment upload functional
- [ ] Driver assignment working
- [ ] Notifications system active
- [ ] Admin controls operational

**Happy Testing!** 🎯

The system is fully functional and ready for comprehensive testing of all restaurant management features.
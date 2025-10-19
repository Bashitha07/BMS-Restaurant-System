# 🔧 Quick Fix - Order Creation Error

## ✅ What Was Fixed

### 1. **MySQL Password Updated**
- Changed from: `spring.datasource.password=` (empty)
- Changed to: `spring.datasource.password=rootpass`

### 2. **Backend Server Needs Restart**
The backend must be restarted for the password change to take effect.

---

## 🚀 **SOLUTION: Start the Servers Properly**

### **Step 1: Close All Running Terminals**
- Close any terminals running Spring Boot or React
- Make sure no Java or Node processes are stuck

### **Step 2: Verify XAMPP MySQL is Running**
1. Open XAMPP Control Panel
2. Ensure **MySQL is running** (green status)
3. Your MySQL root password should be `rootpass`

### **Step 3: Run the Batch File**

**IMPORTANT:** Run this in PowerShell (not in VSCode integrated terminal):

```powershell
cd C:\SpringBoot\restaurant-system
.\start-servers.bat
```

This will:
1. Prompt you to confirm MySQL is running
2. Open a **new CMD window** for the backend (Spring Boot)
3. Wait 15 seconds
4. Open another **new CMD window** for the frontend (React)

**DO NOT CLOSE** the CMD windows - let them run!

---

## ✨ **Alternative: Manual Start (If Batch File Doesn't Work)**

### **Terminal 1 - Backend:**

Open a **new PowerShell window** (NOT in VSCode):

```powershell
cd C:\SpringBoot\restaurant-system
mvn clean spring-boot:run
```

**Wait for this message:**
```
Started RestaurantSystemApplication in X.XXX seconds
```

### **Terminal 2 - Frontend:**

Open **another new PowerShell window**:

```powershell
cd C:\SpringBoot\restaurant-system\frontend
npm run dev
```

---

## 🔍 **Verify Everything is Working**

### 1. **Backend Running:**
Visit: http://localhost:8084/api/menus

Should return JSON data (not 404)

### 2. **Frontend Running:**
Visit: http://localhost:5173

Should show your restaurant website

### 3. **Test Order Creation:**
1. Add items to cart
2. Go to checkout
3. Fill in details
4. Click "Place Order"
5. Should see success message (not "Resource not found")

---

## 🛑 **If You Still Get 404 Error:**

### Check Backend Console:
Look for this in the backend terminal:
```
Tomcat started on port 8084 (http) with context path '/'
Started RestaurantSystemApplication in X.XXX seconds
```

If you don't see this, the backend didn't start successfully.

### Common Issues:

**Port 8084 already in use:**
```powershell
# Find what's using port 8084
netstat -ano | findstr :8084

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F
```

**MySQL not accessible:**
```powershell
# Test MySQL connection
cd C:\xampp\mysql\bin
mysql -u root -prootpass

# If it fails, your password is different
# Update application.properties with correct password
```

---

## 📊 **Expected Behavior After Fix:**

### Frontend Console (F12):
✅ No more "Failed to load resource: 404"  
✅ Order creation succeeds

### Backend Console:
✅ Shows "Creating new order" log  
✅ Shows "Order created with id: X" log

---

## 🎯 **Quick Test:**

Open browser console (F12) and run:
```javascript
fetch('http://localhost:8084/api/menus')
  .then(r => r.json())
  .then(console.log)
```

Should show menu data, not 404 error.

---

*Last Updated: October 19, 2025*
*Password: rootpass | Backend: 8084 | Frontend: 5173*

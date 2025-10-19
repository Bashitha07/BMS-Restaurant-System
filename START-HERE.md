# 🚀 START YOUR RESTAURANT SYSTEM

## ⚠️ CRITICAL FIRST STEP: Fix MySQL Password!

Your MySQL root password is **NOT** `rootpass`. 

### **Find Your Real Password:**

Open Command Prompt and try:

```cmd
cd C:\xampp\mysql\bin

REM Try 1: Empty password (most common for XAMPP)
mysql -u root
```

If that works, your password is **EMPTY**! ✅ Already fixed in application.properties!

If not, try:
```cmd
mysql -u root -proot
mysql -u root -padmin  
mysql -u root -ppassword
```

**Whichever command logs you in successfully, that's your password!**

Then update `src/main/resources/application.properties`:
```properties
spring.datasource.password=YOUR_ACTUAL_PASSWORD
```

---

## 📋 **Once Password is Fixed:**

### **Option 1: PowerShell Scripts (RECOMMENDED)**

Open **TWO separate PowerShell windows**:

#### **Terminal 1 - Backend:**
```powershell
cd C:\SpringBoot\restaurant-system
.\start-backend.ps1
```

#### **Terminal 2 - Frontend:**
```powershell
cd C:\SpringBoot\restaurant-system
.\start-frontend.ps1
```

---

### **Option 2: Batch File**
```powershell
.\start-servers.bat
```
This opens 2 CMD windows automatically.

---

### **Option 3: Manual Commands**

#### **Terminal 1 - Backend:**
```powershell
cd C:\SpringBoot\restaurant-system
mvn clean
mvn spring-boot:run
```

#### **Terminal 2 - Frontend:**
```powershell
cd C:\SpringBoot\restaurant-system\frontend
npm run dev
```

---

## ✅ **Verify Everything Works:**

### **1. Backend Started Successfully:**
Look for this in the backend terminal:
```
Started RestaurantSystemApplication in X.XXX seconds
Tomcat started on port 8084 (http)
```

**Test:** http://localhost:8084/api/menus (should return JSON, not 404)

### **2. Frontend Started Successfully:**
Look for this in the frontend terminal:
```
VITE v5.x.x ready in XXX ms
➜  Local:   http://localhost:5173/
```

**Test:** http://localhost:5173 (should show your website)

---

## 🌐 **Access Your Application:**

- **Frontend UI:** http://localhost:5173
- **Backend API:** http://localhost:8084/api

---

## 🛑 **If Backend Still Fails with Password Error:**

The password is **STILL WRONG**!

### **EASIEST FIX: Set MySQL password to EMPTY**

1. Open XAMPP Shell or CMD:
```cmd
cd C:\xampp\mysql\bin
mysql -u root -p
```

2. Enter your CURRENT password (whatever it is)

3. Run this:
```sql
ALTER USER 'root'@'localhost' IDENTIFIED BY '';
FLUSH PRIVILEGES;
EXIT;
```

4. Verify `application.properties` has:
```properties
spring.datasource.password=
```

5. Restart backend server

---

## 📊 **System Requirements:**

- ✅ XAMPP MySQL running (port 3306)
- ✅ Database `restaurant_db` exists
- ✅ Java 24 installed
- ✅ Maven 3.9.11 installed
- ✅ Node.js installed
- ✅ **CORRECT MySQL password configured!**

---

*Last Updated: October 19, 2025*
*Current Config: MySQL password set to EMPTY (default XAMPP)*

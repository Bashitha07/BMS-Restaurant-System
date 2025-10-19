# 🚀 Restaurant System - Quick Start Guide

## ✅ What Was Fixed

**Issue:** `Access denied for user 'root'@'localhost' (using password: YES)`

**Solution:** Changed MySQL password in `application.properties` from `root` to empty (XAMPP default)

---

## 📋 Prerequisites Check

### 1. **MySQL/XAMPP Running**
- Open XAMPP Control Panel
- Ensure **MySQL** is running (green status)
- If not, click "Start" next to MySQL

### 2. **Database Exists**
- Click "Admin" next to MySQL in XAMPP (opens phpMyAdmin)
- Verify `restaurant_db` database exists
- If not, run the SQL from `database-setup.sql`

### 3. **Node.js Installed**
```powershell
node --version
npm --version
```
Should show version numbers.

---

## 🎯 Manual Startup (Recommended)

### Step 1: Start Backend (Spring Boot)

Open PowerShell in project directory:

```powershell
cd C:\SpringBoot\restaurant-system
mvn clean spring-boot:run
```

**Wait for this message:**
```
Started RestaurantSystemApplication in X.XXX seconds
```

**Backend will be at:** http://localhost:8084

### Step 2: Start Frontend (React + Vite)

Open a **NEW** PowerShell window:

```powershell
cd C:\SpringBoot\restaurant-system\frontend
npm install
npm run dev
```

**Frontend will be at:** http://localhost:5173

---

## 🔧 If MySQL Password Is NOT Empty

If you get the same authentication error, your MySQL root password is different.

### Find Your MySQL Password:

1. **Try logging in via XAMPP Shell:**
   ```cmd
   cd C:\xampp\mysql\bin
   mysql -u root
   ```

2. **If prompted for password, try:**
   - Empty (just press Enter)
   - `root`
   - `admin`
   - `password`

3. **Once logged in, set it to empty:**
   ```sql
   ALTER USER 'root'@'localhost' IDENTIFIED BY '';
   FLUSH PRIVILEGES;
   EXIT;
   ```

4. **OR** Update `src/main/resources/application.properties`:
   ```properties
   spring.datasource.password=YOUR_ACTUAL_PASSWORD
   ```

---

## ✨ Quick Start with Batch File

**Use the provided batch file** (starts both servers):

```powershell
.\start-servers.bat
```

This will:
1. Start Spring Boot backend on port 8084
2. Wait 10 seconds
3. Start React frontend on port 5173
4. Open two separate terminal windows

---

## 🌐 Access Your Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8084/api
- **Example Endpoint:** http://localhost:8084/api/menu

---

## 🛠️ Troubleshooting

### Backend Won't Start

**Check MySQL:**
```powershell
# Test MySQL connection
cd C:\xampp\mysql\bin
mysql -u root -p
# Enter password (or just press Enter if empty)
```

**Check port 8084:**
```powershell
netstat -ano | findstr :8084
```

### Frontend Won't Start

**Reinstall dependencies:**
```powershell
cd C:\SpringBoot\restaurant-system\frontend
rm -r node_modules
rm package-lock.json
npm install
npm run dev
```

**Check port 5173:**
```powershell
netstat -ano | findstr :5173
```

---

## 📊 Current Configuration

- **Database:** MySQL 8.0 (XAMPP)
- **Database Name:** `restaurant_db`
- **Database User:** `root`
- **Database Password:** ` ` (empty)
- **Backend Port:** 8084
- **Frontend Port:** 5173
- **Java Version:** 24
- **Spring Boot:** 3.5.6
- **React:** Vite dev server

---

## 🎉 Success Indicators

### Backend Started Successfully:
```
Started RestaurantSystemApplication in X.XXX seconds (JVM running for Y.YYY)
Tomcat started on port 8084
```

### Frontend Started Successfully:
```
VITE v5.x.x  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

---

*Last Updated: October 19, 2025*
*Password configuration updated for XAMPP default (empty password)*

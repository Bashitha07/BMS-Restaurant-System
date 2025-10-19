# Fix MySQL Password Issue

## Problem
```
Access denied for user 'root'@'localhost' (using password: YES)
```

Your application expects MySQL root password to be `root`, but it's currently different.

## Solution Options

### Option 1: Reset MySQL Root Password to 'root' (XAMPP)

1. **Stop MySQL** (if running via XAMPP Control Panel)

2. **Open XAMPP Shell** or Command Prompt as Administrator

3. **Navigate to MySQL bin directory:**
   ```cmd
   cd C:\xampp\mysql\bin
   ```

4. **Login to MySQL** (without password or with current password):
   ```cmd
   mysql -u root
   ```
   
   If prompted for password, try common XAMPP defaults:
   - Empty (just press Enter)
   - `root`
   - `admin`
   - `password`

5. **Change the password to 'root':**
   ```sql
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'root';
   FLUSH PRIVILEGES;
   EXIT;
   ```

6. **Restart MySQL** from XAMPP Control Panel

---

### Option 2: Update application.properties to Match Current Password

If you know your current MySQL root password (e.g., empty password):

**Edit:** `src/main/resources/application.properties`

**Change this line:**
```properties
spring.datasource.password=root
```

**To one of these:**

**For empty password:**
```properties
spring.datasource.password=
```

**For specific password (replace 'yourpassword'):**
```properties
spring.datasource.password=yourpassword
```

---

### Option 3: Quick Fix - Set Empty Password in MySQL

1. **Open XAMPP Shell:**
   ```cmd
   cd C:\xampp\mysql\bin
   mysql -u root -p
   ```

2. **Enter current password when prompted**

3. **Remove password:**
   ```sql
   ALTER USER 'root'@'localhost' IDENTIFIED BY '';
   FLUSH PRIVILEGES;
   EXIT;
   ```

4. **Update application.properties:**
   ```properties
   spring.datasource.password=
   ```

---

## Verify MySQL is Running

1. Open XAMPP Control Panel
2. Ensure MySQL is running (green highlight)
3. Click "Admin" to open phpMyAdmin
4. Verify `restaurant_db` database exists

---

## Test Connection After Fix

```cmd
cd C:\SpringBoot\restaurant-system
mvn spring-boot:run
```

Should see: `Started RestaurantSystemApplication` without errors.

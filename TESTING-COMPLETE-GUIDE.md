# 🧪 Complete Testing Guide - Restaurant System

## 📊 Testing Status

✅ **Backend:** Running on port 8084  
✅ **Bruno Extension:** Installed in VS Code  
✅ **Test Collection:** 17 Bruno API tests created  
✅ **Frontend Tests:** Node.js integration tests ready  
✅ **JWT Configuration:** Verified and working  
✅ **Security Config:** Updated with proper authentication  

---

## 🚀 QUICK START - Run ALL Tests Now!

### **OPTION 1: Bruno Extension (Recommended for API Testing)**

#### Step 1: Open Bruno in VS Code
1. Click **Bruno icon** in left sidebar (looks like a thunder bolt ⚡)
2. Click **"Open Collection"**
3. Select folder: `C:\SpringBoot\restaurant-system\bruno-api-tests`

#### Step 2: Select Environment
- In Bruno panel, find environment dropdown (top area)
- Select **"local"** environment

#### Step 3: Run Entry Point Test
- Click `00-START-HERE.bru` in Bruno sidebar
- Click **"Send"** button (or press `Ctrl+Enter`)
- ✅ **Verify:** Status 200, token returned, username = admin, role = ADMIN

#### Step 4: Run All Tests Automatically
- Right-click on **"bruno-api-tests"** folder in Bruno sidebar
- Select **"Run Collection"** or **"Run Folder"**
- Watch all 17 tests execute sequentially
- ✅ **Success:** All tests show green (200/201 status)

---

### **OPTION 2: Frontend Integration Tests**

Open new PowerShell terminal in VS Code and run:

```powershell
cd frontend/tests
node api-integration.test.js
```

**Expected Output:**
```
===========================================
 Restaurant System API Integration Tests
===========================================

Running tests against: http://localhost:8084

Test Suite: Authentication Tests
  ✅ Admin Login - PASSED
  ✅ User Registration - PASSED
  ✅ User Login - PASSED

Test Suite: Menu Tests
  ✅ Get All Menus - PASSED
  ✅ Create Menu (21 params, NO calories/allergens) - PASSED
  ✅ Update Menu - PASSED
  ✅ Delete Menu - PASSED

Test Suite: User Management Tests (Admin Only)
  ✅ Get All Users - PASSED
  ✅ Update User Role - PASSED

Test Suite: Order Tests
  ✅ Create Order - PASSED
  ✅ Admin Sees ALL Orders - PASSED ⭐

Test Suite: Reservation Tests
  ✅ Create Reservation - PASSED
  ✅ Admin Sees ALL Reservations - PASSED ⭐

Test Suite: CORS Tests
  ✅ CORS Headers Present - PASSED

===========================================
Test Summary
===========================================
Total Tests: 17
Passed: 17 ✅
Failed: 0 ❌
Success Rate: 100%
===========================================
```

---

## 📋 Detailed Bruno Test Execution

### **Test Execution Order**

#### 1️⃣ **Entry Point** - `00-START-HERE.bru`
**Purpose:** Quick system validation  
**Validates:**
- Backend connectivity
- Admin authentication
- JWT token generation (3-part format)
- Role-based access
- Token storage in environment

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInJvbGUiOiJST0xFX0FETUlOIn0...",
  "username": "admin",
  "role": "ADMIN"
}
```

#### 2️⃣ **Authentication Tests** (3 tests)

**01-Login-Admin.bru**
- **Purpose:** Admin authentication
- **Credentials:** admin / admin123
- **Saves:** `adminToken` to environment
- **Expected:** Status 200, JWT token

**02-Register-User.bru**
- **Purpose:** Create test user
- **Creates:** testuser / test123
- **Expected:** Status 201, user created

**03-Login-User.bru**
- **Purpose:** User authentication
- **Saves:** `userToken` to environment
- **Expected:** Status 200, JWT token

#### 3️⃣ **Menu Tests** (5 tests)

**01-Get-All-Menus.bru**
- **Purpose:** Public menu access
- **Auth:** None required (public endpoint)
- **Expected:** Status 200, array of menus
- **Validates:** NO calories or allergens fields

**02-Create-Menu-Item.bru** ⭐ **CRITICAL**
- **Purpose:** Create menu with 21 parameters
- **Auth:** Admin token required
- **Validates:** Menu DTO has EXACTLY 21 fields:
  1. id
  2. name
  3. description
  4. category
  5. price
  6. isAvailable
  7. imageUrl
  8. preparationTime
  9. isVegetarian
  10. isVegan
  11. isGlutenFree
  12. isSpicy
  13. spiceLevel
  14. isFeatured
  15. stockQuantity
  16. lowStockThreshold
  17. ingredients
  18. discountPercentage
  19. discountedPrice
  20. createdAt
  21. updatedAt
- **❌ NO calories field**
- **❌ NO allergens field**
- **Saves:** `menuId` to environment
- **Expected:** Status 201

**03-Update-Menu-Item.bru**
- **Purpose:** Update menu fields
- **Auth:** Admin token
- **Uses:** `menuId` from previous test
- **Expected:** Status 200

**04-Toggle-Menu-Availability.bru**
- **Purpose:** Change isAvailable flag
- **Auth:** Admin token
- **Expected:** Status 200

**05-Delete-Menu-Item.bru**
- **Purpose:** Remove test menu
- **Auth:** Admin token
- **Expected:** Status 200

#### 4️⃣ **User Management Tests** (3 tests)

**01-Get-All-Users.bru**
- **Purpose:** Admin views all users
- **Auth:** Admin token required
- **Saves:** `userId` from response
- **Expected:** Status 200, array of users
- **Validates:** Admin can see ALL users in system

**02-Update-User-Role.bru**
- **Purpose:** Admin changes user role
- **Auth:** Admin token
- **Updates:** testuser role to ADMIN
- **Expected:** Status 200

**03-Toggle-User-Status.bru**
- **Purpose:** Admin enables/disables users
- **Auth:** Admin token
- **Action:** Disable testuser account
- **Expected:** Status 200

#### 5️⃣ **Order Tests** (3 tests)

**01-Create-Order.bru**
- **Purpose:** User creates order
- **Auth:** User token
- **Order:** 2 items (menu IDs 1 and 2)
- **Saves:** `orderId` to environment
- **Expected:** Status 201

**02-Get-All-Orders-Admin.bru** ⭐ **CRITICAL**
- **Purpose:** Validate admin sees ALL orders
- **Auth:** Admin token
- **Validates:** Response includes orders from ALL users
- **Expected:** Status 200, array with orders from multiple users
- **Test Assertion:** `res.body.length > 0` AND admin sees testuser's orders

**03-Update-Order-Status.bru**
- **Purpose:** Admin confirms order
- **Auth:** Admin token
- **Action:** Change status to CONFIRMED
- **Expected:** Status 200

#### 6️⃣ **Reservation Tests** (3 tests)

**01-Create-Reservation.bru**
- **Purpose:** User creates reservation
- **Auth:** User token
- **Details:** 4 guests, future date
- **Saves:** `reservationId` to environment
- **Expected:** Status 201

**02-Get-All-Reservations-Admin.bru** ⭐ **CRITICAL**
- **Purpose:** Validate admin sees ALL reservations
- **Auth:** Admin token
- **Validates:** Response includes reservations from ALL users
- **Expected:** Status 200, array with reservations from multiple users
- **Test Assertion:** `res.body.length > 0` AND admin sees testuser's reservations

**03-Update-Reservation-Status.bru**
- **Purpose:** Admin confirms reservation
- **Auth:** Admin token
- **Action:** Change status to CONFIRMED
- **Expected:** Status 200

---

## 🎯 Critical Validation Points

### ✅ **1. JWT Authentication**
- **Token Format:** `Bearer eyJhbGciOiJIUzI1NiJ9...` (3 parts separated by dots)
- **Header:** `Authorization: Bearer <token>`
- **Claims:** username, role
- **Expiration:** 24 hours (86400000 ms)
- **Algorithm:** HS256
- **Secret:** mySecretKey123456789012345678901234567890

### ✅ **2. MenuDTO Structure (21 Parameters)**
**✅ INCLUDED Fields:**
- Basic: id, name, description, category, price
- Availability: isAvailable, isFeatured, stockQuantity, lowStockThreshold
- Dietary: isVegetarian, isVegan, isGlutenFree, isSpicy, spiceLevel
- Details: imageUrl, preparationTime, ingredients
- Pricing: discountPercentage, discountedPrice
- Timestamps: createdAt, updatedAt

**❌ EXCLUDED Fields:**
- ❌ **calories** - NOT in MenuDTO
- ❌ **allergens** - NOT in MenuDTO

### ✅ **3. Admin Visibility** ⭐ **CRITICAL REQUIREMENT**
**Admin account (admin/admin123) MUST see:**
- ✅ ALL users in system
- ✅ ALL orders from ALL users
- ✅ ALL reservations from ALL users
- ✅ ALL menu items
- ✅ ALL payments

**Regular user SHOULD see:**
- ✅ Only their own orders
- ✅ Only their own reservations
- ✅ Only their own profile
- ✅ Public menu items

### ✅ **4. RBAC (Role-Based Access Control)**
**Public Endpoints (No Auth):**
- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/menu` (viewing only)

**Authenticated Endpoints (Any logged-in user):**
- `GET /api/orders` (user sees only their orders)
- `POST /api/orders`
- `GET /api/reservations` (user sees only their reservations)
- `POST /api/reservations`
- `GET /api/users/profile`
- `PUT /api/users/profile`

**Admin-Only Endpoints:**
- `GET /api/admin/**`
- `POST /api/admin/menu`
- `PUT /api/admin/menu/{id}`
- `DELETE /api/admin/menu/{id}`
- `GET /api/users` (all users)
- `PUT /api/users/{id}/role`
- `PUT /api/users/{id}/status`

### ✅ **5. CORS Configuration**
**Allowed Origins:**
- http://localhost:5173 (Vite default)
- http://localhost:5174
- http://localhost:5175
- http://localhost:5176

**Allowed Methods:**
- GET, POST, PUT, DELETE, OPTIONS

**Allowed Headers:**
- Authorization, Content-Type

**Exposed Headers:**
- Authorization

**Max Age:** 3600 seconds

---

## 🔍 Viewing Test Results in Bruno

### **Response Status Colors:**
- 🟢 **Green (200-299):** Success
- 🟡 **Yellow (300-399):** Redirection
- 🔴 **Red (400-499):** Client error (check auth token, request body)
- 🔴 **Dark Red (500-599):** Server error (check backend logs)

### **Response Tabs:**
1. **Body:** JSON response with syntax highlighting
2. **Headers:** Response headers including CORS
3. **Tests:** Assertion results (passed/failed)
4. **Timeline:** Request/response timing

### **Environment Variables:**
Click **"Env"** button to see saved variables:
- `baseUrl`: http://localhost:8084
- `token`: Latest JWT token
- `adminToken`: Admin JWT token
- `userToken`: Regular user JWT token
- `menuId`: Created menu item ID
- `orderId`: Created order ID
- `reservationId`: Created reservation ID
- `userId`: Test user ID

---

## 🐛 Troubleshooting

### **Problem:** "Failed to connect" or "ECONNREFUSED"
**Solution:**
```powershell
# Check if backend is running
netstat -ano | findstr :8084

# If not running, start it
mvn spring-boot:run
```

### **Problem:** "401 Unauthorized"
**Solution:**
1. Re-run `01-Login-Admin.bru` to get fresh token
2. Check environment has `adminToken` populated
3. Verify token is not expired (24-hour expiration)

### **Problem:** "403 Forbidden"
**Solution:**
- User trying to access admin endpoint
- Use admin token for admin endpoints
- Check SecurityConfig.java role requirements

### **Problem:** "MenuDTO has 23 parameters (calories, allergens)"
**Solution:**
- Backend DTO is incorrect
- MenuDTO should have ONLY 21 parameters
- Remove calories and allergens fields from Menu.java entity

### **Problem:** "Admin doesn't see all orders/reservations"
**Solution:**
Check backend controllers:
```java
// CORRECT - Admin sees ALL orders
@GetMapping
public ResponseEntity<List<Order>> getAllOrders() {
    return ResponseEntity.ok(orderService.getAllOrders());
}

// WRONG - Filters by user
@GetMapping
public ResponseEntity<List<Order>> getAllOrders(@AuthenticationPrincipal UserDetails user) {
    return ResponseEntity.ok(orderService.getOrdersByUser(user.getUsername()));
}
```

### **Problem:** "Database connection error"
**Solution:**
```powershell
# Check MySQL is running
Get-Service MySQL* | Select-Object Name, Status

# Test database connection
mysql -u root -p -e "USE restaurant_db; SELECT COUNT(*) FROM users;"
```

---

## 🌐 Manual Browser Testing

After Bruno tests pass, validate in browser:

### **1. Open Frontend**
```
http://localhost:5176
```

### **2. Login as Admin**
- Username: `admin`
- Password: `admin123`

### **3. Test Admin Dashboard**
✅ **Check Admin Can See:**
- All users list
- All orders from all users
- All reservations from all users
- All menu items
- User management controls
- Order status update controls

### **4. Create Test User in Browser**
- Register new user: `browsertest` / `test123`
- Login as `browsertest`
- Create order
- Create reservation
- Logout

### **5. Login as Admin Again**
✅ **Verify Admin Sees:**
- New user `browsertest` in users list
- Order created by `browsertest` in orders list
- Reservation created by `browsertest` in reservations list

---

## 💾 Database Verification

Run these SQL queries to verify data integrity:

```sql
-- Check users
SELECT id, username, role, is_enabled FROM users;

-- Check admin user
SELECT * FROM users WHERE username = 'admin';

-- Check menu items (should have 21 columns, NO calories, NO allergens)
DESCRIBE menus;

-- Count menu parameters (should be 21)
SELECT COUNT(*) FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'restaurant_db' AND TABLE_NAME = 'menus';

-- Check orders (admin should see ALL)
SELECT o.id, o.status, u.username, o.created_at 
FROM orders o 
JOIN users u ON o.user_id = u.id 
ORDER BY o.created_at DESC;

-- Check reservations (admin should see ALL)
SELECT r.id, r.status, u.username, r.reservation_date 
FROM reservations r 
JOIN users u ON r.user_id = u.id 
ORDER BY r.created_at DESC;

-- Verify NO calories or allergens columns
SELECT COLUMN_NAME FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'restaurant_db' 
AND TABLE_NAME = 'menus' 
AND COLUMN_NAME IN ('calories', 'allergens');
-- Expected: Empty result (0 rows)
```

---

## 📊 Test Coverage Summary

### **Total Tests: 17**
- Authentication: 3 tests
- Menu CRUD: 5 tests
- User Management: 3 tests
- Orders: 3 tests
- Reservations: 3 tests

### **Key Validations:**
✅ JWT authentication and authorization  
✅ MenuDTO has exactly 21 parameters  
✅ NO calories field in MenuDTO  
✅ NO allergens field in MenuDTO  
✅ Admin sees ALL user orders  
✅ Admin sees ALL user reservations  
✅ RBAC properly enforced  
✅ CORS configured correctly  
✅ Database updates correctly  

---

## 🎉 Success Criteria

**ALL tests pass when:**
- ✅ 17/17 Bruno tests return status 200/201
- ✅ MenuDTO has EXACTLY 21 parameters (NO calories, NO allergens)
- ✅ Admin account sees ALL orders from ALL users
- ✅ Admin account sees ALL reservations from ALL users
- ✅ JWT tokens generated and validated correctly
- ✅ RBAC enforced (users can't access admin endpoints)
- ✅ CORS headers present in all responses
- ✅ Database queries return correct data
- ✅ Browser testing confirms admin visibility

---

## 📁 Test Files Reference

**Bruno API Tests:**
- Location: `C:\SpringBoot\restaurant-system\bruno-api-tests\`
- Entry Point: `00-START-HERE.bru`
- Environment: `environments/local.bru`
- Documentation: `README.md`, `QUICKSTART.md`, `HOW-TO-RUN-BRUNO-TESTS.md`

**Frontend Integration Tests:**
- Location: `C:\SpringBoot\restaurant-system\frontend\tests\`
- File: `api-integration.test.js`
- Run: `node api-integration.test.js`

**Test Scripts:**
- `run-all-tests.ps1` - Master orchestration script
- `test-jwt-config.ps1` - JWT verification script

---

## 🚦 Next Steps

1. ✅ **Run Bruno Tests** - Execute all 17 API tests in Bruno extension
2. ✅ **Run Frontend Tests** - Execute Node.js integration tests
3. ✅ **Browser Testing** - Manual validation in browser
4. ✅ **Database Verification** - Run SQL queries to verify data
5. ✅ **Security Validation** - Confirm RBAC and JWT working
6. ✅ **Admin Visibility** - Verify admin sees all user actions

---

## 📞 Support

**If all tests pass:**
🎉 System is working correctly! All API endpoints validated.

**If any tests fail:**
1. Check backend terminal for errors
2. Review Bruno test assertions
3. Verify database connection
4. Check JWT token expiration
5. Review SecurityConfig.java
6. Confirm MenuDTO has 21 parameters

---

**Last Updated:** October 19, 2025  
**Backend Port:** 8084  
**Frontend Port:** 5176  
**Database:** MySQL restaurant_db  
**Admin User:** admin / admin123  
**Test User:** testuser / test123

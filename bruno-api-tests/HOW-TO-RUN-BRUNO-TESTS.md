# How to Run Bruno API Tests in VS Code

## ✅ Prerequisites
- ✓ Bruno extension is already installed in VS Code
- ✓ Backend is running on port 8084
- ✓ Database is accessible

## 📋 Step-by-Step Instructions

### 1. Open Bruno Collection
1. Click the **Bruno icon** in VS Code's left sidebar (Activity Bar)
2. Click **"Open Collection"** button
3. Navigate to: `C:\SpringBoot\restaurant-system\bruno-api-tests`
4. Click **"Select Folder"**

### 2. Select Environment
1. In the Bruno sidebar, find the **Environment dropdown** (top right of Bruno panel)
2. Select **"local"** environment
3. This loads all environment variables (baseUrl, tokens, etc.)

### 3. Run Tests in Order

#### **STEP 1: Run Entry Point Test**
**File:** `00-START-HERE.bru`
- Click on `00-START-HERE.bru` in Bruno sidebar
- Click the **"Send"** button (or press Ctrl+Enter)
- ✅ Verify response shows:
  - Status: **200 OK**
  - Response contains: `"token"`, `"username": "admin"`, `"role": "ADMIN"`
- ⚠️ **CRITICAL:** This saves `adminToken` to environment - needed for all other tests

#### **STEP 2: Authentication Tests**
Expand **Authentication** folder and run sequentially:

1. **01-Login-Admin.bru**
   - Expected: Status 200, JWT token returned
   - Saves: `adminToken` to environment

2. **02-Register-User.bru**
   - Expected: Status 201, new user created
   - Creates: username "testuser", password "test123"

3. **03-Login-User.bru**
   - Expected: Status 200, JWT token returned
   - Saves: `userToken` to environment

#### **STEP 3: Menu Tests**
Expand **Menu** folder and run sequentially:

1. **01-Get-All-Menus.bru**
   - Expected: Status 200, array of menu items
   - ✅ Validates: NO calories or allergens fields

2. **02-Create-Menu-Item.bru** ⭐ **CRITICAL**
   - Expected: Status 201, menu item created
   - ✅ Validates: Menu has exactly **21 parameters** (NO calories, NO allergens)
   - Saves: `menuId` to environment

3. **03-Update-Menu-Item.bru**
   - Expected: Status 200, menu updated
   - Uses: `menuId` from previous test

4. **04-Toggle-Menu-Availability.bru**
   - Expected: Status 200, availability changed

5. **05-Delete-Menu-Item.bru**
   - Expected: Status 200, menu deleted

#### **STEP 4: Users Tests (Admin Only)**
Expand **Users** folder and run sequentially:

1. **01-Get-All-Users.bru**
   - Expected: Status 200, array of all users
   - Uses: `adminToken`
   - Saves: `userId`

2. **02-Update-User-Role.bru**
   - Expected: Status 200, user role changed to ADMIN

3. **03-Toggle-User-Status.bru**
   - Expected: Status 200, user disabled

#### **STEP 5: Orders Tests**
Expand **Orders** folder and run sequentially:

1. **01-Create-Order.bru**
   - Expected: Status 201, order created
   - Uses: `userToken`
   - Saves: `orderId`

2. **02-Get-All-Orders-Admin.bru** ⭐ **CRITICAL**
   - Expected: Status 200, admin sees **ALL user orders**
   - Uses: `adminToken`
   - ✅ Validates: Admin visibility of all system changes

3. **03-Update-Order-Status.bru**
   - Expected: Status 200, order status updated to CONFIRMED

#### **STEP 6: Reservations Tests**
Expand **Reservations** folder and run sequentially:

1. **01-Create-Reservation.bru**
   - Expected: Status 201, reservation created
   - Uses: `userToken`
   - Saves: `reservationId`

2. **02-Get-All-Reservations-Admin.bru** ⭐ **CRITICAL**
   - Expected: Status 200, admin sees **ALL user reservations**
   - Uses: `adminToken`
   - ✅ Validates: Admin visibility of all system changes

3. **03-Update-Reservation-Status.bru**
   - Expected: Status 200, reservation confirmed

## 🎯 Critical Validations

### ✅ What to Check:
1. **JWT Authentication:**
   - All authenticated endpoints require valid token
   - Token format: `Bearer eyJhbGciOiJIUzI1NiJ9...`

2. **MenuDTO Structure (21 Parameters):**
   ```json
   {
     "id": 1,
     "name": "Test Menu",
     "description": "Description",
     "category": "MAIN_COURSE",
     "price": 15.99,
     "isAvailable": true,
     "imageUrl": "http://example.com/image.jpg",
     "preparationTime": 25,
     "isVegetarian": true,
     "isVegan": false,
     "isGlutenFree": false,
     "isSpicy": true,
     "spiceLevel": 2,
     "isFeatured": false,
     "stockQuantity": 50,
     "lowStockThreshold": 10,
     "ingredients": "Ingredients list",
     "discountPercentage": 10.0,
     "discountedPrice": 14.39,
     "createdAt": "2025-10-19T10:30:00",
     "updatedAt": "2025-10-19T10:30:00"
   }
   ```
   **❌ NO calories field**
   **❌ NO allergens field**

3. **Admin Visibility:**
   - Admin user should see ALL orders from ALL users
   - Admin user should see ALL reservations from ALL users
   - Regular user sees only their own data

4. **RBAC (Role-Based Access Control):**
   - Admin endpoints require ADMIN role
   - User endpoints require authentication
   - Public endpoints accessible without token

## 🔍 Viewing Test Results

### In Bruno UI:
1. **Response Status:** Green (200-299) = Success, Red (400-599) = Error
2. **Response Time:** Shown in milliseconds
3. **Response Body:** JSON formatted with syntax highlighting
4. **Tests Tab:** Shows assertion results (passed/failed)
5. **Headers Tab:** Shows response headers including CORS

### Environment Variables:
- Click **"Env"** button to see all saved variables
- Check: `token`, `adminToken`, `userToken`, `menuId`, `orderId`, `reservationId`

## ⚠️ Troubleshooting

### Problem: "Failed to connect"
**Solution:** Verify backend is running on port 8084
```powershell
Invoke-WebRequest -Uri "http://localhost:8084/api/menu" -UseBasicParsing
```

### Problem: "401 Unauthorized"
**Solution:** Re-run authentication tests to get fresh tokens
1. Run `01-Login-Admin.bru`
2. Check environment has `adminToken` saved

### Problem: "MenuDTO has 23 parameters instead of 21"
**Solution:** Backend has incorrect DTO - should NOT include:
- ❌ calories
- ❌ allergens

### Problem: "Admin doesn't see all orders/reservations"
**Solution:** Check backend controller methods:
- `OrderController.getAllOrders()` should NOT filter by user
- `ReservationController.getAllReservations()` should NOT filter by user

## 📊 Run All Tests Button
Bruno allows running entire folder:
1. Right-click on **"bruno-api-tests"** folder
2. Select **"Run Collection"**
3. Watch all tests execute sequentially
4. View summary of pass/fail counts

## 🎉 Success Criteria
- ✅ All 17 tests pass with status 200/201
- ✅ MenuDTO has exactly 21 parameters (NO calories, NO allergens)
- ✅ Admin sees ALL orders from ALL users
- ✅ Admin sees ALL reservations from ALL users
- ✅ JWT tokens generated and validated correctly
- ✅ RBAC enforced properly
- ✅ CORS headers present in responses

## 📝 Next Steps After Bruno Tests
1. Run frontend integration tests: `cd frontend/tests && node api-integration.test.js`
2. Manual browser testing at http://localhost:5176
3. Database verification queries (see README.md)

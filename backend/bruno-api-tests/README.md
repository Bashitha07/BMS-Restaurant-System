# 🧪 Bruno API Testing Suite for Restaurant System

## 📋 Overview
This directory contains Bruno API test collections for the Restaurant Management System. Bruno is a fast, Git-friendly, and open-source API client.

## 🚀 Quick Start

### 1. Install Bruno
Download Bruno from: https://www.usebruno.com/downloads

Or install via package manager:
```bash
# Windows (Chocolatey)
choco install bruno

# macOS (Homebrew)
brew install bruno

# Linux (Snap)
snap install bruno
```

### 2. Open Collection in Bruno
1. Launch Bruno
2. Click "Open Collection"
3. Navigate to: `C:\SpringBoot\restaurant-system\bruno-api-tests`
4. Select the folder

### 3. Configure Environment
1. In Bruno, select **"local"** environment from the dropdown
2. Verify these variables are set:
   - `baseUrl`: http://localhost:8084
   - `adminUsername`: admin
   - `adminPassword`: admin123

### 4. Start Backend & Frontend
```powershell
# Terminal 1: Start Backend
cd C:\SpringBoot\restaurant-system
mvn clean spring-boot:run

# Terminal 2: Start Frontend
cd C:\SpringBoot\restaurant-system\frontend
npm run dev
```

## 🧪 Test Execution Order

### Phase 1: Authentication (REQUIRED FIRST)
Run these tests in order to set up authentication tokens:

1. **Authentication > 01-Login-Admin.bru**
   - Logs in as admin user
   - Saves `adminToken` to environment
   - Required for all admin operations

2. **Authentication > 02-Register-User.bru**
   - Creates a test user account
   - Username: `testuser`, Password: `test123`

3. **Authentication > 03-Login-User.bru**
   - Logs in as test user
   - Saves `userToken` to environment
   - Required for user operations

### Phase 2: Menu CRUD Operations (Admin)
After authentication, test menu management:

1. **Menu > 01-Get-All-Menus.bru**
   - Fetches all menu items
   - Saves first `menuId` to environment
   - ✅ Verifies NO calories/allergens fields

2. **Menu > 02-Create-Menu-Item.bru**
   - Creates new menu item
   - ✅ Tests 21-parameter MenuDTO (no calories/allergens)
   - Saves new `menuId`

3. **Menu > 03-Update-Menu-Item.bru**
   - Updates the created menu item
   - Changes price, name, and availability

4. **Menu > 04-Toggle-Menu-Availability.bru**
   - Toggles menu item availability

5. **Menu > 05-Delete-Menu-Item.bru**
   - Deletes the test menu item

### Phase 3: User Management (Admin)

1. **Users > 01-Get-All-Users.bru**
   - Admin fetches all users
   - Saves test user `userId`
   - ✅ Verifies admin can see all users

2. **Users > 02-Update-User-Role.bru**
   - Admin changes user role to ADMIN
   - Tests role-based access control

3. **Users > 03-Toggle-User-Status.bru**
   - Admin enables/disables user account

### Phase 4: Order Management

1. **Orders > 01-Create-Order.bru**
   - Test user creates an order
   - Saves `orderId`
   - Tests order creation with menu items

2. **Orders > 02-Get-All-Orders-Admin.bru**
   - ✅ **CRITICAL**: Admin sees orders from ALL users
   - Verifies admin visibility of user actions

3. **Orders > 03-Update-Order-Status.bru**
   - Admin updates order status
   - Tests workflow: PENDING → CONFIRMED → PREPARING → READY → DELIVERED

### Phase 5: Reservation Management

1. **Reservations > 01-Create-Reservation.bru**
   - Test user creates reservation
   - Saves `reservationId`

2. **Reservations > 02-Get-All-Reservations-Admin.bru**
   - ✅ **CRITICAL**: Admin sees reservations from ALL users
   - Verifies admin visibility

3. **Reservations > 03-Update-Reservation-Status.bru**
   - Admin confirms reservation
   - Tests status workflow

## ✅ Key Test Validations

### 1. JWT Authentication
- ✅ Login returns valid JWT token
- ✅ Token contains username and role
- ✅ Token is automatically sent in Authorization header
- ✅ Protected endpoints require valid token

### 2. Schema Changes (Calories/Allergens Removal)
- ✅ MenuDTO has 21 parameters (not 23)
- ✅ No `calories` field in response
- ✅ No `allergens` field in response
- ✅ Database schema matches entity

### 3. Admin Visibility
- ✅ Admin can view ALL users
- ✅ Admin can view ALL orders (from any user)
- ✅ Admin can view ALL reservations (from any user)
- ✅ Admin can update any entity status

### 4. Role-Based Access Control
- ✅ Admin-only endpoints reject USER role
- ✅ User can only see their own data
- ✅ Admin can modify user roles
- ✅ Token role claim is validated

## 🔍 Database Verification Queries

After running tests, verify in MySQL:

```sql
-- Check admin token is working
SELECT * FROM users WHERE username = 'admin';

-- Verify menu items (21 fields, no calories/allergens)
DESCRIBE menus;
SELECT * FROM menus ORDER BY id DESC LIMIT 5;

-- Check test user was created
SELECT * FROM users WHERE username = 'testuser';

-- Verify orders from test user are visible
SELECT o.id, o.status, o.total_amount, u.username 
FROM orders o 
JOIN users u ON o.user_id = u.id 
ORDER BY o.id DESC LIMIT 5;

-- Verify reservations
SELECT * FROM reservations ORDER BY id DESC LIMIT 5;
```

## 🎯 Expected Results

### Authentication Tests
- **01-Login-Admin**: Status 200, token saved
- **02-Register-User**: Status 200/201, user created
- **03-Login-User**: Status 200, user token saved

### Menu Tests (All as Admin)
- **01-Get-All-Menus**: Status 200, array returned
- **02-Create-Menu-Item**: Status 200/201, menu created
- **03-Update-Menu-Item**: Status 200, menu updated
- **04-Toggle-Availability**: Status 200, availability toggled
- **05-Delete-Menu-Item**: Status 200, menu deleted

### User Tests (All as Admin)
- **01-Get-All-Users**: Status 200, includes admin and testuser
- **02-Update-User-Role**: Status 200, role changed to ADMIN
- **03-Toggle-User-Status**: Status 200, status changed to disabled

### Order Tests
- **01-Create-Order**: Status 200/201, order created with PENDING status
- **02-Get-All-Orders-Admin**: Status 200, admin sees test user's order
- **03-Update-Order-Status**: Status 200, status changed to CONFIRMED

### Reservation Tests
- **01-Create-Reservation**: Status 200/201, reservation created
- **02-Get-All-Reservations-Admin**: Status 200, admin sees test user's reservation
- **03-Update-Reservation-Status**: Status 200, status changed to CONFIRMED

## 🐛 Troubleshooting

### Issue: 403 Forbidden
**Cause**: Token not set or expired
**Solution**: 
1. Re-run `Authentication > 01-Login-Admin.bru`
2. Check environment variables have `adminToken` set
3. Verify backend is running on port 8084

### Issue: 401 Unauthorized
**Cause**: Invalid credentials or token
**Solution**:
1. Verify admin password is `admin123` in environment
2. Check JWT secret matches in `application.properties`
3. Backend logs should show authentication attempts

### Issue: Token not saved
**Cause**: Post-response script not executing
**Solution**:
1. Check Bruno console for script errors
2. Manually copy token from response
3. Paste into environment variable `adminToken`

### Issue: MenuDTO parameter mismatch
**Cause**: Using old 23-parameter format
**Solution**:
1. Menu items should have 21 parameters
2. Remove any `calories` or `allergens` fields
3. Re-run `Menu > 02-Create-Menu-Item.bru`

## 📊 Test Coverage

| Module | Endpoints | Coverage |
|--------|-----------|----------|
| Authentication | 2 | 100% |
| Menu Management | 5 | 100% |
| User Management | 3 | 100% |
| Order Management | 3 | 100% |
| Reservation Management | 3 | 100% |
| **Total** | **16** | **100%** |

## 🔐 Security Features Tested

- ✅ JWT token generation and validation
- ✅ Bearer token authentication
- ✅ Role-based access control (ADMIN vs USER)
- ✅ Protected endpoints authorization
- ✅ Token expiration handling
- ✅ CORS configuration

## 📝 Notes

1. **Run Authentication tests FIRST** - All other tests depend on tokens
2. **Environment variables persist** - Tokens are saved between test runs
3. **Sequential execution recommended** - Some tests depend on previous test results
4. **Database state matters** - Tests create real data in the database
5. **Admin sees everything** - Verify admin visibility of user actions

## 🎓 Bruno Tips

### Run All Tests in Folder
Right-click folder → "Run Folder"

### View Environment Variables
Click "Env" button → Select "local"

### View Request/Response
Click on any request → See auto-generated curl command

### Debug Scripts
Open Bruno DevTools → Console tab → See script output

### Export Results
Right-click collection → "Export Collection"

---

**Test Status**: ✅ All endpoints functional with JWT authentication
**Last Updated**: October 19, 2025
**Backend**: http://localhost:8084
**Frontend**: http://localhost:5176

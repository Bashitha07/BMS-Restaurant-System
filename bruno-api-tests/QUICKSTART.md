# 🚀 Quick Start - Bruno API Testing

## Prerequisites
✅ Backend running on port 8084  
✅ MySQL running with `restaurant_db` database  
✅ Admin user exists (username: admin, password: admin123)

## Installation

### Download Bruno
Visit: https://www.usebruno.com/downloads

Or use package manager:
```powershell
# Windows (winget)
winget install Bruno.Bruno

# Or download .exe installer
```

## Setup Steps

### 1. Open Collection in Bruno
1. Launch Bruno
2. Click "Open Collection"  
3. Navigate to: `C:\SpringBoot\restaurant-system\bruno-api-tests`
4. Click "Select Folder"

### 2. Select Environment
- In Bruno, click the **Environment** dropdown (top-right)
- Select **"local"**
- Verify `baseUrl` is set to: `http://localhost:8084`

### 3. Run Tests (In Order!)

#### Step 1: Get Admin Token
📁 **Authentication** → **01-Login-Admin**
- Click "Send" button
- ✅ Status should be **200**
- ✅ `adminToken` is automatically saved to environment

#### Step 2: Register Test User
📁 **Authentication** → **02-Register-User**
- Click "Send"
- Creates user: `testuser` / `test123`

#### Step 3: Get User Token
📁 **Authentication** → **03-Login-User**
- Click "Send"
- ✅ `userToken` is automatically saved

#### Step 4: Test Menu CRUD
📁 **Menu** folder → Run all tests (01 to 05)
- Right-click folder → "Run Folder"
- ✅ Verifies NO calories/allergens fields

#### Step 5: Test User Management (Admin)
📁 **Users** folder → Run all tests
- Tests admin can manage all users

#### Step 6: Test Orders (User + Admin visibility)
📁 **Orders** folder → Run all tests
- User creates order
- ✅ Admin can see ALL user orders

#### Step 7: Test Reservations
📁 **Reservations** folder → Run all tests
- ✅ Admin can see ALL user reservations

## Expected Results

### All Tests Should Return:
- ✅ Status **200** or **201**
- ✅ Valid JSON response
- ✅ No `calories` or `allergens` in MenuDTO
- ✅ Admin sees data from ALL users

## Database Verification

After running tests, check in MySQL:

```sql
-- Verify menu schema (21 fields)
DESCRIBE menus;

-- Check created menu item
SELECT * FROM menus WHERE name LIKE '%Test%';

-- Verify test user
SELECT * FROM users WHERE username = 'testuser';

-- Check order visibility
SELECT o.id, o.status, u.username 
FROM orders o 
JOIN users u ON o.user_id = u.id;
```

## Troubleshooting

### 403 Forbidden
- Re-run **01-Login-Admin** to refresh token
- Check `adminToken` in environment variables

### Connection Refused
```powershell
# Check backend is running
netstat -ano | findstr "8084"

# Restart backend
cd C:\SpringBoot\restaurant-system
mvn spring-boot:run
```

### Token Not Saved
- Check Bruno console (F12) for errors
- Manually set token in environment:
  1. Copy token from response
  2. Environment → `adminToken` → Paste

## Quick PowerShell Test

Before using Bruno, verify JWT works:

```powershell
cd C:\SpringBoot\restaurant-system
.\test-jwt-config.ps1
```

This will:
- ✅ Test admin login
- ✅ Verify JWT authentication
- ✅ Test protected endpoints
- ✅ Create test menu item
- ✅ Verify no calories/allergens

## Next Steps

1. ✅ Run all Bruno tests
2. ✅ Test in browser: http://localhost:5176
3. ✅ Login as admin / admin123
4. ✅ Verify admin can see all user actions
5. ✅ Test CRUD operations in UI

---

**Ready to test!** Start with Authentication → 01-Login-Admin 🚀

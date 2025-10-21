# Admin Guide: Menu Image Management

## ✅ Current Status (All Issues Fixed!)

### 1. Backend Status: **RUNNING** ✅
- **Port:** 8084
- **Status:** Tomcat started successfully
- **Database:** Connected to restaurant_db
- **Process ID:** 21848

### 2. Database Images: **CONFIGURED** ✅
- **Total menu items:** 60
- **Items with images:** 60 (100%)
- **Food images:** 13 actual images
- **Placeholder images:** Created for all categories

### 3. Image Folders: **READY** ✅
```
src/main/resources/static/images/
├── food/           ✅ 13 images + placeholder
├── desserts/       ✅ placeholder-dessert.jpg
├── beverages/      ✅ placeholder-beverage.jpg
└── menu/           ✅ 13 original images
```

## 📸 How to Upload Menu Images as Admin

### Method 1: Using the Admin API Endpoint

**Endpoint:** `POST /api/admin/menu/upload-image`

**Authentication Required:** Admin role (Bearer token)

#### Using Postman or Insomnia:

1. **Login as Admin** first:
   ```
   POST http://localhost:8084/api/auth/login
   Body (JSON):
   {
     "username": "admin",
     "password": "admin123"
   }
   ```
   Copy the `token` from response.

2. **Upload Image**:
   ```
   POST http://localhost:8084/api/admin/menu/upload-image
   Headers:
     Authorization: Bearer <your-token-here>
   Body (form-data):
     file: [select your image file]
     category: food  (or "beverages" or "desserts")
   ```

3. **Response** will contain:
   ```json
   {
     "imageUrl": "/assets/images/food/chicken-burger-a1b2c3d4.jpg",
     "filename": "chicken-burger-a1b2c3d4.jpg",
     "category": "food",
     "message": "Image uploaded successfully"
   }
   ```

4. **Update Menu Item** with the image URL:
   ```
   PUT http://localhost:8084/api/admin/menu/{menuItemId}
   Headers:
     Authorization: Bearer <your-token-here>
     Content-Type: application/json
   Body:
   {
     "imageUrl": "/assets/images/food/chicken-burger-a1b2c3d4.jpg"
   }
   ```

#### Using cURL (PowerShell):

```powershell
# 1. Login
$loginResponse = Invoke-RestMethod -Uri "http://localhost:8084/api/auth/login" -Method POST -ContentType "application/json" -Body '{"username":"admin","password":"admin123"}'
$token = $loginResponse.token

# 2. Upload image
$headers = @{ "Authorization" = "Bearer $token" }
$filePath = "C:\path\to\your\image.jpg"
$form = @{
    file = Get-Item -Path $filePath
    category = "food"
}
Invoke-RestMethod -Uri "http://localhost:8084/api/admin/menu/upload-image" -Method POST -Headers $headers -Form $form
```

### Method 2: Direct File Placement

You can also directly place images in the static folder:

1. **Place image file** in:
   ```
   src/main/resources/static/images/food/your-image.jpg
   ```

2. **Update menu item** via API:
   ```
   PUT http://localhost:8084/api/admin/menu/{id}
   Headers:
     Authorization: Bearer <admin-token>
     Content-Type: application/json
   Body:
   {
     "imageUrl": "/images/food/your-image.jpg"
   }
   ```

## 🎯 Current Menu Items with Images

### First 13 Items (Have Actual Images):
1. Spring Rolls - `/images/food/4b8009a0-81eb-4aa6-9afc-975fc8ac2708.jpg`
2. Chicken Wings - `/images/food/63358324-39d2-4bb5-b15d-4a3ff72d938a.jpg`
3. Garlic Bread - `/images/food/menu_item_20251019_04eef593.jpg`
4. Mozzarella Sticks - `/images/food/menu_item_20251019_64ccf5d8.jpg`
5. Grilled Chicken Burger - `/images/food/menu_item_20251019_70d96fe2.jpg`
6. Chicken Biryani - `/images/food/menu_item_20251019_76f1cabc.jpg`
7. Vegetable Pasta - `/images/food/menu_item_20251019_8ba2566d.jpg`
8. Grilled Salmon - `/images/food/menu_item_20251019_8c2a0947.jpg`
9. Beef Burger - `/images/food/menu_item_20251019_a8e038c0.jpg`
10. Margherita Pizza - `/images/food/menu_item_20251019_cd6bc882.jpg`
11. Classic Caesar Salad - `/images/food/menu_item_20251019_d3fba4c7.jpg`
12. Chocolate Lava Cake - `/images/food/menu_item_20251019_ef6a7402.jpg`
13. Chocolate Brownie - `/images/food/menu_item_20251019_f3b83633.jpg`

### Remaining Items (Using Placeholders):
- **Desserts (14-16):** Using `/images/desserts/placeholder-dessert.jpg`
- **Beverages (17-21):** Using `/images/beverages/placeholder-beverage.jpg`
- **Other items (22-60):** Using `/images/food/placeholder-food.jpg`

## 🔒 Admin Credentials

```
Username: admin
Password: admin123
```

## 🌐 API Endpoints Available

### Public Endpoints (No Auth Required):
- `GET /api/menus` - Get all menu items
- `GET /api/menus/{id}` - Get specific menu item
- `GET /api/menus/category/{category}` - Get items by category

### Admin Endpoints (Require Admin Auth):
- `POST /api/admin/menu` - Create menu item
- `PUT /api/admin/menu/{id}` - Update menu item
- `DELETE /api/admin/menu/{id}` - Delete menu item
- `POST /api/admin/menu/upload-image` - Upload image
- `PUT /api/admin/menu/{id}/availability` - Toggle availability
- `PUT /api/admin/menu/bulk-availability` - Bulk update
- `GET /api/admin/menu/statistics` - Get statistics

## 📋 Image Upload Requirements

- **Max file size:** 5MB
- **Allowed formats:** JPG, JPEG, PNG, GIF, WebP
- **Recommended size:** 800x600px or 1200x900px
- **File naming:** Will be auto-generated with UUID for uniqueness

## ✅ Verification Commands

Check if backend is running:
```powershell
netstat -ano | findstr ":8084"
```

Test menu API:
```powershell
Invoke-RestMethod -Uri "http://localhost:8084/api/menus" | Select-Object -First 3
```

Check image folders:
```powershell
Get-ChildItem "src\main\resources\static\images\food"
```

## 🚀 Starting the Backend

### Option 1: Using the batch file
```batch
.\start-backend.bat
```

### Option 2: Direct JAR execution
```powershell
java -jar target\restaurant-system-0.0.1-SNAPSHOT.jar
```

### Option 3: Maven Spring Boot
```batch
mvnw.cmd spring-boot:run
```

## 📝 Notes

- All menu items now have image URLs configured
- Frontend should display images correctly via Vite proxy
- Backend serves static images from `/images/` path
- Upload endpoint creates images in both `src/main/resources/static/images/` and `frontend/src/assets/images/`
- Images are automatically renamed with UUID to prevent conflicts

## 🎨 Next Steps for Full Image Coverage

To replace placeholders with actual images for remaining menu items:

1. **Login as admin** and get JWT token
2. **Upload images** for each category:
   - Desserts: Upload 3+ dessert images
   - Beverages: Upload 5+ beverage images  
   - Food items: Upload images for remaining 40+ items
3. **Update menu items** with the returned image URLs

Enjoy your fully configured restaurant system! 🍽️

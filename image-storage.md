# Image Storage System

## Overview

This restaurant system now stores all uploaded images in the **`src/main/resources/static/images/`** directory, making them accessible via static URLs and properly organized by type.

---

## Directory Structure

```
src/main/resources/static/images/
│
├── menu/                           # Menu item images
│   ├── menu_item_20251019_a1b2c3d4.jpg
│   ├── menu_item_20251019_e5f6g7h8.png
│   └── ...
│
└── payment-slips/                  # Payment slip images (organized by month)
    ├── 2025-10/                    # October 2025
    │   ├── payment_order_123_20251019_x1y2z3w4.jpg
    │   ├── payment_order_124_20251019_a5b6c7d8.pdf
    │   └── ...
    ├── 2025-11/                    # November 2025
    │   └── ...
    └── ...
```

---

## File Naming Conventions

### Menu Images
**Format:** `menu_item_{YYYYMMDD}_{uniqueID}.{extension}`

**Example:** `menu_item_20251019_a1b2c3d4.jpg`

- `menu_item` - Fixed prefix
- `20251019` - Upload date (YYYYMMDD)
- `a1b2c3d4` - 8-character unique ID
- `.jpg` - Original file extension

### Payment Slip Images
**Format:** `payment_order_{orderID}_{YYYYMMDD}_{uniqueID}.{extension}`

**Example:** `payment_order_123_20251019_x1y2z3w4.pdf`

- `payment_order` - Fixed prefix
- `123` - Order ID
- `20251019` - Upload date (YYYYMMDD)
- `x1y2z3w4` - 8-character unique ID
- `.pdf` - Original file extension

---

## File Organization

### Payment Slips - Monthly Organization
Payment slips are organized into monthly subdirectories:
- **Path:** `payment-slips/{YYYY-MM}/`
- **Benefits:**
  - Easy archival by month
  - Better performance with large number of files
  - Simplified audit trails
  - Easier cleanup of old records

### Menu Images - Flat Structure
Menu images are stored in a single directory:
- **Path:** `menu/`
- **Benefits:**
  - Quick access to all menu images
  - Simple management
  - Smaller total file count

---

## Access URLs

### Frontend Access
Images are accessible via static URLs:

**Menu Images:**
```
http://localhost:8084/images/menu/menu_item_20251019_a1b2c3d4.jpg
```

**Payment Slips:**
```
http://localhost:8084/images/payment-slips/2025-10/payment_order_123_20251019_x1y2z3w4.pdf
```

### Database Storage
The relative URL path is stored in the database:
- Menu: `/images/menu/menu_item_20251019_a1b2c3d4.jpg`
- Payment: `/images/payment-slips/2025-10/payment_order_123_20251019_x1y2z3w4.pdf`

---

## File Validation

### Payment Slips
- **Allowed types:** JPEG, PNG, GIF, PDF
- **Maximum size:** 10 MB
- **Use cases:** Bank deposit slips, payment confirmations, receipts

### Menu Images
- **Allowed types:** JPEG, PNG, GIF
- **Maximum size:** 5 MB
- **Use cases:** Food photos, menu item pictures

---

## API Endpoints

### Upload Menu Image
**Endpoint:** `POST /api/admin/menu/upload-image`

**Request:**
```http
POST /api/admin/menu/upload-image
Content-Type: multipart/form-data

file: [image file]
```

**Response:**
```json
{
  "imageUrl": "/images/menu/menu_item_20251019_a1b2c3d4.jpg",
  "filename": "menu_item_20251019_a1b2c3d4.jpg",
  "message": "Image uploaded successfully"
}
```

**Usage in Menu Creation:**
```http
POST /api/admin/menu
Content-Type: application/json

{
  "name": "Pizza Margherita",
  "description": "Classic Italian pizza",
  "price": 12.99,
  "category": "MAIN_COURSE",
  "imageUrl": "/images/menu/menu_item_20251019_a1b2c3d4.jpg"
}
```

---

### Upload Payment Slip
**Endpoint:** `POST /api/payment-slips/upload`

**Request:**
```http
POST /api/payment-slips/upload
Content-Type: multipart/form-data

orderId: 123
userId: 456
file: [image/pdf file]
paymentAmount: 50.00
paymentDate: 2025-10-19T14:30:00
bankName: Bank of America
transactionReference: TXN123456789
```

**Response:**
```json
{
  "id": 1,
  "orderId": 123,
  "userId": 456,
  "username": "john_doe",
  "fileName": "receipt.pdf",
  "filePath": "/images/payment-slips/2025-10/payment_order_123_20251019_x1y2z3w4.pdf",
  "fileSize": 245678,
  "contentType": "application/pdf",
  "paymentAmount": 50.00,
  "paymentDate": "2025-10-19T14:30:00",
  "status": "PENDING",
  "uploadedAt": "2025-10-19T14:35:22",
  "bankName": "Bank of America",
  "transactionReference": "TXN123456789"
}
```

---

## FileStorageService

The `FileStorageService` handles all file operations:

### Methods

#### `storePaymentSlip(MultipartFile file, Long orderId)`
- Validates file (type, size)
- Creates monthly directory if needed
- Generates unique filename with order ID
- Stores file in `payment-slips/{YYYY-MM}/`
- Returns relative URL path

#### `storeMenuImage(MultipartFile file)`
- Validates file (type, size)
- Creates menu directory if needed
- Generates unique filename
- Stores file in `menu/`
- Returns relative URL path

#### `deleteFile(String fileUrl)`
- Deletes file from filesystem
- Used when payment slips are rejected or menu items deleted
- Returns success/failure status

#### `getFilePath(String fileUrl)`
- Converts URL to filesystem path
- Used for serving files or performing operations

---

## Security Considerations

### Access Control
✅ **Menu images:** Public access (needed for menu browsing)  
✅ **Payment slips:** Should be restricted to authenticated users

### Validation
✅ File type validation (content-type checking)  
✅ File size limits enforced  
✅ Unique filenames prevent overwriting  
✅ Organized directory structure prevents path traversal

### Recommendations
1. Consider adding authentication checks for payment slip access
2. Implement periodic cleanup of orphaned files
3. Add virus scanning for uploaded files in production
4. Consider using cloud storage (AWS S3, Azure Blob) for production

---

## Production Deployment

### Static Resource Configuration

In `application.properties`:
```properties
# File upload settings
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
spring.servlet.multipart.enabled=true

# Static resources
spring.web.resources.static-locations=classpath:/static/
```

### Build Process
When packaging the application as JAR:
```bash
mvn clean package
```

The `src/main/resources/static/` directory is included in the JAR, making images accessible at runtime.

### External Storage (Recommended for Production)
For production environments, consider:
- **AWS S3:** Scalable cloud storage
- **Azure Blob Storage:** Microsoft cloud storage
- **Google Cloud Storage:** Google cloud storage
- **CDN:** CloudFront, Azure CDN for faster delivery

**Benefits:**
- Unlimited storage capacity
- Better performance with CDN
- Automatic backups
- Geographic distribution
- Cost-effective scaling

---

## Maintenance Tasks

### Cleanup Old Payment Slips
Consider implementing a scheduled task to archive old payment slips:
```java
@Scheduled(cron = "0 0 2 1 * ?") // Run at 2 AM on 1st of every month
public void archiveOldPaymentSlips() {
    // Archive payment slips older than 1 year
    LocalDate cutoffDate = LocalDate.now().minusYears(1);
    // Implementation logic here
}
```

### Monitor Storage Usage
```java
@GetMapping("/api/admin/storage/stats")
public Map<String, Object> getStorageStats() {
    return Map.of(
        "menuImagesCount", countFilesInDirectory("menu/"),
        "paymentSlipsCount", countFilesInDirectory("payment-slips/"),
        "totalSize", calculateTotalSize()
    );
}
```

---

## Troubleshooting

### Images Not Loading
1. **Check directory exists:**
   ```bash
   ls src/main/resources/static/images/
   ```

2. **Verify file permissions:**
   ```bash
   chmod 755 src/main/resources/static/images/
   ```

3. **Check Spring Boot static resource configuration**

4. **Verify URL path in database matches file location**

### Upload Fails
1. **Check file size limits in application.properties**
2. **Verify disk space available**
3. **Check file type validation**
4. **Review application logs for errors**

### File Not Found After Upload
1. **Verify file was actually saved to disk**
2. **Check database entry has correct file path**
3. **Ensure Spring Boot is serving static resources**
4. **Check for typos in URL path**

---

## Migration from Old System

If migrating from the old `uploads/` directory:

```java
@PostConstruct
public void migrateOldFiles() {
    Path oldDir = Paths.get("uploads/payment-slips/");
    Path newDir = Paths.get("src/main/resources/static/images/payment-slips/");
    
    // Copy files from old to new location
    // Update database paths
    // Verify migration
    // Delete old files
}
```

---

## Summary

✅ **Organized:** Files stored in logical directory structure  
✅ **Accessible:** Static URLs for easy frontend access  
✅ **Secure:** File validation and size limits  
✅ **Scalable:** Monthly organization prevents directory bloat  
✅ **Maintainable:** Clear naming conventions and structure  
✅ **Production-Ready:** Works with JAR packaging  

**All payment slips and menu images are now properly stored and managed! 🎉**

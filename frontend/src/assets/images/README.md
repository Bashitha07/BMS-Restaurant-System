# Menu Image Assets Directory

This directory contains the images used for menu items in the restaurant system.

## Directory Structure

- **`/food`**: Contains images for main dishes, appetizers, sides, and other food items
- **`/beverages`**: Contains images for drinks, beverages, and liquid refreshments
- **`/desserts`**: Contains images for desserts, sweets, and pastries

## Image Management

### Image Naming Convention

Images follow this naming convention:
```
[item-name-slug]-[unique-id].[extension]
```

For example: `grilled-chicken-burger-a1b2c3.jpg`

### Image Upload Process

When uploading images through the admin panel:

1. Images are automatically categorized into the appropriate folder based on the menu item category
2. A unique filename is generated from the menu item name
3. Images are stored in both the frontend assets directory and the backend static resources directory

### Image Usage in the Application

Images are used throughout the application in the following ways:

1. In the customer-facing menu page
2. In the admin menu management interface
3. In cart and checkout summaries
4. In order receipts and confirmations

### Image Resolution Guidelines

For best performance and visual quality:

- Recommended image dimensions: 800x600 pixels
- Maximum file size: 5MB
- Supported formats: JPEG, PNG, WebP

## Manual Image Management

If you need to manually add or replace images:

1. Place the image in the appropriate category folder
2. Update the menu item in the admin panel to reference the new image path
3. The path should be relative to the assets directory, e.g., `/assets/images/food/item-name.jpg`

---

**Note:** Do not delete or rename images that are referenced by active menu items. If you need to replace an image, update the reference in the database first.
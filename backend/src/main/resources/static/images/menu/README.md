# Menu Images Directory

This directory stores all uploaded menu item images.

## Image Storage

- **Location**: `backend/src/main/resources/static/images/menu/`
- **Accessible via**: `http://localhost:8084/images/menu/{filename}`
- **Format**: Images are stored with unique IDs for easy retrieval

## Naming Convention

Images are automatically named using one of these patterns:
- `menu_item_{menuId}_{timestamp}_{uuid}.{extension}` - When uploaded with a specific menu ID
- `menu_item_{timestamp}_{uuid}.{extension}` - When uploaded without a menu ID

Examples:
- `menu_item_42_20251025_a1b2c3d4-e5f6-7890-abcd-ef1234567890.jpg`
- `menu_item_20251025_f9e8d7c6-b5a4-3210-9876-543210fedcba.png`

## File Constraints

- **Maximum Size**: 5MB
- **Supported Formats**: JPG, JPEG, PNG, GIF
- **Validation**: Automatic validation on upload

## Usage

1. **Upload via Admin Panel**: Use the "Upload New Image" button in the menu management form
2. **Backend Storage**: Images are stored in this directory automatically
3. **Database Reference**: The image URL path (`/images/menu/{filename}`) is saved in the `menus` table's `image_url` column
4. **Serving**: Images are served by Spring Boot from `/images/menu/` endpoint

## Important Notes

- Do not manually delete images without updating the database
- Ensure this directory has write permissions
- Images are served with 1-hour browser cache
- Old images are not automatically deleted when menu items are updated

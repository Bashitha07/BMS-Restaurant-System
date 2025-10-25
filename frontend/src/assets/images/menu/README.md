# Menu Images Directory

This directory stores uploaded menu item images during development.

## File Naming Convention

When uploading images for menu items:
- **With Menu ID**: `menu_image_no{menuId}.{ext}`
  - Example: `menu_image_no123.jpg`, `menu_image_no456.png`
- **Without Menu ID** (new items): `menu_item_{timestamp}_{uuid}.{ext}`
  - Example: `menu_item_20251025_a1b2c3d4.jpg`

## Notes

- Images are automatically duplicated to `backend/src/main/resources/static/images/menu/` for production
- This frontend copy allows immediate visibility during development without server restart
- Supported formats: JPG, JPEG, PNG, GIF
- Maximum file size: 5MB

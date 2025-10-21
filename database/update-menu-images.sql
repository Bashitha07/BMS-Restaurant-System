-- ============================================
-- Update Menu Items with Image URLs
-- ============================================

USE restaurant_db;

-- Update menu items with actual image URLs from the food folder
UPDATE menus SET image_url = '/images/food/4b8009a0-81eb-4aa6-9afc-975fc8ac2708.jpg' WHERE id = 1;
UPDATE menus SET image_url = '/images/food/63358324-39d2-4bb5-b15d-4a3ff72d938a.jpg' WHERE id = 2;
UPDATE menus SET image_url = '/images/food/menu_item_20251019_04eef593.jpg' WHERE id = 3;
UPDATE menus SET image_url = '/images/food/menu_item_20251019_64ccf5d8.jpg' WHERE id = 4;
UPDATE menus SET image_url = '/images/food/menu_item_20251019_70d96fe2.jpg' WHERE id = 5;
UPDATE menus SET image_url = '/images/food/menu_item_20251019_76f1cabc.jpg' WHERE id = 6;
UPDATE menus SET image_url = '/images/food/menu_item_20251019_8ba2566d.jpg' WHERE id = 7;
UPDATE menus SET image_url = '/images/food/menu_item_20251019_8c2a0947.jpg' WHERE id = 8;
UPDATE menus SET image_url = '/images/food/menu_item_20251019_a8e038c0.jpg' WHERE id = 9;
UPDATE menus SET image_url = '/images/food/menu_item_20251019_cd6bc882.jpg' WHERE id = 10;
UPDATE menus SET image_url = '/images/food/menu_item_20251019_d3fba4c7.jpg' WHERE id = 11;
UPDATE menus SET image_url = '/images/food/menu_item_20251019_ef6a7402.jpg' WHERE id = 12;
UPDATE menus SET image_url = '/images/food/menu_item_20251019_f3b83633.jpg' WHERE id = 13;

-- Set default placeholder images for desserts
UPDATE menus SET image_url = '/images/desserts/placeholder-dessert.jpg' 
WHERE category = 'DESSERT' AND image_url IS NULL;

-- Set default placeholder images for beverages
UPDATE menus SET image_url = '/images/beverages/placeholder-beverage.jpg' 
WHERE category = 'BEVERAGE' AND image_url IS NULL;

-- Set default placeholder for remaining items
UPDATE menus SET image_url = '/images/food/placeholder-food.jpg' 
WHERE image_url IS NULL;

-- Verify the updates
SELECT id, name, category, price, image_url 
FROM menus 
WHERE id <= 20
ORDER BY id;

-- Show summary
SELECT 
    category,
    COUNT(*) as total_items,
    SUM(CASE WHEN image_url IS NOT NULL THEN 1 ELSE 0 END) as with_images,
    SUM(CASE WHEN image_url IS NULL THEN 1 ELSE 0 END) as without_images
FROM menus
GROUP BY category
ORDER BY category;

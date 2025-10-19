-- Migration Script: Remove calories and allergens columns from menus table
-- Run this on your existing database to update the schema

USE restaurant_db;

-- Remove columns if they exist
ALTER TABLE menus
DROP COLUMN IF EXISTS calories,
DROP COLUMN IF EXISTS allergens;

-- Verify the change
DESCRIBE menus;

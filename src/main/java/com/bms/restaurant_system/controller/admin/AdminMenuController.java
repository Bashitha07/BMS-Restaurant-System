package com.bms.restaurant_system.controller.admin;

import com.bms.restaurant_system.dto.menu.MenuDTO;
import com.bms.restaurant_system.dto.menu.MenuItemUpdateDTO;
import com.bms.restaurant_system.service.menu.MenuService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/menu")
@PreAuthorize("hasRole('ADMIN')")
public class AdminMenuController {
    private static final Logger logger = LoggerFactory.getLogger(AdminMenuController.class);

    @Autowired
    private MenuService menuService;

    // Get all menu items for admin
    @GetMapping
    public ResponseEntity<List<MenuDTO>> getAllMenuItems() {
        logger.info("Admin fetching all menu items");
        List<MenuDTO> menuItems = menuService.getAllMenus();
        return ResponseEntity.ok(menuItems);
    }

    // Create new menu item
    @PostMapping
    public ResponseEntity<?> createMenuItem(@RequestBody MenuDTO menuItemDTO) {
        logger.info("Admin creating new menu item: {}", menuItemDTO.name());
        try {
            MenuDTO created = menuService.createMenu(menuItemDTO);
            logger.info("Menu item created successfully with id: {}", created.id());
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            logger.error("Error creating menu item: {}", e.getMessage());
            return ResponseEntity.status(400).body("Failed to create menu item: " + e.getMessage());
        }
    }

    // Update menu item
    @PutMapping("/{id}")
    public ResponseEntity<?> updateMenuItem(@PathVariable Long id, @RequestBody MenuItemUpdateDTO updateRequest) {
        logger.info("Admin updating menu item: {}", id);
        try {
            MenuDTO updated = menuService.updateMenuItem(id, updateRequest);
            logger.info("Menu item updated successfully: {}", id);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            logger.error("Error updating menu item {}: {}", id, e.getMessage());
            return ResponseEntity.status(400).body("Failed to update menu item: " + e.getMessage());
        }
    }

    // Delete menu item
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMenuItem(@PathVariable Long id) {
        logger.info("Admin deleting menu item: {}", id);
        try {
            menuService.deleteMenu(id);
            logger.info("Menu item deleted successfully: {}", id);
            return ResponseEntity.ok("Menu item deleted successfully");
        } catch (Exception e) {
            logger.error("Error deleting menu item {}: {}", id, e.getMessage());
            return ResponseEntity.status(400).body("Failed to delete menu item: " + e.getMessage());
        }
    }

    // Update menu item availability
    @PutMapping("/{id}/availability")
    public ResponseEntity<?> updateMenuItemAvailability(@PathVariable Long id, @RequestParam boolean available) {
        logger.info("Admin updating availability for menu item {} to {}", id, available);
        try {
            MenuDTO updated = menuService.updateAvailability(id, available);
            logger.info("Menu item availability updated successfully: {}", id);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            logger.error("Error updating menu item availability {}: {}", id, e.getMessage());
            return ResponseEntity.status(400).body("Failed to update availability: " + e.getMessage());
        }
    }

    // Get menu items by category for admin management
    @GetMapping("/category/{category}")
    public ResponseEntity<List<MenuDTO>> getMenuItemsByCategory(@PathVariable String category) {
        logger.info("Admin fetching menu items for category: {}", category);
        List<MenuDTO> menuItems = menuService.getMenusByCategory(category);
        return ResponseEntity.ok(menuItems);
    }

    // Get menu statistics
    @GetMapping("/statistics")
    public ResponseEntity<?> getMenuStatistics() {
        logger.info("Admin fetching menu statistics");
        try {
            Map<String, Object> stats = menuService.getMenuStatistics();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            logger.error("Error fetching menu statistics: {}", e.getMessage());
            return ResponseEntity.status(500).body("Failed to fetch statistics");
        }
    }

    // Bulk update availability
    @PutMapping("/bulk-availability")
    public ResponseEntity<?> bulkUpdateAvailability(@RequestBody Map<String, Object> request) {
        @SuppressWarnings("unchecked")
        List<Long> menuItemIds = (List<Long>) request.get("menuItemIds");
        Boolean available = (Boolean) request.get("available");
        
        logger.info("Admin bulk updating availability for {} items to {}", menuItemIds.size(), available);
        try {
            List<MenuDTO> updated = menuService.bulkUpdateAvailability(menuItemIds, available);
            logger.info("Bulk availability update completed");
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            logger.error("Error in bulk availability update: {}", e.getMessage());
            return ResponseEntity.status(400).body("Failed to update availability: " + e.getMessage());
        }
    }

    // Upload menu item image
    @PostMapping("/upload-image")
    public ResponseEntity<?> uploadMenuImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "category", required = false, defaultValue = "food") String category) {
        
        logger.info("Admin uploading menu image: {}, category: {}", file.getOriginalFilename(), category);

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty");
        }

        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity.badRequest().body("Only image files are allowed");
        }

        // Validate file size (max 5MB)
        if (file.getSize() > 5 * 1024 * 1024) {
            return ResponseEntity.badRequest().body("File size must be less than 5MB");
        }

        try {
            // Determine the correct subdirectory based on category
            String subDirectory;
            switch (category.toLowerCase()) {
                case "beverage":
                case "beverages":
                    subDirectory = "beverages";
                    break;
                case "dessert":
                case "desserts":
                    subDirectory = "desserts";
                    break;
                case "food":
                default:
                    subDirectory = "food";
                    break;
            }
            
            // Create frontend assets directory path - for local development
            Path frontendDir = Paths.get("frontend/src/assets/images/" + subDirectory);
            if (!Files.exists(frontendDir)) {
                Files.createDirectories(frontendDir);
            }
            
            // Create backend static resources path - for production
            Path backendDir = Paths.get("src/main/resources/static/images/" + subDirectory);
            if (!Files.exists(backendDir)) {
                Files.createDirectories(backendDir);
            }

            // Generate unique filename with a slug from the original name for better SEO
            String originalFilename = file.getOriginalFilename();
            String nameWithoutExtension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(0, originalFilename.lastIndexOf(".")).toLowerCase()
                    .replaceAll("[^a-z0-9]", "-") // Replace non-alphanumeric with dash
                    .replaceAll("-+", "-") // Replace multiple dashes with single dash
                : "menu-item";
                
            String fileExtension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : ".jpg";
                
            String uniqueFilename = nameWithoutExtension + "-" + 
                UUID.randomUUID().toString().substring(0, 8) + fileExtension;

            // Save file to both locations
            Path frontendFilePath = frontendDir.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), frontendFilePath, StandardCopyOption.REPLACE_EXISTING);
            
            // Save another copy to backend static resources
            Path backendFilePath = backendDir.resolve(uniqueFilename);
            Files.copy(frontendFilePath, backendFilePath, StandardCopyOption.REPLACE_EXISTING);

            // Return the URL that can be accessed by frontend - use the assets relative path for development
            String imageUrl = "/assets/images/" + subDirectory + "/" + uniqueFilename;
            logger.info("Menu image uploaded successfully: {}", imageUrl);

            return ResponseEntity.ok(Map.of(
                "imageUrl", imageUrl,
                "filename", uniqueFilename,
                "category", subDirectory,
                "message", "Image uploaded successfully"
            ));

        } catch (IOException e) {
            logger.error("Error uploading menu image: {}", e.getMessage());
            return ResponseEntity.status(500).body("Failed to upload image: " + e.getMessage());
        }
    }
}
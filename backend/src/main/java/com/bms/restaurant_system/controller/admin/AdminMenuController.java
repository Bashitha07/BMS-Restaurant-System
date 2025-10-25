package com.bms.restaurant_system.controller.admin;

import com.bms.restaurant_system.dto.menu.MenuDTO;
import com.bms.restaurant_system.dto.menu.MenuItemUpdateDTO;
import com.bms.restaurant_system.service.menu.MenuService;
import com.bms.restaurant_system.service.storage.FileStorageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/menu")
@PreAuthorize("hasRole('ADMIN')")
public class AdminMenuController {
    private static final Logger logger = LoggerFactory.getLogger(AdminMenuController.class);

    @Autowired
    private MenuService menuService;
    
    @Autowired
    private FileStorageService fileStorageService;

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
            @RequestParam(value = "menuId", required = false) Long menuId,
            @RequestParam(value = "category", required = false, defaultValue = "food") String category) {
        
        logger.info("Admin uploading menu image: {}, menuId: {}, category: {}", 
                    file.getOriginalFilename(), menuId, category);

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty");
        }

        try {
            // Use FileStorageService for consistent naming
            String imageUrl = fileStorageService.storeMenuImage(file, menuId);
            logger.info("Menu image uploaded successfully: {}", imageUrl);

            return ResponseEntity.ok(Map.of(
                "imageUrl", imageUrl,
                "menuId", menuId != null ? menuId : "null",
                "message", "Image uploaded successfully"
            ));

        } catch (IllegalArgumentException e) {
            logger.error("Validation error uploading menu image: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IOException e) {
            logger.error("Error uploading menu image: {}", e.getMessage());
            return ResponseEntity.status(500).body("Failed to upload image: " + e.getMessage());
        }
    }
}
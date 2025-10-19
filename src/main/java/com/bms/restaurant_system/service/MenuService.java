package com.bms.restaurant_system.service;

import com.bms.restaurant_system.dto.MenuDTO;
import com.bms.restaurant_system.dto.MenuItemUpdateDTO;
import com.bms.restaurant_system.entity.Menu;
import com.bms.restaurant_system.exception.ResourceNotFoundException;
import com.bms.restaurant_system.repository.MenuRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@Service
public class MenuService {
    private static final Logger logger = LoggerFactory.getLogger(MenuService.class);

    @Autowired
    private MenuRepository menuRepository;

    public List<MenuDTO> getAllMenus() {
        return menuRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<MenuDTO> getAvailableMenus() {
        return menuRepository.findByIsAvailableTrue().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<MenuDTO> getMenusByCategory(String category) {
        return menuRepository.findByCategory(category).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<Menu> getMenusByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        return menuRepository.findByPriceBetween(minPrice, maxPrice);
    }

    public Optional<Menu> getMenuById(Long id) {
        return menuRepository.findById(id);
    }

    public MenuDTO createMenu(MenuDTO menuDTO) {
        Menu menu = new Menu();
        menu.setName(menuDTO.name());
        menu.setDescription(menuDTO.description());
        menu.setPrice(menuDTO.price());
        menu.setCategory(menuDTO.category());
        menu.setIsAvailable(menuDTO.isAvailable() != null ? menuDTO.isAvailable() : true);
        menu.setImageUrl(menuDTO.imageUrl());
        menu.setPreparationTime(menuDTO.preparationTime());
        menu.setCalories(menuDTO.calories());
        menu.setIngredients(menuDTO.ingredients());
        menu.setAllergens(menuDTO.allergens());
        menu.setIsVegetarian(menuDTO.isVegetarian());
        menu.setIsVegan(menuDTO.isVegan());
        menu.setIsGlutenFree(menuDTO.isGlutenFree());
        menu.setIsSpicy(menuDTO.isSpicy());
        menu.setSpiceLevel(menuDTO.spiceLevel());
        menu.setStockQuantity(menuDTO.stockQuantity());
        menu.setLowStockThreshold(menuDTO.lowStockThreshold());
        menu.setIsFeatured(menuDTO.isFeatured());
        menu.setDiscountPercentage(menuDTO.discountPercentage());
        menu.setCreatedAt(LocalDateTime.now());

        Menu saved = menuRepository.save(menu);
        return convertToDTO(saved);
    }

    public Menu updateMenu(Long id, MenuDTO menuDTO) {
        Menu menu = menuRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu not found with id: " + id));

        menu.setName(menuDTO.name());
        menu.setDescription(menuDTO.description());
        menu.setPrice(menuDTO.price());
        menu.setCategory(menuDTO.category());
        if (menuDTO.isAvailable() != null) {
            menu.setIsAvailable(menuDTO.isAvailable());
        }

        return menuRepository.save(menu);
    }

    public void deleteMenu(Long id) {
        Menu menu = menuRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu not found with id: " + id));
        menuRepository.delete(menu);
    }

    public Menu toggleMenuAvailability(Long id) {
        Menu menu = menuRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu not found with id: " + id));

        menu.setIsAvailable(!menu.getIsAvailable());
        return menuRepository.save(menu);
    }

    public MenuDTO updateMenuItem(Long id, MenuItemUpdateDTO updateRequest) {
        logger.info("Updating menu item with id: {}", id);
        Menu menu = menuRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu not found with id: " + id));

        if (updateRequest.name() != null) menu.setName(updateRequest.name());
        if (updateRequest.description() != null) menu.setDescription(updateRequest.description());
        if (updateRequest.price() != null) menu.setPrice(updateRequest.price());
        if (updateRequest.category() != null) menu.setCategory(updateRequest.category());
        if (updateRequest.available() != null) menu.setIsAvailable(updateRequest.available());
        if (updateRequest.imageUrl() != null) menu.setImageUrl(updateRequest.imageUrl());
        menu.setUpdatedAt(LocalDateTime.now());

        Menu updated = menuRepository.save(menu);
        return convertToDTO(updated);
    }

    public MenuDTO updateAvailability(Long id, boolean available) {
        logger.info("Updating availability for menu item {} to {}", id, available);
        Menu menu = menuRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu not found with id: " + id));
        
        menu.setIsAvailable(available);
        menu.setUpdatedAt(LocalDateTime.now());
        Menu updated = menuRepository.save(menu);
        return convertToDTO(updated);
    }

    public Map<String, Object> getMenuStatistics() {
        logger.info("Fetching menu statistics");
        Map<String, Object> stats = new HashMap<>();
        
        long totalMenus = menuRepository.count();
        long availableMenus = menuRepository.countByIsAvailableTrue();
        long unavailableMenus = totalMenus - availableMenus;
        
        stats.put("totalMenus", totalMenus);
        stats.put("availableMenus", availableMenus);
        stats.put("unavailableMenus", unavailableMenus);
        
        // Category statistics
        List<Menu> allMenus = menuRepository.findAll();
        Map<String, Long> categoryStats = allMenus.stream()
                .collect(Collectors.groupingBy(Menu::getCategory, Collectors.counting()));
        stats.put("categoryStats", categoryStats);
        
        return stats;
    }

    public List<MenuDTO> bulkUpdateAvailability(List<Long> menuItemIds, Boolean available) {
        logger.info("Bulk updating availability for {} items to {}", menuItemIds.size(), available);
        List<Menu> menus = menuRepository.findAllById(menuItemIds);
        
        menus.forEach(menu -> {
            menu.setIsAvailable(available);
            menu.setUpdatedAt(LocalDateTime.now());
        });
        
        List<Menu> updated = menuRepository.saveAll(menus);
        return updated.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private MenuDTO convertToDTO(Menu menu) {
        return new MenuDTO(
            menu.getId(),
            menu.getName(),
            menu.getDescription(),
            menu.getPrice(),
            menu.getCategory(),
            menu.getIsAvailable(),
            menu.getImageUrl(),
            menu.getPreparationTime(),
            menu.getCalories(),
            menu.getIngredients(),
            menu.getAllergens(),
            menu.getIsVegetarian(),
            menu.getIsVegan(),
            menu.getIsGlutenFree(),
            menu.getIsSpicy(),
            menu.getSpiceLevel(),
            menu.getStockQuantity(),
            menu.getLowStockThreshold(),
            menu.getIsFeatured(),
            menu.getDiscountPercentage(),
            menu.getDiscountedPrice(),
            menu.getCreatedAt(),
            menu.getUpdatedAt()
        );
    }
}

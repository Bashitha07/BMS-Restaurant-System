package com.bms.restaurant_system.controller;

import com.bms.restaurant_system.dto.MenuDTO;
import com.bms.restaurant_system.entity.Menu;
import com.bms.restaurant_system.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menus")
public class MenuController {

    @Autowired
    private MenuService menuService;

    @GetMapping
    public ResponseEntity<List<MenuDTO>> getAllMenus() {
        List<MenuDTO> menus = menuService.getAllMenus();
        return ResponseEntity.ok(menus);
    }

    @GetMapping("/available")
    public ResponseEntity<List<MenuDTO>> getAvailableMenus() {
        List<MenuDTO> menus = menuService.getAvailableMenus();
        return ResponseEntity.ok(menus);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<MenuDTO>> getMenusByCategory(@PathVariable String category) {
        List<MenuDTO> menus = menuService.getMenusByCategory(category);
        return ResponseEntity.ok(menus);
    }

    @PostMapping
    public ResponseEntity<MenuDTO> createMenu(@RequestBody MenuDTO menuDTO) {
        MenuDTO createdMenu = menuService.createMenu(menuDTO);
        return ResponseEntity.ok(createdMenu);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Menu> updateMenu(@PathVariable Long id, @RequestBody MenuDTO menuDTO) {
        Menu updatedMenu = menuService.updateMenu(id, menuDTO);
        return ResponseEntity.ok(updatedMenu);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMenu(@PathVariable Long id) {
        menuService.deleteMenu(id);
        return ResponseEntity.noContent().build();
    }
}

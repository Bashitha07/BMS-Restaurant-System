package com.bms.restaurant_system.service.database;

import com.bms.restaurant_system.entity.Menu;
import com.bms.restaurant_system.entity.Role;
import com.bms.restaurant_system.entity.User;
import com.bms.restaurant_system.entity.Order;
import com.bms.restaurant_system.entity.Reservation;
import com.bms.restaurant_system.repository.MenuRepository;
import com.bms.restaurant_system.repository.UserRepository;
import com.bms.restaurant_system.repository.OrderRepository;
import com.bms.restaurant_system.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Service class demonstrating comprehensive MySQL database retrieval patterns
 */
@Service
@Transactional(readOnly = true)
public class DatabaseRetrievalService {

    @Autowired
    private MenuRepository menuRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    // ==================== BASIC RETRIEVAL METHODS ====================

    /**
     * Get all menus with basic information
     */
    public List<Menu> getAllMenus() {
        return menuRepository.findAll();
    }

    /**
     * Get all users with basic information
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Get all orders with basic information
     */
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    /**
     * Get all reservations with basic information
     */
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    // ==================== FILTERED RETRIEVAL METHODS ====================

    /**
     * Get menus by category
     */
    public List<Menu> getMenusByCategory(String category) {
        return menuRepository.findByCategory(category);
    }

    /**
     * Get only available menus
     */
    public List<Menu> getAvailableMenus() {
        return menuRepository.findByIsAvailableTrue();
    }

    /**
     * Get menus within a price range
     */
    public List<Menu> getMenusByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        return menuRepository.findByPriceBetween(minPrice, maxPrice);
    }

    /**
     * Get menus by name (exact match)
     */
    public List<Menu> getMenusByName(String name) {
        return menuRepository.findByName(name);
    }

    /**
     * Get available menus ordered by category
     */
    public List<Menu> getAvailableMenusOrderedByCategory() {
        return menuRepository.findAvailableMenusOrderedByCategory();
    }

    // ==================== USER RETRIEVAL METHODS ====================

    /**
     * Find user by username
     */
    public User findUserByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }

    /**
     * Find user by email
     */
    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    /**
     * Check if username exists
     */
    public boolean usernameExists(String username) {
        return userRepository.findByUsername(username).isPresent();
    }

    /**
     * Check if email exists
     */
    public boolean emailExists(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    // ==================== ADVANCED RETRIEVAL METHODS ====================

    /**
     * Get menu statistics by category
     */
    public Map<String, Long> getMenuCountByCategory() {
        return menuRepository.findAll().stream()
                .collect(Collectors.groupingBy(
                    menu -> menu.getCategory() != null ? menu.getCategory() : "Uncategorized",
                    Collectors.counting()
                ));
    }

    /**
     * Get price statistics
     */
    public Map<String, BigDecimal> getPriceStatistics() {
        List<Menu> menus = menuRepository.findAll();
        if (menus.isEmpty()) {
            return Map.of("min", BigDecimal.ZERO, "max", BigDecimal.ZERO, "avg", BigDecimal.ZERO);
        }

        BigDecimal min = menus.stream()
                .filter(menu -> menu.getPrice() != null)
                .map(Menu::getPrice)
                .min(BigDecimal::compareTo)
                .orElse(BigDecimal.ZERO);

        BigDecimal max = menus.stream()
                .filter(menu -> menu.getPrice() != null)
                .map(Menu::getPrice)
                .max(BigDecimal::compareTo)
                .orElse(BigDecimal.ZERO);

        BigDecimal sum = menus.stream()
                .filter(menu -> menu.getPrice() != null)
                .map(Menu::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal avg = BigDecimal.ZERO;
        if (menus.stream().anyMatch(menu -> menu.getPrice() != null)) {
            long count = menus.stream().filter(menu -> menu.getPrice() != null).count();
            if (count > 0) {
                avg = sum.divide(BigDecimal.valueOf(count), 2, RoundingMode.HALF_UP);
            }
        }

        return Map.of("min", min, "max", max, "avg", avg);
    }

    /**
     * Get orders by date range
     */
    public List<Order> getOrdersByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return orderRepository.findAll().stream()
                .filter(order -> {
                    LocalDateTime orderDate = order.getOrderDate();
                    return orderDate != null &&
                           (orderDate.isEqual(startDate) || orderDate.isAfter(startDate)) &&
                           (orderDate.isEqual(endDate) || orderDate.isBefore(endDate));
                })
                .collect(Collectors.toList());
    }

    /**
     * Get reservations by date range
     */
    public List<Reservation> getReservationsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return reservationRepository.findAll().stream()
                .filter(reservation -> {
                    LocalDateTime reservationDate = reservation.getReservationDateTime();
                    return reservationDate != null &&
                           (reservationDate.isEqual(startDate) || reservationDate.isAfter(startDate)) &&
                           (reservationDate.isEqual(endDate) || reservationDate.isBefore(endDate));
                })
                .collect(Collectors.toList());
    }

    // ==================== AGGREGATION AND ANALYTICS ====================

    /**
     * Get total revenue from all orders
     */
    public BigDecimal getTotalRevenue() {
        return orderRepository.findAll().stream()
                .filter(order -> order.getTotalAmount() != null)
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Get total number of orders
     */
    public Long getTotalOrdersCount() {
        return (long) orderRepository.findAll().size();
    }

    /**
     * Get total number of reservations
     */
    public Long getTotalReservationsCount() {
        return (long) reservationRepository.findAll().size();
    }

    /**
     * Get total number of users
     */
    public Long getTotalUsersCount() {
        return (long) userRepository.findAll().size();
    }

    /**
     * Get total number of menu items
     */
    public Long getTotalMenusCount() {
        return (long) menuRepository.findAll().size();
    }

    // ==================== SEARCH AND FILTER COMBINATIONS ====================

    /**
     * Search menus by name or description (case-insensitive)
     */
    public List<Menu> searchMenus(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return getAllMenus();
        }

        String term = searchTerm.toLowerCase().trim();
        return menuRepository.findAll().stream()
                .filter(menu ->
                    (menu.getName() != null && menu.getName().toLowerCase().contains(term)) ||
                    (menu.getDescription() != null && menu.getDescription().toLowerCase().contains(term)) ||
                    (menu.getCategory() != null && menu.getCategory().toLowerCase().contains(term))
                )
                .collect(Collectors.toList());
    }

    /**
     * Get available menus by category
     */
    public List<Menu> getAvailableMenusByCategory(String category) {
        return menuRepository.findByIsAvailableTrue().stream()
                .filter(menu -> category == null ||
                       (menu.getCategory() != null && menu.getCategory().equalsIgnoreCase(category)))
                .collect(Collectors.toList());
    }

    /**
     * Get menus by category and price range
     */
    public List<Menu> getMenusByCategoryAndPriceRange(String category, BigDecimal minPrice, BigDecimal maxPrice) {
        return menuRepository.findAll().stream()
                .filter(menu -> menu.getIsAvailable() != null && menu.getIsAvailable())
                .filter(menu -> category == null ||
                       (menu.getCategory() != null && menu.getCategory().equalsIgnoreCase(category)))
                .filter(menu -> menu.getPrice() != null &&
                       menu.getPrice().compareTo(minPrice) >= 0 &&
                       menu.getPrice().compareTo(maxPrice) <= 0)
                .collect(Collectors.toList());
    }

    // ==================== PAGINATION SUPPORT ====================

    /**
     * Get menus with pagination (simple implementation)
     */
    public List<Menu> getMenusWithPagination(int page, int size) {
        List<Menu> allMenus = menuRepository.findAll();
        int startIndex = page * size;
        int endIndex = Math.min(startIndex + size, allMenus.size());

        if (startIndex >= allMenus.size()) {
            return List.of();
        }

        return allMenus.subList(startIndex, endIndex);
    }

    /**
     * Get users with pagination (simple implementation)
     */
    public List<User> getUsersWithPagination(int page, int size) {
        List<User> allUsers = userRepository.findAll();
        int startIndex = page * size;
        int endIndex = Math.min(startIndex + size, allUsers.size());

        if (startIndex >= allUsers.size()) {
            return List.of();
        }

        return allUsers.subList(startIndex, endIndex);
    }

    // ==================== USER MANAGEMENT METHODS ====================

    /**
     * Update user role
     */
    @Transactional
    public User updateUserRole(Long userId, String role) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        user.setRole(Role.valueOf(role.toUpperCase()));
        return userRepository.save(user);
    }

    /**
     * Update user status (enable/disable)
     */
    @Transactional
    public User updateUserStatus(Long userId, Boolean enabled) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        user.setEnabled(enabled);
        return userRepository.save(user);
    }
}

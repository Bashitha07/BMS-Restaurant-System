package com.bms.restaurant_system.repository;

import com.bms.restaurant_system.entity.Menu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface MenuRepository extends JpaRepository<Menu, Long> {
    List<Menu> findByCategory(String category);
    List<Menu> findByIsAvailableTrue();
    long countByIsAvailableTrue();
    List<Menu> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);
    List<Menu> findByName(String name);

    @Query("SELECT m FROM Menu m WHERE m.isAvailable = true ORDER BY m.category, m.name")
    List<Menu> findAvailableMenusOrderedByCategory();
}

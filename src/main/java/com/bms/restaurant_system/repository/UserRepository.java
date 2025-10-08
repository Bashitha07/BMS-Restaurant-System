package com.bms.restaurant_system.repository;

import com.bms.restaurant_system.entity.User;
import com.bms.restaurant_system.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    List<User> findByRole(Role role);
    long countByRole(Role role);
    long countByEnabled(boolean enabled);
}

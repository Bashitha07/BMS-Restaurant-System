package com.bms.restaurant_system.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    private String phone;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;  // Default to USER

    @Column(columnDefinition = "boolean default true")
    private boolean enabled = true;  // Default to enabled

    // Promotion fields
    @Column(name = "promo_code")
    private String promoCode;

    @Column(name = "discount_percent", precision = 5, scale = 2)
    private java.math.BigDecimal discountPercent = java.math.BigDecimal.ZERO;

    @Column(name = "promo_expires")
    private java.time.LocalDateTime promoExpires;

    @Column(name = "promo_active")
    private Boolean promoActive = Boolean.FALSE;

    // Constructors
    public User() {}
    public User(String username, String email, String phone, String password, Role role) {
        this.username = username;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.role = role;
    }

    // Promotion getters/setters
    public String getPromoCode() { return promoCode; }
    public void setPromoCode(String promoCode) { this.promoCode = promoCode; }

    public java.math.BigDecimal getDiscountPercent() { return discountPercent; }
    public void setDiscountPercent(java.math.BigDecimal discountPercent) { this.discountPercent = discountPercent; }

    public java.time.LocalDateTime getPromoExpires() { return promoExpires; }
    public void setPromoExpires(java.time.LocalDateTime promoExpires) { this.promoExpires = promoExpires; }

    public Boolean getPromoActive() { return promoActive; }
    public void setPromoActive(Boolean promoActive) { this.promoActive = promoActive; }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }
}

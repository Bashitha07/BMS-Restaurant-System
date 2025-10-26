package com.bms.restaurant_system.dto.auth;

public class LoginResponse {
    private Long id;
    private String token;
    private String username;
    private String role;
    private String email;
    private String phone;

    public LoginResponse() {}

    public LoginResponse(Long id, String token, String username, String role) {
        this.id = id;
        this.token = token;
        this.username = username;
        this.role = role;
    }

    public LoginResponse(Long id, String token, String username, String role, String email, String phone) {
        this.id = id;
        this.token = token;
        this.username = username;
        this.role = role;
        this.email = email;
        this.phone = phone;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}

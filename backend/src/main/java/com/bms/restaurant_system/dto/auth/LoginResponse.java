package com.bms.restaurant_system.dto.auth;

public class LoginResponse {
    private Long id;
    private String token;
    private String username;
    private String role;

    public LoginResponse() {}

    public LoginResponse(Long id, String token, String username, String role) {
        this.id = id;
        this.token = token;
        this.username = username;
        this.role = role;
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
}

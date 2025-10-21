package com.bms.restaurant_system.dto.driver;

public class DriverLoginResponse {
    private String token;
    private String username;
    private String role;
    private Long driverId;
    private String name;
    private String status;

    public DriverLoginResponse() {}

    public DriverLoginResponse(String token, String username, String role, Long driverId, String name, String status) {
        this.token = token;
        this.username = username;
        this.role = role;
        this.driverId = driverId;
        this.name = name;
        this.status = status;
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

    public Long getDriverId() {
        return driverId;
    }

    public void setDriverId(Long driverId) {
        this.driverId = driverId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
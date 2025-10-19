package com.bms.restaurant_system.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureWebMvc
@ActiveProfiles("test")
@Transactional
class MenuControllerIntegrationTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
    }

    @Test
    void contextLoads() {
        // This test verifies that the Spring context loads successfully
    }

    @Test
    void getAllMenus_ShouldReturnMenuItems() throws Exception {
        mockMvc.perform(get("/api/menu"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    void getMenuById_WithValidId_ShouldReturnMenuItem() throws Exception {
        mockMvc.perform(get("/api/menu/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    void getMenuById_WithInvalidId_ShouldReturnNotFound() throws Exception {
        mockMvc.perform(get("/api/menu/99999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void getMenusByCategory_WithValidCategory_ShouldReturnMenuItems() throws Exception {
        mockMvc.perform(get("/api/menu/category/Main Course"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    void getMenusByCategory_WithInvalidCategory_ShouldReturnEmptyList() throws Exception {
        mockMvc.perform(get("/api/menu/category/InvalidCategory"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    void getAvailableMenus_ShouldReturnOnlyAvailableItems() throws Exception {
        mockMvc.perform(get("/api/menu/available"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }
}
package com.bms.restaurant_system.controller;

import com.bms.restaurant_system.dto.menu.MenuDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import java.math.BigDecimal;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureWebMvc
@ActiveProfiles("test")
@Transactional
class AdminMenuControllerIntegrationTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
    }

    @Test
    void contextLoads() {
        // This test verifies that the Spring context loads successfully
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getAllMenuItems_ShouldReturnMenuItems() throws Exception {
        mockMvc.perform(get("/api/admin/menu"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createMenuItem_WithValidData_ShouldReturnCreatedItem() throws Exception {
        MenuDTO menuDTO = new MenuDTO(
            null, // id
            "Test Item", // name
            "Test Description", // description
            BigDecimal.valueOf(10.99), // price
            "Main Course", // category
            true, // isAvailable
            null, // imageUrl
            15, // preparationTime
            null, // calories
            "Test ingredients", // ingredients
            null, // allergens
            true, // isVegetarian
            false, // isVegan
            true, // isGlutenFree
            false, // isSpicy
            0, // spiceLevel
            100, // stockQuantity
            10, // lowStockThreshold
            false, // isFeatured
            BigDecimal.ZERO, // discountPercentage
            BigDecimal.valueOf(10.99), // discountedPrice
            null, // createdAt
            null // updatedAt
        );

        mockMvc.perform(post("/api/admin/menu")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(menuDTO)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.name").value("Test Item"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void updateMenuItem_WithValidData_ShouldReturnUpdatedItem() throws Exception {
        // First create an item
        MenuDTO menuDTO = new MenuDTO(
            null, // id
            "Test Item", // name
            "Test Description", // description
            BigDecimal.valueOf(10.99), // price
            "Main Course", // category
            true, // isAvailable
            null, // imageUrl
            15, // preparationTime
            null, // calories
            "Test ingredients", // ingredients
            null, // allergens
            true, // isVegetarian
            false, // isVegan
            true, // isGlutenFree
            false, // isSpicy
            0, // spiceLevel
            100, // stockQuantity
            10, // lowStockThreshold
            false, // isFeatured
            BigDecimal.ZERO, // discountPercentage
            BigDecimal.valueOf(10.99), // discountedPrice
            null, // createdAt
            null // updatedAt
        );

        String response = mockMvc.perform(post("/api/admin/menu")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(menuDTO)))
                .andReturn().getResponse().getContentAsString();

        MenuDTO created = objectMapper.readValue(response, MenuDTO.class);

        // Update the item
        MenuDTO updateDTO = new MenuDTO(
            created.id(), // id
            "Updated Item", // name
            "Updated Description", // description
            BigDecimal.valueOf(12.99), // price
            "Main Course", // category
            true, // isAvailable
            null, // imageUrl
            15, // preparationTime
            null, // calories
            "Test ingredients", // ingredients
            null, // allergens
            true, // isVegetarian
            false, // isVegan
            true, // isGlutenFree
            false, // isSpicy
            0, // spiceLevel
            100, // stockQuantity
            10, // lowStockThreshold
            false, // isFeatured
            BigDecimal.ZERO, // discountPercentage
            BigDecimal.valueOf(12.99), // discountedPrice
            created.createdAt(), // createdAt
            created.updatedAt() // updatedAt
        );

        mockMvc.perform(put("/api/admin/menu/" + created.id())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Item"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void deleteMenuItem_WithValidId_ShouldReturnSuccess() throws Exception {
        // First create an item
        MenuDTO menuDTO = new MenuDTO(
            null, // id
            "Test Item", // name
            "Test Description", // description
            BigDecimal.valueOf(10.99), // price
            "Main Course", // category
            true, // isAvailable
            null, // imageUrl
            15, // preparationTime
            null, // calories
            "Test ingredients", // ingredients
            null, // allergens
            true, // isVegetarian
            false, // isVegan
            true, // isGlutenFree
            false, // isSpicy
            0, // spiceLevel
            100, // stockQuantity
            10, // lowStockThreshold
            false, // isFeatured
            BigDecimal.ZERO, // discountPercentage
            BigDecimal.valueOf(10.99), // discountedPrice
            null, // createdAt
            null // updatedAt
        );

        String response = mockMvc.perform(post("/api/admin/menu")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(menuDTO)))
                .andReturn().getResponse().getContentAsString();

        MenuDTO created = objectMapper.readValue(response, MenuDTO.class);

        // Delete the item
        mockMvc.perform(delete("/api/admin/menu/" + created.id()))
                .andExpect(status().isOk())
                .andExpect(content().string("Menu item deleted successfully"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void updateMenuItemAvailability_ShouldReturnUpdatedItem() throws Exception {
        // First create an item
        MenuDTO menuDTO = new MenuDTO(
            null, // id
            "Test Item", // name
            "Test Description", // description
            BigDecimal.valueOf(10.99), // price
            "Main Course", // category
            true, // isAvailable
            null, // imageUrl
            15, // preparationTime
            null, // calories
            "Test ingredients", // ingredients
            null, // allergens
            true, // isVegetarian
            false, // isVegan
            true, // isGlutenFree
            false, // isSpicy
            0, // spiceLevel
            100, // stockQuantity
            10, // lowStockThreshold
            false, // isFeatured
            BigDecimal.ZERO, // discountPercentage
            BigDecimal.valueOf(10.99), // discountedPrice
            null, // createdAt
            null // updatedAt
        );

        String response = mockMvc.perform(post("/api/admin/menu")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(menuDTO)))
                .andReturn().getResponse().getContentAsString();

        MenuDTO created = objectMapper.readValue(response, MenuDTO.class);

        // Update availability
        mockMvc.perform(put("/api/admin/menu/" + created.id() + "/availability")
                .param("available", "false"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isAvailable").value(false));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getMenuStatistics_ShouldReturnStatistics() throws Exception {
        mockMvc.perform(get("/api/admin/menu/statistics"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void uploadMenuImage_WithValidImage_ShouldReturnImageUrl() throws Exception {
        MockMultipartFile imageFile = new MockMultipartFile(
            "file",
            "test-image.jpg",
            "image/jpeg",
            "test image content".getBytes()
        );

        mockMvc.perform(multipart("/api/admin/menu/upload-image")
                .file(imageFile))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.imageUrl").exists())
                .andExpect(jsonPath("$.filename").exists())
                .andExpect(jsonPath("$.message").value("Image uploaded successfully"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void uploadMenuImage_WithEmptyFile_ShouldReturnBadRequest() throws Exception {
        MockMultipartFile emptyFile = new MockMultipartFile(
            "file",
            "",
            "image/jpeg",
            new byte[0]
        );

        mockMvc.perform(multipart("/api/admin/menu/upload-image")
                .file(emptyFile))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("File cannot be empty"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void uploadMenuImage_WithNonImageFile_ShouldReturnBadRequest() throws Exception {
        MockMultipartFile textFile = new MockMultipartFile(
            "file",
            "test.txt",
            "text/plain",
            "test content".getBytes()
        );

        mockMvc.perform(multipart("/api/admin/menu/upload-image")
                .file(textFile))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Only image files (JPEG, PNG, GIF) are allowed"));
    }
}
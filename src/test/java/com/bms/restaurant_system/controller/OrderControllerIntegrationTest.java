package com.bms.restaurant_system.controller;

import com.bms.restaurant_system.dto.OrderCreateDTO;
import com.bms.restaurant_system.dto.OrderDTO;
import com.bms.restaurant_system.entity.Order;
import com.bms.restaurant_system.entity.PaymentMethod;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.Arrays;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureWebMvc
@ActiveProfiles("test")
class OrderControllerIntegrationTest {

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
    void getAllOrders_ShouldReturnOrdersList() throws Exception {
        mockMvc.perform(get("/api/orders"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    @WithMockUser(username = "customer", roles = {"USER"})
    void getOrderById_WithValidId_ShouldReturnOrder() throws Exception {
        // First create an order
        OrderCreateDTO.OrderItemCreateDTO item = new OrderCreateDTO.OrderItemCreateDTO(1L, 1, null);
        OrderCreateDTO orderCreateDTO = new OrderCreateDTO(
            null, // userId - will be derived from security context
            Arrays.asList(item), // items
            PaymentMethod.DEPOSIT_SLIP, // paymentMethod
            null, // deliveryAddress
            null, // deliveryPhone
            null, // specialInstructions
            Order.OrderType.DINE_IN // orderType
        );

        String response = mockMvc.perform(post("/api/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(orderCreateDTO)))
                .andReturn().getResponse().getContentAsString();

        OrderDTO created = objectMapper.readValue(response, OrderDTO.class);

        // Get the order by ID
        mockMvc.perform(get("/api/orders/" + created.id()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(created.id()));
    }

    @Test
    @WithMockUser(username = "customer", roles = {"USER"})
    void getOrderById_WithInvalidId_ShouldReturnNotFound() throws Exception {
        mockMvc.perform(get("/api/orders/99999"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "customer", roles = {"USER"})
    void createOrder_WithValidData_ShouldReturnCreatedOrder() throws Exception {
        OrderCreateDTO.OrderItemCreateDTO item = new OrderCreateDTO.OrderItemCreateDTO(1L, 1, "No onions please");
        OrderCreateDTO orderCreateDTO = new OrderCreateDTO(
            null, // userId - will be derived from security context
            Arrays.asList(item), // items
            PaymentMethod.DEPOSIT_SLIP, // paymentMethod
            null, // deliveryAddress
            null, // deliveryPhone
            "No onions please", // specialInstructions
            Order.OrderType.DINE_IN // orderType
        );

        mockMvc.perform(post("/api/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(orderCreateDTO)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.orderType").value("DINE_IN"))
                .andExpect(jsonPath("$.specialInstructions").value("No onions please"));
    }

    @Test
    @WithMockUser(username = "customer", roles = {"USER"})
    void createOrder_WithInvalidData_ShouldReturnBadRequest() throws Exception {
        // Empty items list should be invalid
        OrderCreateDTO orderCreateDTO = new OrderCreateDTO(
            null, // userId - will be derived from security context
            Arrays.asList(), // empty items - INVALID
            PaymentMethod.DEPOSIT_SLIP, // paymentMethod
            null, // deliveryAddress
            null, // deliveryPhone
            null, // specialInstructions
            Order.OrderType.DINE_IN // orderType
        );

        mockMvc.perform(post("/api/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(orderCreateDTO)))
                .andExpect(status().isBadRequest());
    }
}
package com.bms.restaurant_system.controller;

import com.bms.restaurant_system.dto.PaymentDTO;
import com.bms.restaurant_system.entity.Order;
import com.bms.restaurant_system.entity.Order.OrderStatus;
import com.bms.restaurant_system.entity.Order.OrderType;
import com.bms.restaurant_system.entity.Role;
import com.bms.restaurant_system.entity.User;
import com.bms.restaurant_system.repository.OrderRepository;
import com.bms.restaurant_system.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureWebMvc
@ActiveProfiles("test")
class PaymentControllerIntegrationTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
    }

    @Test
    void contextLoads() {
        // This test verifies that the Spring context loads successfully
    }

    @Test
    void getAllPayments_ShouldReturnPaymentsList() throws Exception {
        mockMvc.perform(get("/api/payments"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    void getPaymentById_WithValidId_ShouldReturnPayment() throws Exception {
        // First create a user
        User user = new User();
        user.setUsername("testuser6");
        user.setEmail("test6@example.com");
        user.setPassword("password");
        user.setRole(Role.USER);
        user = userRepository.save(user);

        // Create an order
        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setTotalAmount(new BigDecimal("50.00"));
        order.setStatus(OrderStatus.CONFIRMED);
        order.setOrderType(OrderType.DINE_IN);
        order = orderRepository.save(order);

        // Create a payment
        PaymentDTO paymentDTO = new PaymentDTO(
            null, // id
            order.getId(), // orderId
            BigDecimal.valueOf(50.00), // amount
            "DEPOSIT_SLIP", // paymentMethod
            "COMPLETED", // status
            "txn_123456", // transactionId
            null, // slipImage
            null, // paymentGateway
            null, // gatewayTransactionId
            null, // submittedDate
            null, // processedDate
            null, // approvedDate
            null, // failureReason
            null, // refundAmount
            null, // refundedDate
            null, // refundReason
            null, // createdAt
            null  // updatedAt
        );

        String response = mockMvc.perform(post("/api/payments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(paymentDTO)))
                .andReturn().getResponse().getContentAsString();

        PaymentDTO created = objectMapper.readValue(response, PaymentDTO.class);

        mockMvc.perform(get("/api/payments/" + created.id()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    void getPaymentById_WithInvalidId_ShouldReturnNotFound() throws Exception {
        mockMvc.perform(get("/api/payments/99999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void createPayment_WithValidData_ShouldReturnCreatedPayment() throws Exception {
        // First create a user
        User user = new User();
        user.setUsername("testuser3");
        user.setEmail("test3@example.com");
        user.setPassword("password");
        user.setRole(Role.USER);
        user = userRepository.save(user);

        // Create an order
        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setTotalAmount(new BigDecimal("50.00"));
        order.setStatus(OrderStatus.CONFIRMED);
        order.setOrderType(OrderType.DINE_IN);
        order = orderRepository.save(order);

        PaymentDTO paymentDTO = new PaymentDTO(
            null, // id
            order.getId(), // orderId
            BigDecimal.valueOf(50.00), // amount
            "DEPOSIT_SLIP", // paymentMethod
            "COMPLETED", // status
            "txn_123456", // transactionId
            null, // slipImage
            null, // paymentGateway
            null, // gatewayTransactionId
            null, // submittedDate
            null, // processedDate
            null, // approvedDate
            null, // failureReason
            null, // refundAmount
            null, // refundedDate
            null, // refundReason
            null, // createdAt
            null  // updatedAt
        );

        mockMvc.perform(post("/api/payments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(paymentDTO)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.amount").value(50.00))
                .andExpect(jsonPath("$.paymentMethod").value("DEPOSIT_SLIP"));
    }

    @Test
    void updatePayment_WithValidData_ShouldReturnUpdatedPayment() throws Exception {
        // First create a user
        User user = new User();
        user.setUsername("testuser4");
        user.setEmail("test4@example.com");
        user.setPassword("password");
        user.setRole(Role.USER);
        user = userRepository.save(user);

        // Create an order
        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setTotalAmount(new BigDecimal("50.00"));
        order.setStatus(OrderStatus.CONFIRMED);
        order.setOrderType(OrderType.DINE_IN);
        order = orderRepository.save(order);

        // Create a payment
        PaymentDTO paymentDTO = new PaymentDTO(
            null, // id
            order.getId(), // orderId
            BigDecimal.valueOf(50.00), // amount
            "DEPOSIT_SLIP", // paymentMethod
            "PENDING", // status
            "txn_123456", // transactionId
            null, // slipImage
            null, // paymentGateway
            null, // gatewayTransactionId
            null, // submittedDate
            null, // processedDate
            null, // approvedDate
            null, // failureReason
            null, // refundAmount
            null, // refundedDate
            null, // refundReason
            null, // createdAt
            null  // updatedAt
        );

        String response = mockMvc.perform(post("/api/payments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(paymentDTO)))
                .andReturn().getResponse().getContentAsString();

        PaymentDTO created = objectMapper.readValue(response, PaymentDTO.class);

        // Update the payment
        PaymentDTO updateDTO = new PaymentDTO(
            created.id(),
            created.orderId(),
            BigDecimal.valueOf(75.00), // updated amount
            created.paymentMethod(),
            "COMPLETED", // updated status
            created.transactionId(),
            created.slipImage(),
            created.paymentGateway(),
            created.gatewayTransactionId(),
            created.submittedDate(),
            created.processedDate(),
            created.approvedDate(),
            created.failureReason(),
            created.refundAmount(),
            created.refundedDate(),
            created.refundReason(),
            created.createdAt(),
            created.updatedAt()
        );

        mockMvc.perform(put("/api/payments/" + created.id())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.amount").value(75.00))
                .andExpect(jsonPath("$.status").value("COMPLETED"));
    }

    @Test
    void deletePayment_WithValidId_ShouldReturnSuccess() throws Exception {
        // First create a user
        User user = new User();
        user.setUsername("testuser5");
        user.setEmail("test5@example.com");
        user.setPassword("password");
        user.setRole(Role.USER);
        user = userRepository.save(user);

        // Create an order
        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setTotalAmount(new BigDecimal("50.00"));
        order.setStatus(OrderStatus.CONFIRMED);
        order.setOrderType(OrderType.DINE_IN);
        order = orderRepository.save(order);

        // Create a payment
        PaymentDTO paymentDTO = new PaymentDTO(
            null, // id
            order.getId(), // orderId
            BigDecimal.valueOf(50.00), // amount
            "DEPOSIT_SLIP", // paymentMethod
            "PENDING", // status
            "txn_123456", // transactionId
            null, // slipImage
            null, // paymentGateway
            null, // gatewayTransactionId
            null, // submittedDate
            null, // processedDate
            null, // approvedDate
            null, // failureReason
            null, // refundAmount
            null, // refundedDate
            null, // refundReason
            null, // createdAt
            null  // updatedAt
        );

        String response = mockMvc.perform(post("/api/payments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(paymentDTO)))
                .andReturn().getResponse().getContentAsString();

        PaymentDTO created = objectMapper.readValue(response, PaymentDTO.class);

        // Delete the payment - returns 204 NO_CONTENT
        mockMvc.perform(delete("/api/payments/" + created.id()))
                .andExpect(status().isNoContent());
    }

    @Test
    void processRefund_ShouldProcessPartialRefund() throws Exception {
        // First create a user
        User user = new User();
        user.setUsername("testuser");
        user.setEmail("test@example.com");
        user.setPassword("password");
        user.setRole(Role.USER);
        user = userRepository.save(user);

        // Create an order
        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setTotalAmount(new BigDecimal("100.00"));
        order.setStatus(OrderStatus.CONFIRMED);
        order.setOrderType(OrderType.DINE_IN);
        order = orderRepository.save(order);

        // Create a payment
        PaymentDTO paymentDTO = new PaymentDTO(
                null, // id
                order.getId(), // orderId
                new BigDecimal("100.00"), // amount
                "DEPOSIT_SLIP", // paymentMethod
                "PENDING", // status
                "TXN123", // transactionId
                null, // slipImage
                null, // paymentGateway
                null, // gatewayTransactionId
                null, // submittedDate
                null, // processedDate
                null, // approvedDate
                null, // failureReason
                null, // refundAmount
                null, // refundedDate
                null, // refundReason
                null, // createdAt
                null  // updatedAt
        );

        String response = mockMvc.perform(post("/api/payments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(paymentDTO)))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        PaymentDTO created = objectMapper.readValue(response, PaymentDTO.class);

        // Approve the payment first
        mockMvc.perform(put("/api/payments/" + created.id() + "/approve"))
                .andExpect(status().isOk());

        // Process a partial refund
        mockMvc.perform(post("/api/payments/" + created.id() + "/refund")
                .param("amount", "25.00")
                .param("reason", "Customer request"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("PARTIALLY_REFUNDED"))
                .andExpect(jsonPath("$.refundAmount").value(25.00))
                .andExpect(jsonPath("$.refundReason").value("Customer request"));
    }

    @Test
    void processFullRefund_ShouldProcessFullRefund() throws Exception {
        // First create a user
        User user = new User();
        user.setUsername("testuser2");
        user.setEmail("test2@example.com");
        user.setPassword("password");
        user.setRole(Role.USER);
        user = userRepository.save(user);

        // Create an order
        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setTotalAmount(new BigDecimal("50.00"));
        order.setStatus(OrderStatus.CONFIRMED);
        order.setOrderType(OrderType.DINE_IN);
        order = orderRepository.save(order);

        // Create a payment
        PaymentDTO paymentDTO = new PaymentDTO(
                null, // id
                order.getId(), // orderId
                new BigDecimal("50.00"), // amount
                "DEPOSIT_SLIP", // paymentMethod
                "PENDING", // status
                "TXN456", // transactionId
                null, // slipImage
                null, // paymentGateway
                null, // gatewayTransactionId
                null, // submittedDate
                null, // processedDate
                null, // approvedDate
                null, // failureReason
                null, // refundAmount
                null, // refundedDate
                null, // refundReason
                null, // createdAt
                null  // updatedAt
        );

        String response = mockMvc.perform(post("/api/payments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(paymentDTO)))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        PaymentDTO created = objectMapper.readValue(response, PaymentDTO.class);

        // Approve the payment first
        mockMvc.perform(put("/api/payments/" + created.id() + "/approve"))
                .andExpect(status().isOk());

        // Process a full refund - should succeed in test environment
        mockMvc.perform(post("/api/payments/" + created.id() + "/refund/full")
                .param("reason", "Order cancelled"))
                .andExpect(status().isOk());
    }

    @Test
    void calculateRefundAmount_ShouldCalculateCorrectAmount() throws Exception {
        // First create a user
        User user = new User();
        user.setUsername("testuser7");
        user.setEmail("test7@example.com");
        user.setPassword("password");
        user.setRole(Role.USER);
        user = userRepository.save(user);

        // Create an order
        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setTotalAmount(new BigDecimal("100.00"));
        order.setStatus(OrderStatus.CONFIRMED);
        order.setOrderType(OrderType.DINE_IN);
        order = orderRepository.save(order);

        // Create a payment
        PaymentDTO paymentDTO = new PaymentDTO(
            null, // id
            order.getId(), // orderId
            BigDecimal.valueOf(100.00), // amount
            "DEPOSIT_SLIP", // paymentMethod
            "COMPLETED", // status
            "txn_123456", // transactionId
            null, // slipImage
            null, // paymentGateway
            null, // gatewayTransactionId
            null, // submittedDate
            null, // processedDate
            null, // approvedDate
            null, // failureReason
            null, // refundAmount
            null, // refundedDate
            null, // refundReason
            null, // createdAt
            null  // updatedAt
        );

        mockMvc.perform(post("/api/payments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(paymentDTO)))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/payments/calculate-refund")
                .param("orderId", order.getId().toString())
                .param("refundType", "FULL"))
                .andExpect(status().isOk())
                .andExpect(content().string("100.00")); // Should return the full payment amount with 2 decimal places
    }
}
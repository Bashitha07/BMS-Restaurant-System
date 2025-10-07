package com.bms.restaurant_system.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderDTO(
    Long id,
    LocalDateTime orderDate,
    String status,
    BigDecimal totalAmount,
    BigDecimal subtotal,
    BigDecimal taxAmount,
    BigDecimal deliveryFee,
    String paymentMethod,
    String deliveryAddress,
    String deliveryPhone,
    String specialInstructions,
    String orderType,
    LocalDateTime estimatedDeliveryTime,
    LocalDateTime actualDeliveryTime,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    Long userId,
    String userName,
    String userEmail,
    List<OrderItemDTO> items,
    DeliveryDTO delivery,
    List<PaymentDTO> payments
) {}

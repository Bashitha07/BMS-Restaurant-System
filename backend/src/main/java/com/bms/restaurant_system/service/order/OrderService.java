package com.bms.restaurant_system.service.order;

import com.bms.restaurant_system.dto.OrderDTO;
import com.bms.restaurant_system.dto.OrderCreateDTO;
import com.bms.restaurant_system.dto.OrderItemDTO;
import com.bms.restaurant_system.dto.driver.DeliveryDTO;
import com.bms.restaurant_system.dto.PaymentDTO;
import com.bms.restaurant_system.entity.*;
import com.bms.restaurant_system.exception.ResourceNotFoundException;
import com.bms.restaurant_system.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MenuRepository menuRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private DeliveryRepository deliveryRepository;

    // Basic CRUD Operations
    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAllWithDetails().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public OrderDTO getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
        return convertToDTO(order);
    }
    
    public List<OrderDTO> getOrdersForCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            
        List<Order> userOrders = orderRepository.findByUserId(currentUser.getId());
        return userOrders.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    public List<OrderDTO> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<OrderDTO> getOrdersByStatus(Order.OrderStatus status) {
        return orderRepository.findByStatusOrderByCreatedAtDesc(status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public OrderDTO createOrder(OrderCreateDTO orderCreateDTO) {
        // Get current user from security context
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(Order.OrderStatus.PENDING);
        order.setPaymentMethod(orderCreateDTO.paymentMethod());
        order.setDeliveryAddress(orderCreateDTO.deliveryAddress());
        order.setDeliveryPhone(orderCreateDTO.deliveryPhone());
        order.setSpecialInstructions(orderCreateDTO.specialInstructions());
        order.setOrderType(orderCreateDTO.orderType() != null ? orderCreateDTO.orderType() : Order.OrderType.DELIVERY);

        // Save order first to get ID
        order = orderRepository.save(order);

        // Create order items
        final Order finalOrder = order;
        List<OrderItem> orderItems = orderCreateDTO.items().stream().map(itemDTO -> {
            Menu menu = menuRepository.findById(itemDTO.menuId())
                    .orElseThrow(() -> new ResourceNotFoundException("Menu not found with id: " + itemDTO.menuId()));
            
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(finalOrder);
            orderItem.setMenu(menu);
            orderItem.setQuantity(itemDTO.quantity());
            orderItem.setUnitPrice(menu.getEffectivePrice());
            orderItem.setSpecialInstructions(itemDTO.specialInstructions());
            return orderItem;
        }).collect(Collectors.toList());

        orderItemRepository.saveAll(orderItems);
        order.setItems(orderItems);

        // Calculate totals
        order.calculateTotals();

        // Create delivery if it's a delivery order
        if (order.isDeliveryOrder()) {
            Delivery delivery = new Delivery();
            delivery.setOrder(order);
            delivery.setDeliveryAddress(orderCreateDTO.deliveryAddress());
            delivery.setDeliveryPhone(orderCreateDTO.deliveryPhone());
            delivery.setDeliveryInstructions(orderCreateDTO.specialInstructions());
            delivery.setStatus(Delivery.DeliveryStatus.PENDING);
            delivery.setDeliveryFee(order.getDeliveryFee());
            delivery = deliveryRepository.save(delivery);
            order.setDelivery(delivery);
        }

        // Save final order
        order = orderRepository.save(order);
        return convertToDTO(order);
    }

    public OrderDTO updateOrderStatus(Long id, Order.OrderStatus status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
        
        order.setStatus(status);
        
        // Update delivery status if applicable
        if (order.getDelivery() != null) {
            switch (status) {
                case PENDING -> order.getDelivery().setStatus(Delivery.DeliveryStatus.PENDING);
                case CONFIRMED -> order.getDelivery().setStatus(Delivery.DeliveryStatus.PENDING);
                case PREPARING -> order.getDelivery().setStatus(Delivery.DeliveryStatus.ASSIGNED);
                case READY_FOR_PICKUP -> order.getDelivery().setStatus(Delivery.DeliveryStatus.PICKED_UP);
                case OUT_FOR_DELIVERY -> order.getDelivery().setStatus(Delivery.DeliveryStatus.IN_TRANSIT);
                case DELIVERED -> {
                    order.getDelivery().setStatus(Delivery.DeliveryStatus.DELIVERED);
                    order.setActualDeliveryTime(LocalDateTime.now());
                }
                case CANCELLED -> order.getDelivery().setStatus(Delivery.DeliveryStatus.CANCELLED);
                case REFUNDED -> { /* No delivery status change needed */ }
            }
            deliveryRepository.save(order.getDelivery());
        }
        
        order = orderRepository.save(order);
        return convertToDTO(order);
    }

    public OrderDTO cancelOrder(Long id, String reason) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
        
        if (!order.canBeCancelled()) {
            throw new IllegalStateException("Order cannot be cancelled in current status: " + order.getStatus());
        }
        
        order.setStatus(Order.OrderStatus.CANCELLED);
        
        // Cancel delivery if exists
        if (order.getDelivery() != null) {
            order.getDelivery().setStatus(Delivery.DeliveryStatus.CANCELLED);
            order.getDelivery().setDeliveryNotes("Order cancelled: " + reason);
            deliveryRepository.save(order.getDelivery());
        }
        
        order = orderRepository.save(order);
        return convertToDTO(order);
    }

    public OrderDTO updateOrder(Long id, OrderDTO orderDTO) {
        Order existingOrder = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
        
        existingOrder.setStatus(Order.OrderStatus.valueOf(orderDTO.status()));
        existingOrder.setDeliveryAddress(orderDTO.deliveryAddress());
        existingOrder.setDeliveryPhone(orderDTO.deliveryPhone());
        existingOrder.setSpecialInstructions(orderDTO.specialInstructions());
        
        existingOrder = orderRepository.save(existingOrder);
        return convertToDTO(existingOrder);
    }

    public void deleteOrder(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
        orderRepository.delete(order);
    }

    // Business Logic Methods
    public List<OrderDTO> getTodaysOrders() {
        LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        LocalDateTime endOfDay = LocalDateTime.now().withHour(23).withMinute(59).withSecond(59);
        return orderRepository.findByOrderDateBetween(startOfDay, endOfDay).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<OrderDTO> getPendingOrders() {
        return getOrdersByStatus(Order.OrderStatus.PENDING);
    }

    public List<OrderDTO> getActiveOrders() {
        List<Order.OrderStatus> activeStatuses = List.of(
            Order.OrderStatus.CONFIRMED,
            Order.OrderStatus.PREPARING,
            Order.OrderStatus.READY_FOR_PICKUP,
            Order.OrderStatus.OUT_FOR_DELIVERY
        );
        return orderRepository.findByStatusInOrderByCreatedAtDesc(activeStatuses).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Map<String, List<OrderDTO>> getOrdersGroupedForAdmin() {
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        List<Order> allOrders = orderRepository.findAll();
        
        Map<String, List<OrderDTO>> groupedOrders = new HashMap<>();
        
        // Group 1: Not delivered (PENDING, CONFIRMED, PREPARING, READY_FOR_PICKUP, OUT_FOR_DELIVERY)
        List<OrderDTO> notDelivered = allOrders.stream()
            .filter(order -> order.getStatus() != Order.OrderStatus.DELIVERED 
                          && order.getStatus() != Order.OrderStatus.CANCELLED
                          && order.getStatus() != Order.OrderStatus.REFUNDED)
            .sorted((o1, o2) -> {
                LocalDateTime date1 = o1.getCreatedAt() != null ? o1.getCreatedAt() : LocalDateTime.MIN;
                LocalDateTime date2 = o2.getCreatedAt() != null ? o2.getCreatedAt() : LocalDateTime.MIN;
                return date2.compareTo(date1);
            })
            .map(this::convertToDTO)
            .collect(Collectors.toList());
        
        // Group 2: Delivered in last 7 days
        List<OrderDTO> recentlyDelivered = allOrders.stream()
            .filter(order -> {
                if (order.getStatus() != Order.OrderStatus.DELIVERED) return false;
                LocalDateTime updated = order.getUpdatedAt() != null ? order.getUpdatedAt() : 
                                       (order.getCreatedAt() != null ? order.getCreatedAt() : LocalDateTime.MIN);
                return updated.isAfter(sevenDaysAgo);
            })
            .sorted((o1, o2) -> {
                LocalDateTime date1 = o1.getUpdatedAt() != null ? o1.getUpdatedAt() : 
                                     (o1.getCreatedAt() != null ? o1.getCreatedAt() : LocalDateTime.MIN);
                LocalDateTime date2 = o2.getUpdatedAt() != null ? o2.getUpdatedAt() : 
                                     (o2.getCreatedAt() != null ? o2.getCreatedAt() : LocalDateTime.MIN);
                return date2.compareTo(date1);
            })
            .map(this::convertToDTO)
            .collect(Collectors.toList());
        
        // Group 3: All other orders (old delivered, cancelled, refunded)
        List<OrderDTO> otherOrders = allOrders.stream()
            .filter(order -> {
                if (order.getStatus() == Order.OrderStatus.CANCELLED || 
                    order.getStatus() == Order.OrderStatus.REFUNDED) return true;
                
                if (order.getStatus() == Order.OrderStatus.DELIVERED) {
                    LocalDateTime updated = order.getUpdatedAt() != null ? order.getUpdatedAt() : 
                                           (order.getCreatedAt() != null ? order.getCreatedAt() : LocalDateTime.MIN);
                    return updated.isBefore(sevenDaysAgo) || updated.equals(LocalDateTime.MIN);
                }
                return false;
            })
            .sorted((o1, o2) -> {
                LocalDateTime date1 = o1.getUpdatedAt() != null ? o1.getUpdatedAt() : 
                                     (o1.getCreatedAt() != null ? o1.getCreatedAt() : LocalDateTime.MIN);
                LocalDateTime date2 = o2.getUpdatedAt() != null ? o2.getUpdatedAt() : 
                                     (o2.getCreatedAt() != null ? o2.getCreatedAt() : LocalDateTime.MIN);
                return date2.compareTo(date1);
            })
            .map(this::convertToDTO)
            .collect(Collectors.toList());
        
        groupedOrders.put("notDelivered", notDelivered);
        groupedOrders.put("recentlyDelivered", recentlyDelivered);
        groupedOrders.put("others", otherOrders);
        
        return groupedOrders;
    }

    public Map<String, Object> getOrderStatistics() {
        return Map.of(
            "totalOrders", orderRepository.count(),
            "todayOrders", getTodaysOrders().size(),
            "pendingOrders", orderRepository.countByStatus(Order.OrderStatus.PENDING),
            "completedOrders", orderRepository.countByStatus(Order.OrderStatus.DELIVERED),
            "totalRevenue", orderRepository.getTotalRevenue(),
            "averageOrderValue", orderRepository.getAverageOrderValue()
        );
    }

    // Helper Methods
    private OrderDTO convertToDTO(Order order) {
        List<OrderItemDTO> items = order.getItems() != null ? order.getItems().stream()
                .map(this::convertOrderItemToDTO)
                .collect(Collectors.toList()) : List.of();

        DeliveryDTO deliveryDTO = order.getDelivery() != null ? convertDeliveryToDTO(order.getDelivery()) : null;
        
        List<PaymentDTO> payments = order.getPayments() != null ? order.getPayments().stream()
                .map(this::convertPaymentToDTO)
                .collect(Collectors.toList()) : List.of();

        // Safely get user information with null checks
        Long userId = order.getUser() != null ? order.getUser().getId() : null;
        String username = order.getUser() != null ? order.getUser().getUsername() : "Unknown";
        String userEmail = order.getUser() != null ? order.getUser().getEmail() : "No email";

        return new OrderDTO(
                order.getId(),
                order.getOrderDate(),
                order.getStatus() != null ? order.getStatus().name() : "PENDING",
                order.getTotalAmount(),
                order.getSubtotal(),
                order.getTaxAmount(),
                order.getDeliveryFee(),
                order.getPaymentMethod() != null ? order.getPaymentMethod().name() : null,
                order.getDeliveryAddress(),
                order.getDeliveryPhone(),
                order.getSpecialInstructions(),
                order.getOrderType() != null ? order.getOrderType().name() : "DELIVERY",
                order.getEstimatedDeliveryTime(),
                order.getActualDeliveryTime(),
                order.getCreatedAt(),
                order.getUpdatedAt(),
                userId,
                username,
                userEmail,
                items,
                deliveryDTO,
                payments
        );
    }

    private OrderItemDTO convertOrderItemToDTO(OrderItem item) {
        // Safely get menu information with null checks
        Long menuId = item.getMenu() != null ? item.getMenu().getId() : null;
        String menuName = item.getMenu() != null ? item.getMenu().getName() : "Unknown Item";
        String menuDescription = item.getMenu() != null ? item.getMenu().getDescription() : "";
        String menuCategory = item.getMenu() != null ? item.getMenu().getCategory() : "";
        String menuImageUrl = item.getMenu() != null ? item.getMenu().getImageUrl() : "";

        return new OrderItemDTO(
                item.getId(),
                menuId,
                menuName,
                menuDescription,
                menuCategory,
                menuImageUrl,
                item.getQuantity(),
                item.getUnitPrice(),
                item.getTotalPrice(),
                item.getSpecialInstructions()
        );
    }

    private DeliveryDTO convertDeliveryToDTO(Delivery delivery) {
        return new DeliveryDTO(
                delivery.getId(),
                delivery.getOrder().getId(),
                delivery.getDriver() != null ? delivery.getDriver().getId() : null,
                delivery.getDriverName(),
                delivery.getDriverPhone(),
                delivery.getDriverVehicle(),
                delivery.getDeliveryAddress(),
                delivery.getDeliveryPhone(),
                delivery.getDeliveryInstructions(),
                delivery.getStatus().name(),
                delivery.getDeliveryFee(),
                delivery.getEstimatedDeliveryTime(),
                delivery.getActualDeliveryTime(),
                delivery.getPickupTime(),
                delivery.getAssignedDate(),
                delivery.getDeliveredDate(),
                delivery.getCurrentLatitude(),
                delivery.getCurrentLongitude(),
                delivery.getDeliveryLatitude(),
                delivery.getDeliveryLongitude(),
                delivery.getDistanceKm(),
                delivery.getCustomerRating(),
                delivery.getCustomerFeedback(),
                delivery.getDeliveryNotes(),
                delivery.getProofOfDelivery(),
                delivery.getCreatedAt(),
                delivery.getUpdatedAt()
        );
    }

    private PaymentDTO convertPaymentToDTO(Payment payment) {
        return new PaymentDTO(
                payment.getId(),
                payment.getOrder().getId(),
                payment.getAmount(),
                payment.getPaymentMethod().name(),
                payment.getStatus().name(),
                payment.getTransactionId(),
                payment.getSlipImage(),
                payment.getPaymentGateway(),
                payment.getGatewayTransactionId(),
                payment.getSubmittedDate(),
                payment.getProcessedDate(),
                payment.getApprovedDate(),
                payment.getFailureReason(),
                payment.getRefundAmount(),
                payment.getRefundedDate(),
                payment.getRefundReason(),
                payment.getCreatedAt(),
                payment.getUpdatedAt()
        );
    }

    public Map<String, Object> generateInvoice(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        Map<String, Object> invoice = new HashMap<>();
        invoice.put("orderId", order.getId());
        invoice.put("orderDate", order.getOrderDate());
        invoice.put("status", order.getStatus().name());
        invoice.put("paymentMethod", order.getPaymentMethod() != null ? order.getPaymentMethod().name() : "");
        invoice.put("deliveryAddress", order.getDeliveryAddress() != null ? order.getDeliveryAddress() : "");
        
        Map<String, String> customer = new HashMap<>();
        customer.put("name", order.getUser().getUsername());
        customer.put("email", order.getUser().getEmail());
        customer.put("phone", order.getDeliveryPhone() != null ? order.getDeliveryPhone() : "");
        invoice.put("customer", customer);
        
        List<Map<String, Object>> items = order.getItems().stream()
                .map(item -> {
                    Map<String, Object> itemMap = new HashMap<>();
                    itemMap.put("menuName", item.getMenu().getName());
                    itemMap.put("quantity", item.getQuantity());
                    itemMap.put("unitPrice", item.getUnitPrice());
                    itemMap.put("totalPrice", item.getTotalPrice());
                    return itemMap;
                })
                .collect(Collectors.toList());
        invoice.put("items", items);
        
        invoice.put("subtotal", order.getSubtotal());
        invoice.put("taxAmount", order.getTaxAmount());
        invoice.put("deliveryFee", order.getDeliveryFee());
        invoice.put("totalAmount", order.getTotalAmount());
        
        return invoice;
    }
}

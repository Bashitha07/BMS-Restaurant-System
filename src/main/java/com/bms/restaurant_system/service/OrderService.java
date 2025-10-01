package com.bms.restaurant_system.service;

import com.bms.restaurant_system.dto.OrderDTO;
import com.bms.restaurant_system.dto.OrderCreateDTO;
import com.bms.restaurant_system.dto.OrderItemDTO;
import com.bms.restaurant_system.dto.DeliveryDTO;
import com.bms.restaurant_system.entity.Delivery;
import com.bms.restaurant_system.entity.Menu;
import com.bms.restaurant_system.entity.Order;
import com.bms.restaurant_system.entity.OrderItem;
import com.bms.restaurant_system.entity.User;
import com.bms.restaurant_system.entity.PaymentMethod;
import com.bms.restaurant_system.exception.ResourceNotFoundException;
import com.bms.restaurant_system.repository.DeliveryRepository;
import com.bms.restaurant_system.repository.MenuRepository;
import com.bms.restaurant_system.repository.OrderItemRepository;
import com.bms.restaurant_system.repository.OrderRepository;
import com.bms.restaurant_system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
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

    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public OrderDTO getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
        return convertToDTO(order);
    }

    public OrderDTO createOrder(OrderCreateDTO orderCreateDTO) {
        // Get current user from security context
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("PENDING");
        order.setPaymentMethod(orderCreateDTO.paymentMethod());

        // Create order items
        final Order finalOrder = order;
        List<OrderItem> orderItems = orderCreateDTO.items().stream().map(itemDTO -> {
            Menu menu = menuRepository.findById(itemDTO.menuId())
                    .orElseThrow(() -> new ResourceNotFoundException("Menu not found with id: " + itemDTO.menuId()));
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(finalOrder);
            orderItem.setMenu(menu);
            orderItem.setQuantity(itemDTO.quantity());
            return orderItem;
        }).collect(Collectors.toList());

        order.setItems(orderItems);

        // Calculate total amount
        double totalAmount = orderItems.stream()
                .mapToDouble(item -> item.getMenu().getPrice().doubleValue() * item.getQuantity())
                .sum();
        order.setTotalAmount(totalAmount);

        // Save order
        order = orderRepository.save(order);
        orderItemRepository.saveAll(orderItems);

        // Create delivery
        Delivery delivery = new Delivery();
        delivery.setOrder(order);
        delivery.setDeliveryAddress(orderCreateDTO.deliveryAddress());
        delivery.setStatus("PENDING");
        delivery.setAssignedDate(LocalDateTime.now());
        delivery = deliveryRepository.save(delivery);
        order.setDelivery(delivery);

        order = orderRepository.save(order);

        return convertToDTO(order);
    }

    public OrderDTO updateOrder(Long id, OrderDTO orderDTO) {
        Order existingOrder = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
        existingOrder.setStatus(orderDTO.status());
        existingOrder.setTotalAmount(orderDTO.totalAmount());
        existingOrder.setPaymentMethod(PaymentMethod.valueOf(orderDTO.paymentMethod()));

        // Update delivery if provided
        if (orderDTO.delivery() != null) {
            Delivery delivery = existingOrder.getDelivery();
            if (delivery == null) {
                delivery = new Delivery();
                delivery.setOrder(existingOrder);
            }
            delivery.setDeliveryAddress(orderDTO.deliveryAddress());
            delivery = deliveryRepository.save(delivery);
            existingOrder.setDelivery(delivery);
        }

        existingOrder = orderRepository.save(existingOrder);
        return convertToDTO(existingOrder);
    }

    public void deleteOrder(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
        orderRepository.delete(order);
    }

    private OrderDTO convertToDTO(Order order) {
        List<OrderItemDTO> items = order.getItems().stream()
                .map(item -> new OrderItemDTO(item.getMenu().getId(), item.getQuantity()))
                .collect(Collectors.toList());

        DeliveryDTO deliveryDTO = order.getDelivery() != null ?
                new DeliveryDTO(order.getDelivery().getId(), order.getId(), order.getDelivery().getDeliveryAddress(),
                        order.getDelivery().getDriverName(), order.getDelivery().getDriverPhone(),
                        order.getDelivery().getDriverVehicle(), order.getDelivery().getStatus(),
                        order.getDelivery().getAssignedDate(), order.getDelivery().getDeliveredDate()) :
                null;

        return new OrderDTO(
                order.getId(),
                order.getStatus(),
                order.getTotalAmount(),
                order.getOrderDate(),
                order.getPaymentMethod().name(),
                order.getDeliveryAddress(),
                items,
                deliveryDTO
        );
    }



    public Map<String, Object> generateInvoice(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        Map<String, Object> invoice = Map.of(
                "orderId", order.getId(),
                "orderDate", order.getOrderDate(),
                "status", order.getStatus(),
                "paymentMethod", order.getPaymentMethod().name(),
                "deliveryAddress", order.getDelivery() != null ? order.getDelivery().getDeliveryAddress() : null,
                "items", order.getItems().stream()
                        .map(item -> Map.of(
                                "menuName", item.getMenu().getName(),
                                "quantity", item.getQuantity(),
                                "price", item.getMenu().getPrice(),
                                "subtotal", item.getMenu().getPrice().doubleValue() * item.getQuantity()
                        ))
                        .collect(Collectors.toList()),
                "totalAmount", order.getTotalAmount()
        );

        return invoice;
    }
}

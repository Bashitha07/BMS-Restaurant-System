package com.bms.restaurant_system.config;

import com.bms.restaurant_system.entity.*;
import com.bms.restaurant_system.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Test Data Initializer - Seeds database with test data for integration tests
 * Only runs when @ActiveProfiles("test") is set
 */
@Component
@Profile("test")
public class TestDataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MenuRepository menuRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Clean database
        orderRepository.deleteAll();
        reservationRepository.deleteAll();
        menuRepository.deleteAll();
        userRepository.deleteAll();

        // Create Admin User (ID=1)
        User admin = new User();
        admin.setUsername("admin");
        admin.setEmail("admin@restaurant.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setPhone("1234567890");
        admin.setRole(Role.ADMIN);
        admin.setEnabled(true);
        admin = userRepository.save(admin);

        // Create Regular Customer User (ID=2)
        User customer = new User();
        customer.setUsername("customer");
        customer.setEmail("customer@example.com");
        customer.setPassword(passwordEncoder.encode("password123"));
        customer.setPhone("9876543210");
        customer.setRole(Role.USER);
        customer.setEnabled(true);
        customer = userRepository.save(customer);

        // Create Delivery Driver User (ID=3)
        User driver = new User();
        driver.setUsername("driver");
        driver.setEmail("driver@restaurant.com");
        driver.setPassword(passwordEncoder.encode("driver123"));
        driver.setPhone("5555555555");
        driver.setRole(Role.DRIVER);
        driver.setEnabled(true);
        driver = userRepository.save(driver);

        // Create Test User (ID=4)
        User testUser = new User();
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
        testUser.setPassword(passwordEncoder.encode("password123"));
        testUser.setPhone("1111111111");
        testUser.setRole(Role.USER);
        testUser.setEnabled(true);
        testUser = userRepository.save(testUser);

        // Create Menu Items
        Menu pizza = new Menu();
        pizza.setName("Margherita Pizza");
        pizza.setDescription("Classic Italian pizza with tomato, mozzarella, and basil");
        pizza.setPrice(BigDecimal.valueOf(12.99));
        pizza.setCategory("Main Course");
        pizza.setIsAvailable(true);
        pizza.setImageUrl("/images/menu/pizza.jpg");
        pizza = menuRepository.save(pizza);

        Menu burger = new Menu();
        burger.setName("Cheese Burger");
        burger.setDescription("Juicy beef patty with cheese, lettuce, and tomato");
        burger.setPrice(BigDecimal.valueOf(9.99));
        burger.setCategory("Main Course");
        burger.setIsAvailable(true);
        burger.setImageUrl("/images/menu/burger.jpg");
        burger = menuRepository.save(burger);

        Menu pasta = new Menu();
        pasta.setName("Spaghetti Carbonara");
        pasta.setDescription("Creamy pasta with bacon and parmesan cheese");
        pasta.setPrice(BigDecimal.valueOf(11.99));
        pasta.setCategory("Main Course");
        pasta.setIsAvailable(true);
        pasta.setImageUrl("/images/menu/pasta.jpg");
        pasta = menuRepository.save(pasta);

        Menu salad = new Menu();
        salad.setName("Caesar Salad");
        salad.setDescription("Fresh romaine lettuce with caesar dressing and croutons");
        salad.setPrice(BigDecimal.valueOf(7.99));
        salad.setCategory("Appetizer");
        salad.setIsAvailable(true);
        salad.setImageUrl("/images/menu/salad.jpg");
        salad = menuRepository.save(salad);

        Menu coke = new Menu();
        coke.setName("Coca Cola");
        coke.setDescription("Refreshing cold drink");
        coke.setPrice(BigDecimal.valueOf(2.99));
        coke.setCategory("Beverage");
        coke.setIsAvailable(true);
        coke.setImageUrl("/images/menu/coke.jpg");
        coke = menuRepository.save(coke);

        // Create Sample Order for Testing
        Order order = new Order();
        order.setUser(customer);
        order.setOrderDate(LocalDateTime.now());
        order.setTotalAmount(BigDecimal.valueOf(25.97));
        order.setStatus(Order.OrderStatus.PENDING);
        order.setDeliveryAddress("123 Test Street, Test City");
        order = orderRepository.save(order);

        // Create Sample Reservations for Testing
        Reservation reservation1 = new Reservation();
        reservation1.setUser(customer);
        LocalDateTime reservationDateTime1 = LocalDateTime.now().plusDays(1).withHour(18).withMinute(0).withSecond(0).withNano(0);
        reservation1.setReservationDate(reservationDateTime1.toLocalDate());
        reservation1.setReservationTime(reservationDateTime1.toLocalTime());
        reservation1.setReservationDateTime(reservationDateTime1);
        reservation1.setNumberOfPeople(4);
        reservation1.setCustomerName("John Customer");
        reservation1.setCustomerEmail("customer@example.com");
        reservation1.setCustomerPhone("9876543210");
        reservation1.setTableNumber(5);
        reservation1.setStatus(Reservation.ReservationStatus.CONFIRMED);
        reservation1.setSpecialRequests("Window seat preferred");
        reservation1 = reservationRepository.save(reservation1);

        Reservation reservation2 = new Reservation();
        reservation2.setUser(customer);
        LocalDateTime reservationDateTime2 = LocalDateTime.now().plusDays(2).withHour(19).withMinute(30).withSecond(0).withNano(0);
        reservation2.setReservationDate(reservationDateTime2.toLocalDate());
        reservation2.setReservationTime(reservationDateTime2.toLocalTime());
        reservation2.setReservationDateTime(reservationDateTime2);
        reservation2.setNumberOfPeople(2);
        reservation2.setCustomerName("John Customer");
        reservation2.setCustomerEmail("customer@example.com");
        reservation2.setCustomerPhone("9876543210");
        reservation2.setTableNumber(3);
        reservation2.setStatus(Reservation.ReservationStatus.PENDING);
        reservation2.setSpecialRequests("Birthday celebration");
        reservation2 = reservationRepository.save(reservation2);

        System.out.println("✅ Test Data Initialized Successfully!");
        System.out.println("   - Users: " + userRepository.count());
        System.out.println("   - Menu Items: " + menuRepository.count());
        System.out.println("   - Orders: " + orderRepository.count());
        System.out.println("   - Reservations: " + reservationRepository.count());
        System.out.println("   - Admin: username='admin', password='admin123'");
        System.out.println("   - Customer: username='customer', password='password123'");
        System.out.println("   - Driver: username='driver', password='driver123'");
    }
}

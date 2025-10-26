package com.bms.restaurant_system.config;

import com.bms.restaurant_system.entity.Menu;
import com.bms.restaurant_system.entity.Role;
import com.bms.restaurant_system.entity.User;
import com.bms.restaurant_system.repository.MenuRepository;
import com.bms.restaurant_system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.stereotype.Component; - DISABLED to prevent menu auto-recreation
import org.springframework.context.annotation.Profile;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

// @Component - DISABLED: Menu items are now managed via admin panel only
@Profile("!test")
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MenuRepository menuRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Clean up any duplicate admin users first
        List<User> adminUsers = userRepository.findAll().stream()
            .filter(user -> "admin".equals(user.getUsername()) || "restaurantadmin".equals(user.getUsername()))
            .collect(Collectors.toList());

        if (adminUsers.size() > 1) {
            // Keep the first admin user and delete the rest
            User keepAdmin = adminUsers.get(0);
            for (int i = 1; i < adminUsers.size(); i++) {
                userRepository.delete(adminUsers.get(i));
            }
            // Update the kept admin to have the correct credentials
            keepAdmin.setUsername("admin");
            keepAdmin.setPassword(passwordEncoder.encode("admin123"));
            userRepository.save(keepAdmin);
        } else if (adminUsers.size() == 1) {
            // Update existing admin to have correct credentials
            User existingAdmin = adminUsers.get(0);
            existingAdmin.setUsername("admin");
            existingAdmin.setPassword(passwordEncoder.encode("admin123"));
            userRepository.save(existingAdmin);
        } else {
            // No admin exists, create one
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@restaurant.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
            admin.setPhone("071-234-5678");
            userRepository.save(admin);
        }

        if (userRepository.findByUsername("customer1").isEmpty()) {
            User user = new User();
            user.setUsername("customer1");
            user.setEmail("customer1@example.com");
            user.setPassword(passwordEncoder.encode("customer1"));
            user.setRole(Role.USER);
            user.setPhone("077-987-6543");
            userRepository.save(user);
        }

        // Insert sample menu items if they don't exist
        if (menuRepository.findByName("Margherita Pizza").isEmpty()) {
            Menu pizza = new Menu();
            pizza.setName("Margherita Pizza");
            pizza.setDescription("Fresh mozzarella, tomatoes, and basil on thin crust");
            pizza.setPrice(new BigDecimal("2500.00"));
            pizza.setCategory("Pizza");
            pizza.setIsAvailable(true);
            menuRepository.save(pizza);
        }

        if (menuRepository.findByName("Caesar Salad").isEmpty()) {
            Menu salad = new Menu();
            salad.setName("Caesar Salad");
            salad.setDescription("Crisp romaine lettuce with Caesar dressing and croutons");
            salad.setPrice(new BigDecimal("800.00"));
            salad.setCategory("Salads");
            salad.setIsAvailable(true);
            menuRepository.save(salad);
        }

        if (menuRepository.findByName("Grilled Chicken Burger").isEmpty()) {
            Menu burger = new Menu();
            burger.setName("Grilled Chicken Burger");
            burger.setDescription("Juicy grilled chicken breast with lettuce, tomato, and mayo");
            burger.setPrice(new BigDecimal("900.00"));
            burger.setCategory("Burgers");
            burger.setIsAvailable(true);
            menuRepository.save(burger);
        }

        if (menuRepository.findByName("Chocolate Brownie").isEmpty()) {
            Menu dessert = new Menu();
            dessert.setName("Chocolate Brownie");
            dessert.setDescription("Rich chocolate brownie served with vanilla ice cream");
            dessert.setPrice(new BigDecimal("400.00"));
            dessert.setCategory("Desserts");
            dessert.setIsAvailable(true);
            menuRepository.save(dessert);
        }

        if (menuRepository.findByName("Spaghetti Carbonara").isEmpty()) {
            Menu pasta = new Menu();
            pasta.setName("Spaghetti Carbonara");
            pasta.setDescription("Classic Italian pasta with eggs, cheese, pancetta, and black pepper");
            pasta.setPrice(new BigDecimal("1200.00"));
            pasta.setCategory("Pasta");
            pasta.setIsAvailable(true);
            menuRepository.save(pasta);
        }

        // Add all the provided menu items
        addMenuIfNotExists("Chicken Kottu", "Traditional Sri Lankan chopped roti with chicken", "700.00", "Kottu");
        addMenuIfNotExists("Cheese Chicken Kottu", "Chicken kottu with melted cheese", "850.00", "Kottu");
        addMenuIfNotExists("Fish Kottu", "Traditional kottu with fresh fish", "900.00", "Kottu");
        addMenuIfNotExists("Vegetarian Kottu", "Vegetarian version of traditional kottu", "500.00", "Kottu");
        addMenuIfNotExists("Rice and Curry", "Traditional Sri Lankan rice and curry", "550.00", "Rice");
        addMenuIfNotExists("Fried Rice", "Vegetable fried rice with eggs", "450.00", "Rice");
        addMenuIfNotExists("Nasi Goreng", "Indonesian fried rice with spices", "550.00", "Rice");
        addMenuIfNotExists("Biryani", "Aromatic rice dish with meat and spices", "750.00", "Rice");
        addMenuIfNotExists("Lamprais", "Dutch Burgher rice dish with meat and fish", "650.00", "Rice");
        addMenuIfNotExists("Fried Noodles", "Stir-fried noodles with vegetables", "450.00", "Noodles");
        addMenuIfNotExists("Cheese Chicken Burger", "Chicken burger with cheese", "850.00", "Burgers");
        addMenuIfNotExists("Crispy Chicken Burger", "Crispy chicken patty burger", "800.00", "Burgers");
        addMenuIfNotExists("Double Chicken Cheese Burger", "Double chicken patties with cheese", "1300.00", "Burgers");
        addMenuIfNotExists("Crispy Chicken Submarine", "Crispy chicken submarine sandwich", "1100.00", "Submarines");
        addMenuIfNotExists("Cheese Chicken Submarine", "Chicken submarine with cheese", "1200.00", "Submarines");
        addMenuIfNotExists("Roast Chicken", "Traditional roast chicken", "950.00", "Bites");
        addMenuIfNotExists("Chicken Drumsticks", "Crispy chicken drumsticks", "550.00", "Bites");
        addMenuIfNotExists("Hot Butter Mushroom", "Mushrooms in hot butter sauce", "650.00", "Bites");
        addMenuIfNotExists("French Fries", "Golden crispy french fries", "350.00", "Bites");
        addMenuIfNotExists("Egg (Bulls eye)", "Fried egg with runny yolk", "100.00", "Bites");
        addMenuIfNotExists("Egg Omelette", "Classic egg omelette", "250.00", "Bites");
        addMenuIfNotExists("Devilled Chicken", "Spicy devilled chicken", "850.00", "Bites");
        addMenuIfNotExists("Devilled Fish", "Spicy devilled fish", "1100.00", "Bites");
        addMenuIfNotExists("Devilled Pork", "Spicy devilled pork", "950.00", "Bites");
        addMenuIfNotExists("Devilled Prawns", "Spicy devilled prawns", "1300.00", "Bites");
        addMenuIfNotExists("Crispy Chicken", "Crispy fried chicken pieces", "750.00", "Bites");
        addMenuIfNotExists("Avocado Juice", "Fresh avocado juice", "450.00", "Fresh Juice");
        addMenuIfNotExists("Mixed Fruit Juice", "Blend of seasonal fruits", "400.00", "Fresh Juice");
        addMenuIfNotExists("Wood Apple Juice", "Traditional wood apple juice", "350.00", "Fresh Juice");
        addMenuIfNotExists("Passion Fruit Juice", "Fresh passion fruit juice", "400.00", "Fresh Juice");
        addMenuIfNotExists("Watermelon Juice", "Fresh watermelon juice", "350.00", "Fresh Juice");
        addMenuIfNotExists("Pineapple Juice", "Fresh pineapple juice", "350.00", "Fresh Juice");
        addMenuIfNotExists("Papaya Juice", "Fresh papaya juice", "400.00", "Fresh Juice");
        addMenuIfNotExists("Mango Juice", "Fresh mango juice", "400.00", "Fresh Juice");
        addMenuIfNotExists("Fruit Salad", "Fresh fruit salad with ice cream", "450.00", "Desserts");
        addMenuIfNotExists("Watalappan", "Traditional Sri Lankan coconut custard", "350.00", "Desserts");
        addMenuIfNotExists("Chicken Tikka Masala", "Chicken Tikka Masala", "1350.00", "Main Course");
    }

    private void addMenuIfNotExists(String name, String description, String price, String category) {
        if (menuRepository.findByName(name).isEmpty()) {
            Menu menu = new Menu();
            menu.setName(name);
            menu.setDescription(description);
            menu.setPrice(new BigDecimal(price));
            menu.setCategory(category);
            menu.setIsAvailable(true);
            menuRepository.save(menu);
        }
    }
}

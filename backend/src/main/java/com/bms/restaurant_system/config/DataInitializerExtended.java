package com.bms.restaurant_system.config;

import com.bms.restaurant_system.entity.Menu;
import com.bms.restaurant_system.repository.MenuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;

import java.math.BigDecimal;
import java.util.List;

// @Component
@Profile("!test")
public class DataInitializerExtended implements CommandLineRunner {

    @Autowired
    private MenuRepository menuRepository;

    @Override
    public void run(String... args) throws Exception {
        addMenuIfNotExists("Chicken Kottu", "Traditional Sri Lankan chopped roti with chicken", "Kottu", "Chicken Kottu.avif", 450.00);
        addMenuIfNotExists("Cheese Chicken Kottu", "Chicken kottu with melted cheese", "Kottu", "Cheese Chicken Kottu.jpg", 550.00);
        addMenuIfNotExists("Fish Kottu", "Traditional kottu with fresh fish", "Kottu", "Fish Kottu.jpg", 500.00);
        addMenuIfNotExists("Vegetarian Kottu", "Vegetarian version of traditional kottu", "Kottu", "Veg Kottu.jpeg", 350.00);

        addMenuIfNotExists("Rice and Curry", "Traditional Sri Lankan rice and curry", "Rice", "RicenCurry.jpg", 400.00);
        addMenuIfNotExists("Fried Rice", "Vegetable fried rice with eggs", "Rice", "Fried Rice.jpg", 350.00);
        addMenuIfNotExists("Nasi Goreng", "Indonesian fried rice with spices", "Rice", "Nasi Goreng.jpg", 450.00);
        addMenuIfNotExists("Biryani", "Aromatic rice dish with meat and spices", "Rice", "Biryani.jpg", 600.00);
        addMenuIfNotExists("Lamprais", "Dutch Burgher rice dish with meat and fish", "Rice", "Lumprais.jpg", 550.00);

        addMenuIfNotExists("Fried Noodles", "Stir-fried noodles with vegetables", "Noodles", "noodles.jpeg", 350.00);

        addMenuIfNotExists("Cheese Chicken Burger", "Chicken burger with cheese", "Burgers", "Cheese Chicken Burger.jpg", 930.00);
        addMenuIfNotExists("Crispy Chicken Burger", "Crispy chicken patty burger", "Burgers", "Crispy Chicken Burger.jpg", 860.00);
        addMenuIfNotExists("Double Chicken Cheese Burger", "Double chicken patties with cheese", "Burgers", "Double Chicken cheese burger.jpg", 1220.00);

        addMenuIfNotExists("Crispy Chicken Submarine", "Crispy chicken submarine sandwich", "Submarines", "Crispy Submarine.jpeg", 1220.00);
        addMenuIfNotExists("Cheese Chicken Submarine", "Chicken submarine with cheese", "Submarines", "CheeseChicken Sub.jpg", 1360.00);

        addMenuIfNotExists("Roast Chicken", "Traditional roast chicken", "Bites", "2.jpg", 800.00);
        addMenuIfNotExists("Chicken Drumsticks", "Crispy chicken drumsticks", "Bites", "2.jpg", 600.00);
        addMenuIfNotExists("Hot Butter Mushroom", "Mushrooms in hot butter sauce", "Bites", "2.jpg", 930.00);
        addMenuIfNotExists("French Fries", "Golden crispy french fries", "Bites", "2.jpg", 1250.00);
        addMenuIfNotExists("Egg (Bulls eye)", "Fried egg with runny yolk", "Bites", "2.jpg", 200.00);
        addMenuIfNotExists("Egg Omelette", "Classic egg omelette", "Bites", "2.jpg", 800.00);
        addMenuIfNotExists("Devilled Chicken", "Spicy devilled chicken", "Bites", "2.jpg", 1400.00);
        addMenuIfNotExists("Devilled Fish", "Spicy devilled fish", "Bites", "2.jpg", 1850.00);
        addMenuIfNotExists("Devilled Pork", "Spicy devilled pork", "Bites", "2.jpg", 1725.00);
        addMenuIfNotExists("Devilled Prawns", "Spicy devilled prawns", "Bites", "2.jpg", 2000.00);
        addMenuIfNotExists("Crispy Chicken", "Crispy fried chicken pieces", "Bites", "2.jpg", 950.00);

        addMenuIfNotExists("Avocado Juice", "Fresh avocado juice", "Fresh Juice", "AvocadoJuice.jpg", 400.00);
        addMenuIfNotExists("Mixed Fruit Juice", "Blend of seasonal fruits", "Fresh Juice", "MixedFruitJuice.jpg", 500.00);
        addMenuIfNotExists("Wood Apple Juice", "Traditional wood apple juice", "Fresh Juice", "Woodapple.jpg", 400.00);
        addMenuIfNotExists("Passion Fruit Juice", "Fresh passion fruit juice", "Fresh Juice", "PassionFruit.jpg", 500.00);
        addMenuIfNotExists("Watermelon Juice", "Fresh watermelon juice", "Fresh Juice", "watermelon.jpg", 400.00);
        addMenuIfNotExists("Pineapple Juice", "Fresh pineapple juice", "Fresh Juice", "Pineapple.jpeg", 400.00);
        addMenuIfNotExists("Papaya Juice", "Fresh papaya juice", "Fresh Juice", "Papaya.jpg", 500.00);
        addMenuIfNotExists("Mango Juice", "Fresh mango juice", "Fresh Juice", "Mango.jpg", 400.00);

        addMenuIfNotExists("Fruit Salad", "Fresh fruit salad with ice cream", "Desserts", "Fruit Salad.jpeg", 475.00);
        addMenuIfNotExists("Watalappan", "Traditional Sri Lankan coconut custard", "Desserts", "watalappan.jpg", 350.00);

        // Update all menu prices to realistic LKR values for Sri Lankan restaurant
        updatePriceIfExists("Margherita Pizza", 2500.00);
        updatePriceIfExists("Caesar Salad", 800.00);
        updatePriceIfExists("Grilled Chicken Burger", 900.00);
        updatePriceIfExists("Chocolate Brownie", 400.00);
        updatePriceIfExists("Spaghetti Carbonara", 1200.00);
        updatePriceIfExists("Chicken Kottu", 700.00);
        updatePriceIfExists("Cheese Chicken Kottu", 850.00);
        updatePriceIfExists("Fish Kottu", 900.00);
        updatePriceIfExists("Vegetarian Kottu", 500.00);
        updatePriceIfExists("Rice and Curry", 550.00);
        updatePriceIfExists("Fried Rice", 450.00);
        updatePriceIfExists("Nasi Goreng", 550.00);
        updatePriceIfExists("Biryani", 750.00);
        updatePriceIfExists("Lamprais", 650.00);
        updatePriceIfExists("Fried Noodles", 450.00);
        updatePriceIfExists("Cheese Chicken Burger", 850.00);
        updatePriceIfExists("Crispy Chicken Burger", 800.00);
        updatePriceIfExists("Double Chicken Cheese Burger", 1300.00);
        updatePriceIfExists("Crispy Chicken Submarine", 1100.00);
        updatePriceIfExists("Cheese Chicken Submarine", 1200.00);
        updatePriceIfExists("Roast Chicken", 950.00);
        updatePriceIfExists("Chicken Drumsticks", 550.00);
        updatePriceIfExists("Hot Butter Mushroom", 650.00);
        updatePriceIfExists("French Fries", 350.00);
        updatePriceIfExists("Egg (Bulls eye)", 100.00);
        updatePriceIfExists("Egg Omelette", 250.00);
        updatePriceIfExists("Devilled Chicken", 850.00);
        updatePriceIfExists("Devilled Fish", 1100.00);
        updatePriceIfExists("Devilled Pork", 950.00);
        updatePriceIfExists("Devilled Prawns", 1300.00);
        updatePriceIfExists("Crispy Chicken", 750.00);
        updatePriceIfExists("Avocado Juice", 450.00);
        updatePriceIfExists("Mixed Fruit Juice", 400.00);
        updatePriceIfExists("Wood Apple Juice", 350.00);
        updatePriceIfExists("Passion Fruit Juice", 400.00);
        updatePriceIfExists("Watermelon Juice", 350.00);
        updatePriceIfExists("Pineapple Juice", 350.00);
        updatePriceIfExists("Papaya Juice", 400.00);
        updatePriceIfExists("Mango Juice", 400.00);
        updatePriceIfExists("Fruit Salad", 450.00);
        updatePriceIfExists("Watalappan", 350.00);
    }

    private void addMenuIfNotExists(String name, String description, String category, String imageName, double price) {
        if (menuRepository.findByName(name).isEmpty()) {
            Menu menu = new Menu();
            menu.setName(name);
            menu.setDescription(description);
            menu.setCategory(category);
            menu.setPrice(BigDecimal.valueOf(price));
            menu.setIsAvailable(true);
            // Image name can be stored or used as needed in frontend
            menuRepository.save(menu);
        }
    }

    private void updatePriceIfExists(String name, double newPrice) {
        List<Menu> items = menuRepository.findByName(name);
        if (!items.isEmpty()) {
            Menu item = items.get(0); // Update first occurrence
            item.setPrice(BigDecimal.valueOf(newPrice));
            menuRepository.save(item);
        }
    }
}

// Mock data generation has been removed as per requirements.
// This file is kept as a placeholder to prevent import errors.

/**
 * This function is intentionally empty and returns an empty array.
 * Mock data generation has been disabled as per requirements.
 * @returns {Array} Empty array
 */
export function generateMockOrdersForSpecificUser() {
  console.warn('Mock data generation has been removed as per requirements.');
  return [];
}

// Commented out legacy mock data code
/*
export function _generateMockOrdersForSpecificUser_Legacy(userId, count = 3) {
  const orders = [];
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  orders.push({
    id: `ORD-${10000 + Math.floor(Math.random() * 1000)}`,
    userId: String(userId),
    orderDate: today.toISOString(),
    status: 'pending',
    items: [
      { id: 1, name: 'Chicken Burger', price: 900.00, quantity: 2, image: '/images/food/burger.jpg' },
      { id: 2, name: 'French Fries', price: 350.00, quantity: 1, image: '/images/food/fries.jpg' }
    ],
    subtotal: 2150.00,
    tax: 215.00,
    deliveryFee: 200.00,
    total: 2565.00,
    paymentMethod: 'credit_card',
    deliveryAddress: defaultAddress,
    customerName: customerName,
    customerPhone: phone
  });
  
  // Yesterday's delivered order
  orders.push({
    id: `ORD-${10000 + Math.floor(Math.random() * 1000)}`,
    userId: String(userId),
    orderDate: yesterday.toISOString(),
    status: 'delivered',
    items: [
      { id: 3, name: 'Vegetable Pizza', price: 1400.00, quantity: 1, image: '/images/food/pizza.jpg' },
      { id: 4, name: 'Garlic Bread', price: 450.00, quantity: 1, image: '/images/food/garlic-bread.jpg' },
      { id: 5, name: 'Coca Cola', price: 200.00, quantity: 2, image: '/images/food/coke.jpg' }
    ],
    subtotal: 2250.00,
    tax: 225.00,
    deliveryFee: 200.00,
    total: 2675.00,
    paymentMethod: 'bank_transfer',
    deliveryAddress: defaultAddress,
    customerName: customerName,
    customerPhone: phone
  });
  
  // For admins or randomly add additional order types
  if (isAdmin || Math.random() > 0.5) {
    // Add ready for pickup order
    orders.push({
      id: `ORD-${10000 + Math.floor(Math.random() * 1000)}`,
      userId: String(userId),
      orderDate: twoDaysAgo.toISOString(),
      status: 'ready',
      items: [
        { id: 11, name: 'Butter Chicken', price: 1500.00, quantity: 1, image: '/images/food/butter-chicken.jpg' },
        { id: 12, name: 'Plain Naan', price: 300.00, quantity: 2, image: '/images/food/plain-naan.jpg' }
      ],
      subtotal: 2100.00,
      tax: 210.00,
      deliveryFee: 0, // Pickup order
      total: 2310.00,
      paymentMethod: 'cash',
      deliveryAddress: null, // Pickup order has no delivery address
      customerName: customerName,
      customerPhone: phone,
      isPickup: true
    });
  }
  
  // Always add cancelled order 
  orders.push({
    id: `ORD-${10000 + Math.floor(Math.random() * 1000)}`,
    userId: String(userId),
    orderDate: lastWeek.toISOString(),
    status: 'cancelled',
    items: [
      { id: 6, name: 'Sushi Platter', price: 2500.00, quantity: 1, image: '/images/food/sushi.jpg' }
    ],
    subtotal: 2500.00,
    tax: 250.00,
    deliveryFee: 200.00,
    total: 2950.00,
    paymentMethod: 'cash',
    deliveryAddress: defaultAddress,
    customerName: customerName,
    customerPhone: phone
  });

  // For admins, add more order variety
  if (isAdmin) {
      // Add out for delivery order
      orders.push({
        id: `ORD-${10000 + Math.floor(Math.random() * 1000)}`,
        userId: String(userId),
        orderDate: today.toISOString(),
        status: 'out_for_delivery',
        items: [
          { id: 13, name: 'Seafood Rice', price: 1800.00, quantity: 1, image: '/images/food/seafood-rice.jpg' },
          { id: 14, name: 'Hot & Sour Soup', price: 600.00, quantity: 1, image: '/images/food/hot-sour-soup.jpg' }
        ],
        subtotal: 2400.00,
        tax: 240.00,
        deliveryFee: 200.00,
        total: 2840.00,
        paymentMethod: 'credit_card',
        deliveryAddress: defaultAddress,
        customerName: customerName,
        customerPhone: phone
      });    // Add preparing order
    orders.push({
      id: `ORD-${10000 + Math.floor(Math.random() * 1000)}`,
      userId: String(userId),
      orderDate: today.toISOString(),
      status: 'preparing',
      items: [
        { id: 8, name: 'Chicken Biryani', price: 750.00, quantity: 2, image: '/images/food/biryani.jpg' },
        { id: 9, name: 'Raita', price: 300.00, quantity: 1, image: '/images/food/raita.jpg' },
        { id: 10, name: 'Mango Lassi', price: 400.00, quantity: 2, image: '/images/food/lassi.jpg' }
      ],
      subtotal: 2600.00,
      tax: 260.00,
      deliveryFee: 200.00,
      total: 3060.00,
      paymentMethod: 'cash',
      deliveryAddress: defaultAddress,
      customerName: customerName,
      customerPhone: phone
    });
  }
  return orders;
}
*/

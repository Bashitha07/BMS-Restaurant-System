// Restaurant System Frontend JavaScript

const API_BASE_URL = 'http://localhost:8082/api';
let currentUser = null;
let cart = [];
let menus = []; // Global variable to store menu data

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadMenus();
    setupEventListeners();
});

// Setup all event listeners
function setupEventListeners() {
    // Login form
    document.getElementById('loginForm').addEventListener('submit', handleLogin);

    // Register form
    document.getElementById('registerForm').addEventListener('submit', handleRegister);

    // Add menu form
    document.getElementById('addMenuForm').addEventListener('submit', handleAddMenu);

    // New reservation form
    document.getElementById('newReservationForm').addEventListener('submit', bookReservation);
}

// Show/hide sections
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });

    // Show selected section
    document.getElementById(`${sectionName}-section`).style.display = 'block';

    // Load section data
    if (sectionName === 'orders' && currentUser) {
        loadOrders();
    } else if (sectionName === 'reservations' && currentUser) {
        loadReservations();
    } else if (sectionName === 'cart') {
        displayCart();
    }
}

// Show modals
function showLoginModal() {
    const modal = new bootstrap.Modal(document.getElementById('loginModal'));
    modal.show();
}

function showRegisterModal() {
    const modal = new bootstrap.Modal(document.getElementById('registerModal'));
    modal.show();
}

function showAddMenuModal() {
    if (!currentUser || currentUser.role !== 'ADMIN') {
        alert('Only administrators can add menu items!');
        return;
    }
    const modal = new bootstrap.Modal(document.getElementById('addMenuModal'));
    modal.show();
}

function showNewReservationModal() {
    if (!currentUser) {
        alert('Please login to make a reservation');
        showLoginModal();
        return;
    }
    const modal = new bootstrap.Modal(document.getElementById('newReservationModal'));
    modal.show();
}

// API Functions
async function apiCall(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    };

    if (currentUser && currentUser.token) {
        config.headers['Authorization'] = `Bearer ${currentUser.token}`;
    }

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'API call failed');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Authentication functions
async function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            currentUser = data;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            updateUIForLoggedInUser();
            bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
            showSection('menus');
        } else {
            alert(data.message || 'Login failed');
        }
    } catch (error) {
        alert('Login failed: ' + error.message);
    }
}

async function handleRegister(e) {
    e.preventDefault();

    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const phone = document.getElementById('regPhone').value;
    const password = document.getElementById('regPassword').value;

    try {
        const response = await fetch(`${API_BASE_URL}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, phone, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Registration successful! Please login.');
            bootstrap.Modal.getInstance(document.getElementById('registerModal')).hide();
            showLoginModal();
        } else {
            alert(data.message || 'Registration failed');
        }
    } catch (error) {
        alert('Registration failed: ' + error.message);
    }
}

// Menu functions
async function loadMenus() {
    try {
        showLoading('menuGrid');
        menus = await apiCall('/menus/available');
        displayMenus(menus);
    } catch (error) {
        document.getElementById('menuGrid').innerHTML =
            '<div class="col-12"><div class="alert alert-danger">Failed to load menus: ' + error.message + '</div></div>';
    }
}

function displayMenus(menus) {
    const menuGrid = document.getElementById('menuGrid');

    if (menus.length === 0) {
        menuGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-utensils"></i>
                <h3>No menu items available</h3>
                <p>Check back later for delicious options!</p>
            </div>
        `;
        return;
    }

    menuGrid.innerHTML = menus.map(menu => `
        <div class="menu-item ${getCategoryClass(menu.category)}" data-category="${menu.category.toLowerCase()}">
            <div class="position-relative">
                <div class="menu-image d-flex align-items-center justify-content-center">
                    <span class="text-white fs-4">${menu.name.charAt(0)}</span>
                </div>
                <div class="category-badge">${menu.category}</div>
                <div class="availability-badge ${menu.isAvailable ? 'available' : 'unavailable'}">
                    ${menu.isAvailable ? 'Available' : 'Out of Stock'}
                </div>
            </div>
            <h3>${menu.name}</h3>
            <p>Rs. ${menu.price}</p>
            ${menu.isAvailable ? `
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateCart(${menu.id}, -1)">-</button>
                    <span id="qty-${menu.id}">0</span>
                    <button class="quantity-btn" onclick="updateCart(${menu.id}, 1)">+</button>
                </div>
                <button class="btn-add-to-cart" onclick="addToCart(${menu.id})">
                    Add to Cart
                </button>
            ` : ''}
        </div>
    `).join('');
}

// Helper function to map categories to CSS classes
function getCategoryClass(category) {
    const categoryMap = {
        'Kottu': 'kottu',
        'Rice': 'rice',
        'Noodles': 'noodles',
        'Burgers': 'burgers',
        'Submarines': 'submarines',
        'Bites': 'bites',
        'Fresh Juice': 'juice',
        'Desserts': 'desserts'
    };
    return categoryMap[category] || '';
}

// New filter function for button-based filtering
function filterMenu(category) {
    const items = document.querySelectorAll('.menu-item');
    const buttons = document.querySelectorAll('.filter-btn');

    // Remove active class from all buttons
    buttons.forEach(btn => btn.classList.remove('active'));
    // Add active class to the clicked button
    event.target.classList.add('active');

    // Show/hide items
    items.forEach(item => {
        if (category === 'all') {
            item.classList.remove('hidden');
        } else {
            item.classList.add('hidden');
            if (item.classList.contains(category)) {
                item.classList.remove('hidden');
            }
        }
    });
}

async function handleAddMenu(e) {
    e.preventDefault();

    const menuData = {
        name: document.getElementById('menuName').value,
        description: document.getElementById('menuDescription').value,
        price: parseFloat(document.getElementById('menuPrice').value),
        category: document.getElementById('menuCategory').value,
        isAvailable: document.getElementById('menuAvailable').checked
    };

    try {
        await apiCall('/menus', {
            method: 'POST',
            body: JSON.stringify(menuData)
        });

        alert('Menu item added successfully!');
        bootstrap.Modal.getInstance(document.getElementById('addMenuModal')).hide();
        loadMenus();
    } catch (error) {
        alert('Failed to add menu item: ' + error.message);
    }
}

// Cart functions
function updateCart(menuId, change) {
    const qtyElement = document.getElementById(`qty-${menuId}`);
    let currentQty = parseInt(qtyElement.textContent);
    currentQty += change;

    if (currentQty < 0) currentQty = 0;
    qtyElement.textContent = currentQty;
}

function addToCart(menuId) {
    const qtyElement = document.getElementById(`qty-${menuId}`);
    const quantity = parseInt(qtyElement.textContent);

    if (quantity === 0) {
        alert('Please select at least one item');
        return;
    }

    // Find the menu item
    const menuItem = menus.find(menu => menu.id === menuId);
    if (!menuItem) {
        alert('Menu item not found');
        return;
    }

    // Add to cart
    const existingItem = cart.find(item => item.menuId === menuId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            menuId: menuId,
            name: menuItem.name,
            price: menuItem.price,
            quantity: quantity
        });
    }

    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Update cart count in navbar
    updateCartCount();

    // Reset quantity
    qtyElement.textContent = '0';

    alert(`Added ${quantity} ${menuItem.name}(s) to cart!`);
}

function updateCartCount() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartLink = document.querySelector('a[href="#"][onclick*="showSection(\'cart\')"]');
    if (cartLink) {
        cartLink.innerHTML = `Cart ${cartCount > 0 ? `(${cartCount})` : ''}`;
    }
}

function displayCart() {
    const cartItems = document.getElementById('cartItems');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartTax = document.getElementById('cartTax');
    const cartTotal = document.getElementById('cartTotal');

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-shopping-cart"></i>
                <h3>Your cart is empty</h3>
                <p>Add some delicious items from our menu!</p>
            </div>
        `;
        cartSubtotal.textContent = '$0.00';
        cartTax.textContent = '$0.00';
        cartTotal.textContent = '$0.00';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="card mb-3">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="card-title">${item.name}</h6>
                        <p class="card-text mb-1">$${item.price} each</p>
                    </div>
                    <div class="d-flex align-items-center">
                        <button class="btn btn-sm btn-outline-secondary me-2" onclick="updateCartItem(${item.menuId}, -1)">-</button>
                        <span class="mx-2">${item.quantity}</span>
                        <button class="btn btn-sm btn-outline-secondary me-2" onclick="updateCartItem(${item.menuId}, 1)">+</button>
                        <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart(${item.menuId})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="text-end">
                    <strong>$${(item.price * item.quantity).toFixed(2)}</strong>
                </div>
            </div>
        </div>
    `).join('');

    // Calculate totals
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    cartTax.textContent = `$${tax.toFixed(2)}`;
    cartTotal.textContent = `$${total.toFixed(2)}`;
}

function updateCartItem(menuId, change) {
    const item = cart.find(item => item.menuId === menuId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(menuId);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            displayCart();
        }
    }
}

function removeFromCart(menuId) {
    cart = cart.filter(item => item.menuId !== menuId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCart();
}

async function checkoutOrder() {
    if (!currentUser) {
        alert('Please login to place an order');
        showLoginModal();
        return;
    }

    if (cart.length === 0) {
        alert('Your cart is empty');
        return;
    }

    try {
        const orderData = {
            userId: currentUser.id,
            items: cart.map(item => ({
                menuId: item.menuId,
                quantity: item.quantity
            }))
        };

        await apiCall('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });

        alert('Order placed successfully!');
        clearCart();
        showSection('orders');
    } catch (error) {
        alert('Failed to place order: ' + error.message);
    }
}

function clearCart() {
    cart = [];
    localStorage.removeItem('cart');
    updateCartCount();
    displayCart();
}

// Order functions
async function loadOrders() {
    try {
        showLoading('ordersList');
        const orders = await apiCall('/orders');
        displayOrders(orders);
    } catch (error) {
        document.getElementById('ordersList').innerHTML =
            '<div class="alert alert-danger">Failed to load orders: ' + error.message + '</div>';
    }
}

function displayOrders(orders) {
    const ordersList = document.getElementById('ordersList');

    if (orders.length === 0) {
        ordersList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-shopping-bag"></i>
                <h3>No orders yet</h3>
                <p>Browse our menu and place your first order!</p>
            </div>
        `;
        return;
    }

    ordersList.innerHTML = orders.map(order => `
        <div class="card order-card">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h5>Order #${order.id}</h5>
                        <p class="text-muted">${new Date(order.orderDate).toLocaleString()}</p>
                    </div>
                    <span class="badge bg-primary">${order.status}</span>
                </div>
                <div class="mt-3">
                    <strong>Total: $${order.totalAmount}</strong>
                </div>
            </div>
        </div>
    `).join('');
}

// Reservation functions
async function loadReservations() {
    try {
        showLoading('reservationsList');
        const reservations = await apiCall('/reservations');
        displayReservations(reservations);
    } catch (error) {
        document.getElementById('reservationsList').innerHTML =
            '<div class="alert alert-danger">Failed to load reservations: ' + error.message + '</div>';
    }
}

function displayReservations(reservations) {
    const reservationsList = document.getElementById('reservationsList');

    if (reservations.length === 0) {
        reservationsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-calendar-alt"></i>
                <h3>No reservations yet</h3>
                <p>Book a table for your next visit!</p>
            </div>
        `;
        return;
    }

    reservationsList.innerHTML = reservations.map(reservation => `
        <div class="card reservation-card">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h5>Table for ${reservation.numberOfPeople}</h5>
                        <p class="text-muted">${new Date(reservation.reservationDateTime).toLocaleString()}</p>
                    </div>
                    <span class="badge bg-success">${reservation.status}</span>
                </div>
            </div>
        </div>
    `).join('');
}

async function checkAvailability() {
    const date = document.getElementById('resDate').value;
    const time = document.getElementById('resTime').value;
    const guests = document.getElementById('resGuests').value;

    if (!date || !time || !guests) {
        alert('Please select date, time, and number of guests');
        return;
    }

    try {
        // Example API call to check availability - adjust endpoint as needed
        const response = await apiCall(`/reservations/check?date=${date}&time=${time}&guests=${guests}`);
        if (response.available) {
            alert('Table is available for the selected time');
            document.getElementById('bookBtn').style.display = 'inline-block';
        } else {
            alert('No availability for the selected time');
            document.getElementById('bookBtn').style.display = 'none';
        }
    } catch (error) {
        alert('Failed to check availability: ' + error.message);
    }
}

async function bookReservation(e) {
    if (e) e.preventDefault();

    const date = document.getElementById('resDate').value;
    const time = document.getElementById('resTime').value;
    const guests = parseInt(document.getElementById('resGuests').value);

    if (!date || !time || !guests) {
        alert('Please fill all reservation details');
        return;
    }

    if (!currentUser) {
        alert('Please login to make a reservation');
        showLoginModal();
        return;
    }

    const reservationDateTime = new Date(`${date}T${time}:00`);

    const reservationData = {
        userId: currentUser.id,
        reservationDateTime: reservationDateTime.toISOString(),
        numberOfPeople: guests
    };

    try {
        await apiCall('/reservations', {
            method: 'POST',
            body: JSON.stringify(reservationData)
        });

        alert('Reservation booked successfully!');
        bootstrap.Modal.getInstance(document.getElementById('newReservationModal')).hide();
        loadReservations();
    } catch (error) {
        alert('Failed to book reservation: ' + error.message);
    }
}

// UI Helper functions
function showLoading(elementId) {
    document.getElementById(elementId).innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
        </div>
    `;
}

function updateUIForLoggedInUser() {
    const userDropdown = document.getElementById('userDropdown');
    if (currentUser) {
        userDropdown.innerHTML = `
            <span class="navbar-text me-2">Welcome, ${currentUser.username}!</span>
            <button class="btn btn-outline-light btn-sm" onclick="logout()">Logout</button>
        `;
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    location.reload();
}

// Check for existing user session and cart
const savedUser = localStorage.getItem('currentUser');
if (savedUser) {
    currentUser = JSON.parse(savedUser);
    updateUIForLoggedInUser();
}

const savedCart = localStorage.getItem('cart');
if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCartCount();
}

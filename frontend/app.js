// Restaurant System Frontend JavaScript

const API_BASE_URL = 'http://localhost:8083/api';
let currentUser = null;
let cart = [];
let menus = []; // Global variable to store menu data
let availabilityChecked = false; // Track if availability has been checked

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

    // Checkout form
    document.getElementById('checkoutForm').addEventListener('submit', handleCheckout);

    // New reservation form
    document.getElementById('newReservationForm').addEventListener('submit', bookReservation);

    // Payment method change
    document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
        radio.addEventListener('change', toggleDepositSlipUpload);
    });
}

// Show/hide sections
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    document.getElementById(`${sectionName}-section`).classList.add('active');

    // Load section data
    if (sectionName === 'orders' && currentUser) {
        loadOrders();
    } else if (sectionName === 'reservations' && currentUser) {
        loadReservations();
    } else if (sectionName === 'users' && currentUser && currentUser.role === 'ADMIN') {
        loadUsers();
    } else if (sectionName === 'menus') {
        // Always load menus when showing menu section
        loadMenus();
    }
}

// Toggle cart sidebar
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    cartSidebar.classList.toggle('open');
    if (cartSidebar.classList.contains('open')) {
        displayCart();
    }
}

// Search food function
function searchFood() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredMenus = menus.filter(menu =>
        menu.name.toLowerCase().includes(searchTerm) ||
        menu.category.toLowerCase().includes(searchTerm)
    );
    displayMenus(filteredMenus);
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

    menuGrid.innerHTML = menus.map(menu => {
        const image = getMenuImage(menu.name);
        return `
        <div class="menu-item ${getCategoryClass(menu.category)}" data-category="${menu.category.toLowerCase()}">
            <img src="${image.src}" alt="${menu.name}" class="menu-image" onerror="this.src='${image.fallback}'">
            <div class="menu-content">
                <div class="menu-header">
                    <h3 class="menu-title">${menu.name}</h3>
                    <div class="menu-rating">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <span>(4.8)</span>
                    </div>
                </div>
                <p class="menu-description">${menu.description || 'Delicious ' + menu.category.toLowerCase() + ' dish made with fresh ingredients.'}</p>
                <div class="menu-footer">
                    <div class="menu-price">Rs. ${menu.price}</div>
                    ${menu.isAvailable ? `
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="updateCart(${menu.id}, -1)">-</button>
                            <span id="qty-${menu.id}">0</span>
                            <button class="quantity-btn" onclick="updateCart(${menu.id}, 1)">+</button>
                        </div>
                        <button class="add-to-cart-btn" onclick="addToCart(${menu.id})">
                            <i class="fas fa-plus"></i> Add to Cart
                        </button>
                    ` : '<div class="out-of-stock">Out of Stock</div>'}
                </div>
            </div>
        </div>
        `;
    }).join('');
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

function getMenuImage(menuName) {
    // Try local images first, fallback to Unsplash if local fails
    const imageName = menuName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') + '.jpg';
    const localImage = `./images/${imageName}`;
    const fallbackImage = `https://source.unsplash.com/400x300/?${encodeURIComponent(menuName.toLowerCase())}`;
    
    return {
        src: localImage,
        fallback: fallbackImage
    };
}

// New filter function for button-based filtering
function filterMenu(category, button) {
    const items = document.querySelectorAll('.menu-item');
    const buttons = document.querySelectorAll('.category-item');

    // Remove active class from all buttons
    buttons.forEach(btn => btn.classList.remove('active'));
    // Add active class to the clicked button
    button.classList.add('active');

    // Show/hide items
    items.forEach(item => {
        if (category === 'all') {
            item.style.display = 'block';
        } else {
            const itemCategory = item.getAttribute('data-category');
            if (itemCategory === category.toLowerCase()) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
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
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }
}

function displayCart() {
    const cartItems = document.getElementById('cartItems');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartTax = document.getElementById('cartTax');
    const cartTotal = document.getElementById('cartTotal');

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
            </div>
        `;
        if (cartSubtotal) cartSubtotal.textContent = 'Rs. 0.00';
        if (cartTax) cartTax.textContent = 'Rs. 0.00';
        if (cartTotal) cartTotal.textContent = 'Rs. 0.00';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>Rs. ${item.price} each</p>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn" onclick="updateCartItem(${item.menuId}, -1)">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateCartItem(${item.menuId}, 1)">+</button>
                <button class="remove-btn" onclick="removeFromCart(${item.menuId})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="cart-item-total">Rs. ${(item.price * item.quantity).toFixed(2)}</div>
        </div>
    `).join('');

    // Calculate totals
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    if (cartSubtotal) cartSubtotal.textContent = `Rs. ${subtotal.toFixed(2)}`;
    if (cartTax) cartTax.textContent = `Rs. ${tax.toFixed(2)}`;
    if (cartTotal) cartTotal.textContent = `Rs. ${total.toFixed(2)}`;
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

    showCheckoutModal();
}

function showCheckoutModal() {
    // Populate checkout summary
    const checkoutSummary = document.getElementById('checkoutSummary');
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    checkoutSummary.innerHTML = `
        <div class="mb-2">
            <strong>Items:</strong>
            ${cart.map(item => `<div>${item.name} x${item.quantity} - Rs. ${(item.price * item.quantity).toFixed(2)}</div>`).join('')}
        </div>
        <div class="mb-2"><strong>Subtotal:</strong> Rs. ${subtotal.toFixed(2)}</div>
        <div class="mb-2"><strong>Tax (10%):</strong> Rs. ${tax.toFixed(2)}</div>
        <div class="mb-2"><strong>Total:</strong> Rs. ${total.toFixed(2)}</div>
    `;

    const modal = new bootstrap.Modal(document.getElementById('checkoutModal'));
    modal.show();
}

function toggleDepositSlipUpload() {
    const depositSlipRadio = document.getElementById('depositSlip');
    const depositSlipUpload = document.getElementById('depositSlipUpload');

    if (depositSlipRadio.checked) {
        depositSlipUpload.style.display = 'block';
    } else {
        depositSlipUpload.style.display = 'none';
    }
}

async function handleCheckout(e) {
    e.preventDefault();

    const deliveryStreet = document.getElementById('deliveryStreet').value;
    const deliveryCity = document.getElementById('deliveryCity').value;
    const deliveryPhone = document.getElementById('deliveryPhone').value;
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    const slipImage = document.getElementById('slipImage').files[0];

    if (!deliveryStreet || !deliveryCity || !deliveryPhone) {
        alert('Please fill in all delivery address fields');
        return;
    }

    if (paymentMethod === 'DEPOSIT_SLIP' && !slipImage) {
        alert('Please upload a deposit slip image');
        return;
    }

    try {
        let paymentData = null;

        if (paymentMethod === 'DEPOSIT_SLIP') {
            // Convert image to base64
            const base64Image = await convertImageToBase64(slipImage);
            paymentData = {
                method: paymentMethod,
                slipImage: base64Image
            };
        } else {
            paymentData = {
                method: paymentMethod
            };
        }

        const orderData = {
            userId: currentUser.id,
            deliveryAddress: {
                street: deliveryStreet,
                city: deliveryCity,
                phone: deliveryPhone
            },
            payment: paymentData,
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
        bootstrap.Modal.getInstance(document.getElementById('checkoutModal')).hide();
        clearCart();
        showSection('orders');
    } catch (error) {
        alert('Failed to place order: ' + error.message);
    }
}

function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function clearCart() {
    cart = [];
    localStorage.removeItem('cart');
    updateCartCount();
    displayCart();
}

async function downloadInvoice(orderId) {
    try {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}/invoice`, {
            headers: {
                'Authorization': `Bearer ${currentUser.token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to download invoice');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${orderId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } catch (error) {
        alert('Failed to download invoice: ' + error.message);
    }
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
                        <p class="text-muted">Payment: ${order.payment?.method || 'N/A'} - ${order.payment?.status || 'Pending'}</p>
                    </div>
                    <div class="text-end">
                        <span class="badge bg-primary">${order.status}</span>
                        <br>
                        <button class="btn btn-sm btn-outline-primary mt-2" onclick="downloadInvoice(${order.id})">
                            <i class="fas fa-download"></i> Invoice
                        </button>
                    </div>
                </div>
                <div class="mt-3">
                    <strong>Total: Rs. ${order.totalAmount}</strong>
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
        // Get available slots for the selected date
        const availableSlots = await apiCall(`/reservations/available-slots?date=${date}`);

        // Check if the selected time is available
        const selectedTime = time + ':00'; // Add seconds to match format
        if (availableSlots.includes(selectedTime)) {
            alert('Table is available for the selected time');
            document.getElementById('bookBtn').style.display = 'inline-block';
            availabilityChecked = true;
        } else {
            alert('No availability for the selected time. Available slots: ' + availableSlots.join(', '));
            document.getElementById('bookBtn').style.display = 'none';
            availabilityChecked = false;
        }
    } catch (error) {
        alert('Failed to check availability: ' + error.message);
        availabilityChecked = false;
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

    if (!availabilityChecked) {
        alert('Please check availability before booking a reservation');
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

// User management functions
async function loadUsers() {
    try {
        showLoading('usersList');
        const users = await apiCall('/admin/users');
        displayUsers(users);
    } catch (error) {
        document.getElementById('usersList').innerHTML =
            '<div class="alert alert-danger">Failed to load users: ' + error.message + '</div>';
    }
}

function displayUsers(users) {
    const usersList = document.getElementById('usersList');

    if (users.length === 0) {
        usersList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-users"></i>
                <h3>No users found</h3>
                <p>No users are registered in the system yet.</p>
            </div>
        `;
        return;
    }

    usersList.innerHTML = `
        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Role</th>
                        <th>Created Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${users.map(user => `
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.username}</td>
                            <td>${user.email || 'N/A'}</td>
                            <td>${user.phone || 'N/A'}</td>
                            <td>
                                <select class="form-select form-select-sm" onchange="updateUserRole(${user.id}, this.value)">
                                    <option value="USER" ${user.role === 'USER' ? 'selected' : ''}>USER</option>
                                    <option value="ADMIN" ${user.role === 'ADMIN' ? 'selected' : ''}>ADMIN</option>
                                </select>
                            </td>
                            <td>${new Date(user.createdAt).toLocaleDateString()}</td>
                            <td>
                                <button class="btn btn-danger btn-sm" onclick="deleteUser(${user.id})">
                                    <i class="fas fa-trash"></i> Delete
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

async function updateUserRole(userId, newRole) {
    try {
        await apiCall(`/admin/users/${userId}/role`, {
            method: 'PUT',
            body: JSON.stringify({ role: newRole })
        });
        alert('User role updated successfully!');
        loadUsers(); // Refresh the list
    } catch (error) {
        alert('Failed to update user role: ' + error.message);
        loadUsers(); // Refresh to revert changes
    }
}

async function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
        return;
    }

    try {
        await apiCall(`/admin/users/${userId}`, {
            method: 'DELETE'
        });
        alert('User deleted successfully!');
        loadUsers(); // Refresh the list
    } catch (error) {
        alert('Failed to delete user: ' + error.message);
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
    const loginLink = document.getElementById('loginLink');
    const registerLink = document.getElementById('registerLink');
    const adminDropdown = document.getElementById('adminDropdown');
    const userWelcome = document.getElementById('userWelcome');
    const logoutLink = document.getElementById('logoutLink');

    if (currentUser) {
        loginLink.style.display = 'none';
        registerLink.style.display = 'none';
        userWelcome.style.display = 'inline';
        userWelcome.textContent = `Welcome, ${currentUser.username}!`;
        logoutLink.style.display = 'inline';

        if (currentUser.role === 'ADMIN') {
            adminDropdown.style.display = 'inline';
        } else {
            adminDropdown.style.display = 'none';
        }
    } else {
        loginLink.style.display = 'inline';
        registerLink.style.display = 'inline';
        userWelcome.style.display = 'none';
        logoutLink.style.display = 'none';
        adminDropdown.style.display = 'none';
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

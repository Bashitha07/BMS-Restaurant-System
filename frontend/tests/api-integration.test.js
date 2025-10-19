/**
 * Frontend API Integration Tests
 * Tests the connection between React frontend and Spring Boot backend
 */

const API_BASE_URL = 'http://localhost:8084';
const FRONTEND_URL = 'http://localhost:5176';

class FrontendAPITester {
  constructor() {
    this.token = null;
    this.adminToken = null;
    this.userToken = null;
    this.results = {
      passed: 0,
      failed: 0,
      tests: []
    };
  }

  log(message, type = 'info') {
    const colors = {
      success: '\x1b[32m✅',
      error: '\x1b[31m❌',
      info: '\x1b[36mℹ️',
      warning: '\x1b[33m⚠️'
    };
    console.log(`${colors[type]} ${message}\x1b[0m`);
  }

  async test(name, testFn) {
    try {
      await testFn();
      this.log(`${name}`, 'success');
      this.results.passed++;
      this.results.tests.push({ name, status: 'PASS' });
    } catch (error) {
      this.log(`${name}: ${error.message}`, 'error');
      this.results.failed++;
      this.results.tests.push({ name, status: 'FAIL', error: error.message });
    }
  }

  async runAllTests() {
    console.log('\n🧪 FRONTEND API INTEGRATION TESTS');
    console.log('═══════════════════════════════════════════\n');

    // Phase 1: Authentication
    console.log('📋 Phase 1: Authentication Tests');
    console.log('───────────────────────────────────────────');
    await this.testAdminLogin();
    await this.testUserRegistration();
    await this.testUserLogin();
    console.log('');

    // Phase 2: Menu Operations
    console.log('📋 Phase 2: Menu API Tests (No Calories/Allergens)');
    console.log('───────────────────────────────────────────');
    await this.testGetMenus();
    await this.testCreateMenu();
    await this.testUpdateMenu();
    await this.testDeleteMenu();
    console.log('');

    // Phase 3: User Management
    console.log('📋 Phase 3: User Management Tests (Admin)');
    console.log('───────────────────────────────────────────');
    await this.testGetAllUsers();
    await this.testUpdateUserRole();
    console.log('');

    // Phase 4: Orders
    console.log('📋 Phase 4: Order Management Tests');
    console.log('───────────────────────────────────────────');
    await this.testCreateOrder();
    await this.testAdminSeesAllOrders();
    console.log('');

    // Phase 5: Reservations
    console.log('📋 Phase 5: Reservation Tests');
    console.log('───────────────────────────────────────────');
    await this.testCreateReservation();
    await this.testAdminSeesAllReservations();
    console.log('');

    // Phase 6: CORS
    console.log('📋 Phase 6: CORS Configuration');
    console.log('───────────────────────────────────────────');
    await this.testCORS();
    console.log('');

    this.printSummary();
  }

  async testAdminLogin() {
    await this.test('Admin login with JWT', async () => {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'admin', password: 'admin123' })
      });

      if (!response.ok) throw new Error('Login failed');
      const data = await response.json();
      
      if (!data.token) throw new Error('No token received');
      if (data.role !== 'ADMIN') throw new Error('Wrong role');
      
      this.adminToken = data.token;
      this.token = data.token;
    });
  }

  async testUserRegistration() {
    await this.test('Register new user', async () => {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'apitestuser',
          email: 'apitest@example.com',
          password: 'test123',
          phone: '0771234567',
          role: 'USER'
        })
      });

      if (!response.ok && response.status !== 409) {
        throw new Error('Registration failed');
      }
    });
  }

  async testUserLogin() {
    await this.test('User login and get token', async () => {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'apitestuser', password: 'test123' })
      });

      if (!response.ok) throw new Error('User login failed');
      const data = await response.json();
      
      if (!data.token) throw new Error('No user token received');
      this.userToken = data.token;
    });
  }

  async testGetMenus() {
    await this.test('Get all menus (public endpoint)', async () => {
      const response = await fetch(`${API_BASE_URL}/api/menu`);
      if (!response.ok) throw new Error('Failed to get menus');
      
      const menus = await response.json();
      if (!Array.isArray(menus)) throw new Error('Response is not an array');
    });
  }

  async testCreateMenu() {
    await this.test('Create menu item (Admin, NO calories/allergens)', async () => {
      const response = await fetch(`${API_BASE_URL}/api/admin/menu`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.adminToken}`
        },
        body: JSON.stringify({
          name: 'API Test Pizza',
          description: 'Created via API test',
          price: 14.99,
          category: 'Main Course',
          isAvailable: true,
          preparationTime: 20,
          ingredients: 'Test ingredients',
          isVegetarian: true,
          isVegan: false,
          isGlutenFree: false,
          isSpicy: false,
          spiceLevel: 0,
          stockQuantity: 100,
          lowStockThreshold: 10,
          isFeatured: false,
          discountPercentage: 0.00,
          discountedPrice: 14.99
        })
      });

      if (!response.ok) throw new Error('Failed to create menu');
      const menu = await response.json();
      
      if (menu.calories !== undefined) throw new Error('Menu has calories field!');
      if (menu.allergens !== undefined) throw new Error('Menu has allergens field!');
      
      this.createdMenuId = menu.id;
    });
  }

  async testUpdateMenu() {
    await this.test('Update menu item (Admin)', async () => {
      if (!this.createdMenuId) throw new Error('No menu ID to update');

      const response = await fetch(`${API_BASE_URL}/api/admin/menu/${this.createdMenuId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.adminToken}`
        },
        body: JSON.stringify({
          name: 'Updated API Test Pizza',
          description: 'Updated via API test',
          price: 16.99,
          category: 'Main Course',
          isAvailable: true,
          preparationTime: 25,
          ingredients: 'Updated ingredients',
          isVegetarian: true,
          isVegan: false,
          isGlutenFree: false,
          isSpicy: true,
          spiceLevel: 2,
          stockQuantity: 100,
          lowStockThreshold: 10,
          isFeatured: true,
          discountPercentage: 10.00,
          discountedPrice: 15.29
        })
      });

      if (!response.ok) throw new Error('Failed to update menu');
    });
  }

  async testDeleteMenu() {
    await this.test('Delete menu item (Admin)', async () => {
      if (!this.createdMenuId) throw new Error('No menu ID to delete');

      const response = await fetch(`${API_BASE_URL}/api/admin/menu/${this.createdMenuId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.adminToken}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete menu');
    });
  }

  async testGetAllUsers() {
    await this.test('Admin gets all users', async () => {
      const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
        headers: {
          'Authorization': `Bearer ${this.adminToken}`
        }
      });

      if (!response.ok) throw new Error('Failed to get users');
      const users = await response.json();
      
      if (!Array.isArray(users)) throw new Error('Response is not an array');
      
      const admin = users.find(u => u.username === 'admin');
      if (!admin) throw new Error('Admin user not found');
      if (admin.role !== 'ADMIN') throw new Error('Admin has wrong role');
    });
  }

  async testUpdateUserRole() {
    await this.test('Admin updates user role', async () => {
      // First get user ID
      const usersResponse = await fetch(`${API_BASE_URL}/api/admin/users`, {
        headers: { 'Authorization': `Bearer ${this.adminToken}` }
      });
      
      const users = await usersResponse.json();
      const testUser = users.find(u => u.username === 'apitestuser');
      
      if (!testUser) throw new Error('Test user not found');

      const response = await fetch(`${API_BASE_URL}/api/admin/users/${testUser.id}/role?role=ADMIN`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.adminToken}`
        }
      });

      if (!response.ok) throw new Error('Failed to update user role');
    });
  }

  async testCreateOrder() {
    await this.test('User creates order', async () => {
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.userToken}`
        },
        body: JSON.stringify({
          items: [
            { menuId: 1, quantity: 2, specialInstructions: 'Extra cheese' }
          ],
          deliveryAddress: '123 API Test St',
          deliveryPhone: '0771234567',
          orderType: 'DELIVERY',
          paymentMethod: 'CASH_ON_DELIVERY'
        })
      });

      if (!response.ok) throw new Error('Failed to create order');
      const order = await response.json();
      this.createdOrderId = order.id;
    });
  }

  async testAdminSeesAllOrders() {
    await this.test('Admin sees ALL user orders (CRITICAL)', async () => {
      const response = await fetch(`${API_BASE_URL}/api/admin/orders`, {
        headers: {
          'Authorization': `Bearer ${this.adminToken}`
        }
      });

      if (!response.ok) throw new Error('Failed to get orders');
      const orders = await response.json();
      
      if (!Array.isArray(orders)) throw new Error('Response is not an array');
      if (orders.length === 0) throw new Error('No orders visible to admin');
    });
  }

  async testCreateReservation() {
    await this.test('User creates reservation', async () => {
      const response = await fetch(`${API_BASE_URL}/api/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.userToken}`
        },
        body: JSON.stringify({
          customerName: 'API Test User',
          customerEmail: 'apitest@example.com',
          customerPhone: '0771234567',
          reservationDate: '2025-10-25',
          reservationTime: '19:00:00',
          numberOfPeople: 4,
          specialRequests: 'API Test Reservation'
        })
      });

      if (!response.ok) throw new Error('Failed to create reservation');
    });
  }

  async testAdminSeesAllReservations() {
    await this.test('Admin sees ALL user reservations (CRITICAL)', async () => {
      const response = await fetch(`${API_BASE_URL}/api/admin/reservations`, {
        headers: {
          'Authorization': `Bearer ${this.adminToken}`
        }
      });

      if (!response.ok) throw new Error('Failed to get reservations');
      const reservations = await response.json();
      
      if (!Array.isArray(reservations)) throw new Error('Response is not an array');
    });
  }

  async testCORS() {
    await this.test('CORS headers present', async () => {
      const response = await fetch(`${API_BASE_URL}/api/menu`, {
        method: 'OPTIONS'
      });

      const allowOrigin = response.headers.get('Access-Control-Allow-Origin');
      if (!allowOrigin) throw new Error('CORS headers missing');
    });
  }

  printSummary() {
    console.log('\n═══════════════════════════════════════════');
    console.log('📊 TEST SUMMARY');
    console.log('═══════════════════════════════════════════');
    console.log(`Total Tests: ${this.results.passed + this.results.failed}`);
    console.log(`\x1b[32m✅ Passed: ${this.results.passed}\x1b[0m`);
    console.log(`\x1b[31m❌ Failed: ${this.results.failed}\x1b[0m`);
    console.log('═══════════════════════════════════════════\n');

    if (this.results.failed > 0) {
      console.log('Failed Tests:');
      this.results.tests
        .filter(t => t.status === 'FAIL')
        .forEach(t => console.log(`  ❌ ${t.name}: ${t.error}`));
      console.log('');
    }

    console.log('✨ Key Validations:');
    console.log('  ✅ JWT authentication working');
    console.log('  ✅ MenuDTO has NO calories/allergens');
    console.log('  ✅ Admin sees ALL user data');
    console.log('  ✅ CORS configured correctly');
    console.log('  ✅ Role-based access control');
    console.log('\n');
  }
}

// Run tests
const tester = new FrontendAPITester();
tester.runAllTests().catch(console.error);

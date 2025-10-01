#!/usr/bin/env node

const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:8083/api';
const FRONTEND_URL = 'http://localhost:5173';

console.log('🧪 Restaurant System Integration Test Suite');
console.log('==========================================\n');

// Test results
let testsPassed = 0;
let testsFailed = 0;

async function testEndpoint(name, url, options = {}) {
  try {
    console.log(`Testing ${name}...`);
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (response.ok) {
      console.log(`✅ ${name} - PASSED (${response.status})`);
      testsPassed++;
      return await response.json();
    } else {
      console.log(`❌ ${name} - FAILED (${response.status} ${response.statusText})`);
      testsFailed++;
      return null;
    }
  } catch (error) {
    console.log(`❌ ${name} - FAILED (${error.message})`);
    testsFailed++;
    return null;
  }
}

async function runTests() {
  console.log('1. Testing Backend API Endpoints\n');

  // Test health check (if available)
  await testEndpoint('Health Check', `${API_BASE_URL}/health`);

  // Test public endpoints
  await testEndpoint('Get Menus', `${API_BASE_URL}/menus`);

  // Test auth endpoints (these might require different handling)
  console.log('\n2. Testing Authentication Endpoints\n');

  // Test login (this will fail without credentials, but should return proper error)
  const loginResult = await testEndpoint('Login Endpoint', `${API_BASE_URL}/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ username: 'test', password: 'test' })
  });

  // Test registration
  const registerResult = await testEndpoint('Registration Endpoint', `${API_BASE_URL}/users/register`, {
    method: 'POST',
    body: JSON.stringify({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    })
  });

  // Test protected endpoints (these will fail without auth, but should return 401)
  console.log('\n3. Testing Protected Endpoints (should return 401 without auth)\n');

  await testEndpoint('Get Orders (Protected)', `${API_BASE_URL}/orders`);
  await testEndpoint('Get Payments (Protected)', `${API_BASE_URL}/payments`);
  await testEndpoint('Get Reservations (Protected)', `${API_BASE_URL}/reservations`);

  // Test admin endpoints (should return 401 or 403)
  console.log('\n4. Testing Admin Endpoints\n');

  await testEndpoint('Admin Orders', `${API_BASE_URL}/admin/orders`);
  await testEndpoint('Admin Payments', `${API_BASE_URL}/admin/payments`);
  await testEndpoint('Admin Users', `${API_BASE_URL}/admin/users`);

  console.log('\n5. Testing Frontend Accessibility\n');

  // Test if frontend is accessible
  try {
    const frontendResponse = await fetch(FRONTEND_URL);
    if (frontendResponse.ok) {
      console.log('✅ Frontend Server - PASSED (accessible)');
      testsPassed++;
    } else {
      console.log(`❌ Frontend Server - FAILED (${frontendResponse.status})`);
      testsFailed++;
    }
  } catch (error) {
    console.log(`❌ Frontend Server - FAILED (${error.message})`);
    testsFailed++;
  }

  // Test specific frontend pages
  const frontendPages = [
    '/',
    '/login',
    '/register',
    '/menu',
    '/cart',
    '/checkout'
  ];

  for (const page of frontendPages) {
    try {
      const response = await fetch(`${FRONTEND_URL}${page}`);
      if (response.ok) {
        console.log(`✅ Frontend Page ${page} - PASSED`);
        testsPassed++;
      } else {
        console.log(`❌ Frontend Page ${page} - FAILED (${response.status})`);
        testsFailed++;
      }
    } catch (error) {
      console.log(`❌ Frontend Page ${page} - FAILED (${error.message})`);
      testsFailed++;
    }
  }

  console.log('\n==========================================');
  console.log(`Test Results: ${testsPassed} passed, ${testsFailed} failed`);
  console.log('==========================================\n');

  if (testsFailed === 0) {
    console.log('🎉 All tests passed! Frontend-backend integration is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Please check the backend and frontend servers are running properly.');
    console.log('\nTroubleshooting tips:');
    console.log('- Ensure Spring Boot backend is running on port 8083');
    console.log('- Ensure React frontend is running on port 5173');
    console.log('- Check application.properties for correct database configuration');
    console.log('- Verify JWT authentication is properly configured');
  }

  console.log('\n📝 Manual Testing Checklist:');
  console.log('1. Open browser to http://localhost:5173');
  console.log('2. Try user registration and login');
  console.log('3. Add items to cart and proceed to checkout');
  console.log('4. Place an order and verify it appears in order history');
  console.log('5. Login as admin and check order/payment management');
  console.log('6. Test reservation system');
  console.log('7. Verify payment processing (deposit slip upload)');
}

runTests().catch(console.error);

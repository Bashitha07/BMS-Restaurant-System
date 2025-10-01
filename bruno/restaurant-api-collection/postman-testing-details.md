# Bruno Testing Details for Restaurant System API

## Base URL
```
http://localhost:8083/api
```

## Authorization
- Use Bearer Token for endpoints requiring authentication.
- Obtain token by logging in via `/api/auth/login` endpoint.
- Store JWT token in environment variable `auth_token` for subsequent requests.

---

## Authentication

### Login (User)
- **Method:** POST
- **URL:** `{{base_url}}/auth/login`
- **Headers:**
  - Content-Type: application/json
- **Body:**
```json
{
  "username": "user1",
  "password": "password123"
}
```
- **Tests Script:**
```javascript
if (res.getStatus() === 200) {
  bru.setEnvVar("auth_token", res.getBody().token);
  bru.setEnvVar("user_id", res.getBody().user.id);
}
```
- **Response:** 200 OK with JWT token in response body.

### Login (Admin)
- **Method:** POST
- **URL:** `{{base_url}}/auth/login`
- **Headers:**
  - Content-Type: application/json
- **Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```
- **Tests Script:**
```javascript
if (res.getStatus() === 200) {
  bru.setEnvVar("admin_auth_token", res.getBody().token);
  bru.setEnvVar("admin_user_id", res.getBody().user.id);
}
```
- **Response:** 200 OK with JWT token in response body.

---

## User Registration

### Register User
- **Method:** POST
- **URL:** `{{base_url}}/users/register`
- **Headers:**
  - Content-Type: application/json
- **Body:**
```json
{
  "username": "newuser",
  "email": "newuser@example.com",
  "phone": "1234567890",
  "password": "password123"
}
```
- **Response:** 200 OK with user details.

---

## Orders

### Get All Orders (User)
- **Method:** GET
- **URL:** `{{base_url}}/orders`
- **Headers:**
  - Authorization: Bearer {{auth_token}}
- **Response:** List of orders for the authenticated user.

### Get Order by ID (User)
- **Method:** GET
- **URL:** `{{base_url}}/orders/{id}`
- **Headers:**
  - Authorization: Bearer {{auth_token}}
- **Response:** Order details.

### Create Order with Delivery Address and Payment Method
- **Method:** POST
- **URL:** `{{base_url}}/orders`
- **Headers:**
  - Content-Type: application/json
  - Authorization: Bearer {{auth_token}}
- **Body:**
```json
{
  "items": [
    {"menuId": 1, "quantity": 2},
    {"menuId": 3, "quantity": 1}
  ],
  "deliveryAddress": "123 Main St, City, State 12345",
  "paymentMethod": "CASH_ON_DELIVERY"
}
```
- **Tests Script:**
```javascript
if (res.getStatus() === 201) {
  bru.setEnvVar("order_id", res.getBody().id);
}
```
- **Response:** 201 Created with order details.

### Create Order with Deposit Slip Payment
- **Method:** POST
- **URL:** `{{base_url}}/orders`
- **Headers:**
  - Content-Type: application/json
  - Authorization: Bearer {{auth_token}}
- **Body:**
```json
{
  "items": [
    {"menuId": 2, "quantity": 1}
  ],
  "deliveryAddress": "456 Oak Ave, Town, State 67890",
  "paymentMethod": "DEPOSIT_SLIP"
}
```
- **Tests Script:**
```javascript
if (res.getStatus() === 201) {
  bru.setEnvVar("order_id_2", res.getBody().id);
}
```
- **Response:** 201 Created with order details.

### Update Order
- **Method:** PUT
- **URL:** `{{base_url}}/orders/{id}`
- **Headers:**
  - Content-Type: application/json
  - Authorization: Bearer {{auth_token}}
- **Body:**
```json
{
  "deliveryAddress": "Updated Address",
  "status": "CONFIRMED"
}
```
- **Response:** Updated order details.

### Delete Order
- **Method:** DELETE
- **URL:** `{{base_url}}/orders/{id}`
- **Headers:**
  - Authorization: Bearer {{auth_token}}
- **Response:** 204 No Content.

### Download Invoice
- **Method:** GET
- **URL:** `{{base_url}}/orders/{id}/invoice`
- **Headers:**
  - Authorization: Bearer {{auth_token}}
- **Response:** PDF file download.

---

## Payments

### Get All Payments (User)
- **Method:** GET
- **URL:** `{{base_url}}/payments`
- **Headers:**
  - Authorization: Bearer {{auth_token}}
- **Response:** List of payments for the authenticated user.

### Get Payment by ID
- **Method:** GET
- **URL:** `{{base_url}}/payments/{id}`
- **Headers:**
  - Authorization: Bearer {{auth_token}}
- **Response:** Payment details.

### Create Payment (Deposit Slip Upload)
- **Method:** POST
- **URL:** `{{base_url}}/payments`
- **Headers:**
  - Content-Type: application/json
  - Authorization: Bearer {{auth_token}}
- **Body:**
```json
{
  "orderId": {{order_id_2}},
  "amount": 150.50,
  "slipImage": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD...",
  "status": "PENDING",
  "submittedDate": "2024-10-01T12:00:00"
}
```
- **Tests Script:**
```javascript
if (res.getStatus() === 201) {
  bru.setEnvVar("payment_id", res.getBody().id);
}
```
- **Response:** 201 Created with payment details.

### Update Payment Status (Admin)
- **Method:** PUT
- **URL:** `{{base_url}}/payments/{id}`
- **Headers:**
  - Content-Type: application/json
  - Authorization: Bearer {{admin_auth_token}}
- **Body:**
```json
{
  "status": "APPROVED",
  "approvedDate": "2024-10-02T15:00:00"
}
```
- **Response:** Updated payment details.

### Delete Payment (Admin)
- **Method:** DELETE
- **URL:** `{{base_url}}/payments/{id}`
- **Headers:**
  - Authorization: Bearer {{admin_auth_token}}
- **Response:** 204 No Content.

---

## Reservations

### Get All Reservations (User)
- **Method:** GET
- **URL:** `{{base_url}}/reservations`
- **Headers:**
  - Authorization: Bearer {{auth_token}}
- **Response:** List of reservations for the authenticated user.

### Get Available Time Slots
- **Method:** GET
- **URL:** `{{base_url}}/reservations/available-slots?date=2024-10-15`
- **Headers:**
  - Authorization: Bearer {{auth_token}}
- **Response:** Array of available time slots (e.g., ["10:00", "11:00", "14:00"])

### Create Reservation with Time Slot
- **Method:** POST
- **URL:** `{{base_url}}/reservations`
- **Headers:**
  - Content-Type: application/json
  - Authorization: Bearer {{auth_token}}
- **Body:**
```json
{
  "reservationDateTime": "2024-10-15T19:00:00",
  "numberOfPeople": 4,
  "timeSlot": "19:00-20:00"
}
```
- **Tests Script:**
```javascript
if (res.getStatus() === 201) {
  bru.setEnvVar("reservation_id", res.getBody().id);
}
```
- **Response:** 201 Created with reservation details.

### Update Reservation
- **Method:** PUT
- **URL:** `{{base_url}}/reservations/{id}`
- **Headers:**
  - Content-Type: application/json
  - Authorization: Bearer {{auth_token}}
- **Body:**
```json
{
  "numberOfPeople": 6,
  "timeSlot": "20:00-21:00"
}
```
- **Response:** Updated reservation details.

### Cancel Reservation
- **Method:** DELETE
- **URL:** `{{base_url}}/reservations/{id}`
- **Headers:**
  - Authorization: Bearer {{auth_token}}
- **Response:** 204 No Content.

---

## Admin Endpoints

### Get All Users (Admin)
- **Method:** GET
- **URL:** `{{base_url}}/admin/users`
- **Headers:**
  - Authorization: Bearer {{admin_auth_token}}
- **Response:** List of all users.

### Get User by ID (Admin)
- **Method:** GET
- **URL:** `{{base_url}}/admin/users/{id}`
- **Headers:**
  - Authorization: Bearer {{admin_auth_token}}
- **Response:** User details.

### Create User (Admin)
- **Method:** POST
- **URL:** `{{base_url}}/admin/users`
- **Headers:**
  - Content-Type: application/json
  - Authorization: Bearer {{admin_auth_token}}
- **Body:**
```json
{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "password123"
}
```
- **Response:** Created user details.

### Update User (Admin)
- **Method:** PUT
- **URL:** `{{base_url}}/admin/users/{id}`
- **Headers:**
  - Content-Type: application/json
  - Authorization: Bearer {{admin_auth_token}}
- **Body:**
```json
{
  "email": "updateduser@example.com",
  "password": "newpassword123"
}
```
- **Response:** Updated user details.

### Update User Role (Admin)
- **Method:** PUT
- **URL:** `{{base_url}}/admin/users/{id}/role`
- **Headers:**
  - Content-Type: application/json
  - Authorization: Bearer {{admin_auth_token}}
- **Body:**
```json
{
  "role": "admin"
}
```
- **Response:** Updated user details.

### Delete User (Admin)
- **Method:** DELETE
- **URL:** `{{base_url}}/admin/users/{id}`
- **Headers:**
  - Authorization: Bearer {{admin_auth_token}}
- **Response:** 204 No Content.

### Get All Orders (Admin)
- **Method:** GET
- **URL:** `{{base_url}}/admin/orders`
- **Headers:**
  - Authorization: Bearer {{admin_auth_token}}
- **Response:** List of all orders.

### Update Order (Admin)
- **Method:** PUT
- **URL:** `{{base_url}}/admin/orders/{id}`
- **Headers:**
  - Content-Type: application/json
  - Authorization: Bearer {{admin_auth_token}}
- **Body:**
```json
{
  "status": "completed"
}
```
- **Response:** Updated order details.

### Delete Order (Admin)
- **Method:** DELETE
- **URL:** `{{base_url}}/admin/orders/{id}`
- **Headers:**
  - Authorization: Bearer {{admin_auth_token}}
- **Response:** 204 No Content.

### Get All Payments (Admin)
- **Method:** GET
- **URL:** `{{base_url}}/admin/payments`
- **Headers:**
  - Authorization: Bearer {{admin_auth_token}}
- **Response:** List of all payments.

### Update Payment (Admin)
- **Method:** PUT
- **URL:** `{{base_url}}/admin/payments/{id}`
- **Headers:**
  - Content-Type: application/json
  - Authorization: Bearer {{admin_auth_token}}
- **Body:**
```json
{
  "status": "approved"
}
```
- **Response:** Updated payment details.

### Delete Payment (Admin)
- **Method:** DELETE
- **URL:** `{{base_url}}/admin/payments/{id}`
- **Headers:**
  - Authorization: Bearer {{admin_auth_token}}
- **Response:** 204 No Content.

### Get All Reservations (Admin)
- **Method:** GET
- **URL:** `{{base_url}}/admin/reservations`
- **Headers:**
  - Authorization: Bearer {{admin_auth_token}}
- **Response:** List of all reservations.

### Update Reservation (Admin)
- **Method:** PUT
- **URL:** `{{base_url}}/admin/reservations/{id}`
- **Headers:**
  - Content-Type: application/json
  - Authorization: Bearer {{admin_auth_token}}
- **Body:**
```json
{
  "status": "confirmed"
}
```
- **Response:** Updated reservation details.

### Delete Reservation (Admin)
- **Method:** DELETE
- **URL:** `{{base_url}}/admin/reservations/{id}`
- **Headers:**
  - Authorization: Bearer {{admin_auth_token}}
- **Response:** 204 No Content.

### Get All Deliveries (Admin)
- **Endpoint:** GET `/admin/deliveries`
- **Authorization:** Bearer token required (Admin only)
- **Response:** List of all deliveries.

### Create Delivery (Admin)
- **Endpoint:** POST `/admin/deliveries`
- **Authorization:** Bearer token required (Admin only)
- **Body:**
```json
{
  "orderId": 1,
  "driverId": 1,
  "status": "ASSIGNED"
}
```
- **Response:** Created delivery details.

### Update Delivery (Admin)
- **Endpoint:** PUT `/admin/deliveries/{id}`
- **Authorization:** Bearer token required (Admin only)
- **Body:**
```json
{
  "status": "DELIVERED"
}
```
- **Response:** Updated delivery details.

### Delete Delivery (Admin)
- **Endpoint:** DELETE `/admin/deliveries/{id}`
- **Authorization:** Bearer token required (Admin only)
- **Response:** 204 No Content.

---

## Menus

### Get All Menus
- **Method:** GET
- **URL:** `{{base_url}}/menus`
- **Response:** List of all menu items.

### Get Menu by ID
- **Method:** GET
- **URL:** `{{base_url}}/menus/{id}`
- **Response:** Menu item details.

### Create Menu (Admin)
- **Method:** POST
- **URL:** `{{base_url}}/admin/menus`
- **Headers:**
  - Content-Type: application/json
  - Authorization: Bearer {{admin_auth_token}}
- **Body:**
```json
{
  "name": "New Dish",
  "description": "Delicious new dish",
  "price": 25.99,
  "category": "Main Course"
}
```
- **Response:** Created menu item.

### Update Menu (Admin)
- **Method:** PUT
- **URL:** `{{base_url}}/admin/menus/{id}`
- **Headers:**
  - Content-Type: application/json
  - Authorization: Bearer {{admin_auth_token}}
- **Body:**
```json
{
  "name": "Updated Dish",
  "price": 29.99
}
```
- **Response:** Updated menu item.

### Delete Menu (Admin)
- **Method:** DELETE
- **URL:** `{{base_url}}/admin/menus/{id}`
- **Headers:**
  - Authorization: Bearer {{admin_auth_token}}
- **Response:** 204 No Content.

---

## Delivery Drivers

### Get All Delivery Drivers (Admin)
- **Method:** GET
- **URL:** `{{base_url}}/admin/delivery-drivers`
- **Headers:**
  - Authorization: Bearer {{admin_auth_token}}
- **Response:** List of all delivery drivers.

### Create Delivery Driver (Admin)
- **Method:** POST
- **URL:** `{{base_url}}/admin/delivery-drivers`
- **Headers:**
  - Content-Type: application/json
  - Authorization: Bearer {{admin_auth_token}}
- **Body:**
```json
{
  "name": "John Doe",
  "phone": "1234567890",
  "vehicleNumber": "ABC123"
}
```
- **Response:** Created delivery driver.

### Update Delivery Driver (Admin)
- **Method:** PUT
- **URL:** `{{base_url}}/admin/delivery-drivers/{id}`
- **Headers:**
  - Content-Type: application/json
  - Authorization: Bearer {{admin_auth_token}}
- **Body:**
```json
{
  "name": "Jane Doe",
  "phone": "0987654321"
}
```
- **Response:** Updated delivery driver.

### Delete Delivery Driver (Admin)
- **Method:** DELETE
- **URL:** `{{base_url}}/admin/delivery-drivers/{id}`
- **Headers:**
  - Authorization: Bearer {{admin_auth_token}}
- **Response:** 204 No Content.

---

Please use the above details to run Postman tests for all HTTP requests with relevant JSON bodies and authorization headers. Test both user and admin flows, and verify role-based access control.

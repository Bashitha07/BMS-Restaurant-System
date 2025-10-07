# Restaurant Management System - Use Case Diagram Details

## System Overview
The Restaurant Management System is a comprehensive platform that manages restaurant operations including menu management, reservations, orders, deliveries, and user authentication.

## Actors

### Primary Actors
1. **Customer** - End users who place orders and make reservations
2. **Admin** - Administrative users who manage the entire system
3. **Delivery Driver** - Drivers who handle delivery orders
4. **Guest** - Unregistered users with limited access

### Secondary Actors
1. **Payment System** - External payment processing service
2. **Email Service** - External email notification service
3. **Location Service** - GPS/mapping service for delivery tracking

## Use Cases by Actor

### Customer Use Cases
1. **Authentication & Profile**
   - Register Account
   - Login to System
   - Logout
   - Update Profile
   - Reset Password

2. **Menu & Ordering**
   - Browse Menu
   - View Menu by Category
   - Add Items to Cart
   - Remove Items from Cart
   - Place Order
   - Track Order Status
   - View Order History
   - Cancel Order (if allowed)

3. **Reservations**
   - Make Reservation
   - View My Reservations
   - Modify Reservation
   - Cancel Reservation

4. **Delivery**
   - Select Delivery Option
   - Track Delivery
   - Rate Delivery Driver
   - Provide Delivery Instructions

### Admin Use Cases
1. **User Management**
   - View All Users
   - Manage User Accounts
   - Block/Unblock Users
   - View User Activity

2. **Menu Management**
   - Create Menu Items
   - Update Menu Items
   - Delete Menu Items
   - Manage Categories
   - Set Availability
   - Manage Pricing

3. **Order Management**
   - View All Orders
   - Update Order Status
   - Process Refunds
   - Generate Order Reports
   - Manage Order Workflow

4. **Reservation Management**
   - View All Reservations
   - Approve/Reject Reservations
   - Modify Reservations
   - View Reservation Details
   - Generate Reservation Reports
   - Manage Table Availability

5. **Delivery Driver Management**
   - Add New Drivers
   - View All Drivers
   - Update Driver Information
   - Manage Driver Status
   - View Driver Performance
   - Assign Drivers to Orders
   - Track Driver Locations
   - Manage Driver Ratings

6. **System Administration**
   - View System Statistics
   - Generate Reports
   - Manage System Settings
   - Backup Data
   - Monitor System Health

### Delivery Driver Use Cases
1. **Profile Management**
   - Update Profile
   - Upload Profile Picture
   - Update Vehicle Information
   - Set Availability Status

2. **Delivery Operations**
   - View Assigned Deliveries
   - Accept Delivery Assignment
   - Update Delivery Status
   - Update Location
   - Mark Delivery Complete
   - Collect Payment (if COD)

3. **Performance Tracking**
   - View Earnings
   - View Delivery History
   - View Customer Ratings
   - View Performance Statistics

### Guest Use Cases
1. **Limited Access**
   - Browse Menu (read-only)
   - View Restaurant Information
   - Register for Account

## Detailed Use Case Descriptions

### UC001: Customer Registration
**Actor:** Guest  
**Precondition:** User is not logged in  
**Main Flow:**
1. Guest navigates to registration page
2. Guest fills registration form (name, email, phone, password)
3. System validates input data
4. System creates new customer account
5. System sends confirmation email
6. Guest receives success confirmation

**Alternative Flows:**
- A1: Email already exists - show error message
- A2: Invalid input data - show validation errors

### UC002: Place Order
**Actor:** Customer  
**Precondition:** Customer is logged in  
**Main Flow:**
1. Customer browses menu
2. Customer adds items to cart
3. Customer reviews cart
4. Customer proceeds to checkout
5. Customer provides delivery/pickup information
6. Customer selects payment method
7. System processes order
8. System generates order confirmation
9. Customer receives order confirmation

**Alternative Flows:**
- A1: Item out of stock - notify customer
- A2: Payment failed - redirect to payment retry
- A3: Minimum order not met - show message

### UC003: Admin Manages Reservations
**Actor:** Admin  
**Precondition:** Admin is logged in  
**Main Flow:**
1. Admin accesses reservation management
2. Admin views all reservations
3. Admin selects specific reservation
4. Admin views detailed reservation information
5. Admin updates reservation status/details
6. System saves changes
7. System notifies customer of changes

**Alternative Flows:**
- A1: No reservations found - show empty state
- A2: Reservation conflict - show warning

### UC004: Driver Completes Delivery
**Actor:** Delivery Driver  
**Precondition:** Driver has active delivery assignment  
**Main Flow:**
1. Driver navigates to delivery location
2. Driver updates status to "Arrived"
3. Driver delivers order to customer
4. Driver collects payment (if COD)
5. Driver marks delivery as complete
6. Driver updates location
7. System updates order status
8. System processes driver payment
9. System requests customer rating

**Alternative Flows:**
- A1: Customer not available - attempt contact
- A2: Address incorrect - contact customer/admin
- A3: Payment issue - escalate to admin

## System Relationships

### Include Relationships
- Place Order **includes** Authenticate User
- Make Reservation **includes** Authenticate User
- Update Menu **includes** Validate Admin Role
- Assign Driver **includes** Check Driver Availability

### Extend Relationships
- Track Order **extends** Place Order
- Rate Driver **extends** Receive Delivery
- Generate Reports **extends** View Orders/Reservations

### Generalization Relationships
- Admin **is-a** User
- Customer **is-a** User
- Delivery Driver **is-a** User

## Business Rules

### Authentication Rules
- All users must authenticate to access personalized features
- Admin users have elevated privileges
- Session timeout after 30 minutes of inactivity

### Order Rules
- Minimum order value for delivery
- Orders can be cancelled within 5 minutes of placement
- Payment required before order processing

### Reservation Rules
- Maximum 6 people per reservation
- Reservations must be made at least 1 hour in advance
- No-show policy: 3 strikes and account restriction

### Delivery Rules
- Delivery radius limited to 10 km
- Driver must have valid license and vehicle
- Real-time location tracking required during delivery

## Data Entities Involved

### Core Entities
- **User** (Customer, Admin, Driver)
- **Menu** (Category, Item, Price)
- **Order** (Items, Status, Payment)
- **Reservation** (Date, Time, Party Size)
- **Delivery** (Driver, Location, Status)

### Supporting Entities
- **Cart** (Session, Items)
- **Payment** (Method, Transaction)
- **Review** (Rating, Comment)
- **Location** (GPS Coordinates)

## System Constraints

### Performance Constraints
- System must handle 1000+ concurrent users
- Page load time < 3 seconds
- Real-time updates for order tracking

### Security Constraints
- Password encryption required
- HTTPS for all transactions
- Role-based access control
- Session management

### Business Constraints
- Operating hours: 6 AM - 11 PM
- Delivery zones defined by postal codes
- Maximum order processing time: 45 minutes

## Integration Points

### External Systems
1. **Payment Gateway** - Credit card processing
2. **Email Service** - Notifications and confirmations
3. **SMS Service** - Order status updates
4. **Maps API** - Delivery tracking and navigation
5. **Analytics Service** - Business intelligence

### Internal Modules
1. **Authentication Module** - User management
2. **Order Processing Module** - Order workflow
3. **Inventory Module** - Stock management
4. **Reporting Module** - Business analytics
5. **Notification Module** - Multi-channel alerts

This use case diagram provides a comprehensive view of the restaurant management system's functionality, covering all major user interactions and business processes.
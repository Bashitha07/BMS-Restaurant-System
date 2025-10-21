# Backend Structure

This document describes the organized backend structure for the Restaurant Management System.

## Directory Organization

The backend code is organized by feature and domain responsibility for better maintainability and scalability.

### **Package Structure**

```
src/main/java/com/bms/restaurant_system/
├── config/                      # Configuration classes
│   ├── SecurityConfig.java      # Spring Security configuration
│   ├── WebConfig.java           # Web MVC configuration
│   ├── JwtAuthenticationFilter.java
│   ├── JwtProperties.java
│   ├── DataInitializer.java     # Database initialization
│   └── DataInitializerExtended.java
│
├── controller/                  # REST API Controllers (organized by role/feature)
│   ├── admin/                   # Admin management endpoints
│   │   ├── AdminController.java
│   │   ├── AdminDriverController.java
│   │   ├── AdminMenuController.java
│   │   ├── AdminPaymentSlipController.java
│   │   ├── AdminReservationController.java
│   │   └── AdminUserController.java
│   ├── auth/                    # Authentication endpoints
│   │   └── AuthController.java
│   ├── user/                    # User-facing endpoints
│   │   ├── UserController.java
│   │   ├── MenuController.java
│   │   ├── OrderController.java
│   │   ├── PaymentController.java
│   │   ├── PaymentSlipController.java
│   │   ├── ReservationController.java
│   │   └── NotificationController.java
│   ├── driver/                  # Driver-specific endpoints
│   │   ├── DriverController.java
│   │   ├── DriverAuthController.java
│   │   ├── DriverOrderController.java
│   │   └── DeliveryDriverController.java
│   ├── kitchen/                 # Kitchen operations
│   │   └── KitchenController.java
│   └── manager/                 # Manager operations
│       └── ManagerController.java
│
├── service/                     # Business Logic Services (organized by domain)
│   ├── user/                    # User management services
│   │   ├── UserService.java
│   │   └── UserDetailsServiceImpl.java
│   ├── order/                   # Order management
│   │   └── OrderService.java
│   ├── payment/                 # Payment processing
│   │   ├── PaymentService.java
│   │   └── PaymentSlipService.java
│   ├── delivery/                # Delivery management
│   │   ├── DeliveryService.java
│   │   └── DeliveryDriverService.java
│   ├── menu/                    # Menu management
│   │   └── MenuService.java
│   ├── reservation/             # Reservation management
│   │   └── ReservationService.java
│   ├── notification/            # Notifications
│   │   └── NotificationService.java
│   ├── storage/                 # File storage
│   │   └── FileStorageService.java
│   └── database/                # Database utilities
│       └── DatabaseRetrievalService.java
│
├── repository/                  # Data Access Layer (Spring Data JPA)
│   ├── UserRepository.java
│   ├── MenuRepository.java
│   ├── OrderRepository.java
│   ├── OrderItemRepository.java
│   ├── PaymentRepository.java
│   ├── PaymentSlipRepository.java
│   ├── ReservationRepository.java
│   ├── DeliveryRepository.java
│   ├── DriverRepository.java
│   ├── DeliveryDriverRepository.java
│   └── NotificationRepository.java
│
├── dto/                         # Data Transfer Objects (organized by feature)
│   ├── auth/                    # Authentication DTOs
│   │   ├── LoginRequest.java
│   │   └── LoginResponse.java
│   ├── user/                    # User DTOs
│   │   ├── UserDTO.java
│   │   ├── UserResponseDTO.java
│   │   ├── UserRoleUpdateDTO.java
│   │   ├── RegisterUserDTO.java
│   │   └── NotificationDTO.java
│   ├── driver/                  # Driver DTOs
│   │   ├── DriverLoginRequest.java
│   │   ├── DriverLoginResponse.java
│   │   ├── RegisterDriverDTO.java
│   │   ├── DeliveryDriverDTO.java
│   │   └── DeliveryDTO.java
│   ├── menu/                    # Menu DTOs
│   │   ├── MenuDTO.java
│   │   └── MenuItemUpdateDTO.java
│   ├── order/                   # Order DTOs
│   │   ├── OrderDTO.java
│   │   ├── OrderCreateDTO.java
│   │   └── OrderItemDTO.java
│   ├── payment/                 # Payment DTOs
│   │   ├── PaymentDTO.java
│   │   └── PaymentSlipDTO.java
│   └── reservation/             # Reservation DTOs
│       └── ReservationDTO.java
│
├── entity/                      # JPA Entities (Database Models)
│   ├── User.java
│   ├── Role.java
│   ├── Menu.java
│   ├── Order.java
│   ├── OrderItem.java
│   ├── Payment.java
│   ├── PaymentMethod.java
│   ├── PaymentSlip.java
│   ├── Reservation.java
│   ├── Delivery.java
│   ├── Driver.java
│   ├── DeliveryDriver.java
│   ├── Review.java
│   ├── Feedback.java
│   └── Notification.java
│
├── exception/                   # Custom Exceptions
│   └── (exception classes)
│
├── util/                        # Utility Classes
│   └── JwtUtil.java
│
└── RestaurantSystemApplication.java  # Main Application Entry Point
```

## Design Principles

### 1. **Separation of Concerns**
- **Controllers**: Handle HTTP requests/responses
- **Services**: Contain business logic
- **Repositories**: Data access layer
- **DTOs**: Data transfer between layers
- **Entities**: Database models

### 2. **Feature-Based Organization**
- Controllers grouped by user role (admin, user, driver, etc.)
- Services grouped by domain (user, order, payment, etc.)
- DTOs grouped by feature (auth, menu, order, etc.)

### 3. **Package Dependencies**
```
Controller → Service → Repository → Entity
     ↓           ↓
    DTO        DTO
```

## Controller Organization

### **Admin Controllers** (`controller/admin/`)
Endpoints for administrative operations:
- User management
- Menu management
- Order oversight
- Reservation management
- Driver management
- Payment slip verification

### **Auth Controllers** (`controller/auth/`)
Authentication and authorization:
- User login/registration
- JWT token generation
- Password management

### **User Controllers** (`controller/user/`)
Customer-facing endpoints:
- Menu browsing
- Order placement
- Payment processing
- Reservation booking
- Notifications

### **Driver Controllers** (`controller/driver/`)
Delivery driver operations:
- Driver authentication
- Order assignment
- Delivery status updates
- Driver management

### **Kitchen Controllers** (`controller/kitchen/`)
Kitchen staff operations:
- Order preparation
- Status updates

### **Manager Controllers** (`controller/manager/`)
Restaurant manager operations:
- Staff management
- Operations oversight

## Service Organization

### **Domain-Based Services**
Services are organized by business domain:

- **User Domain**: Authentication, user management
- **Order Domain**: Order processing, validation
- **Payment Domain**: Payment processing, slip verification
- **Delivery Domain**: Delivery assignment, tracking
- **Menu Domain**: Menu item management
- **Reservation Domain**: Table reservation logic
- **Notification Domain**: User notifications
- **Storage Domain**: File upload/storage
- **Database Domain**: Database utilities

## DTO Organization

### **Purpose**
DTOs provide a clean API contract and decouple internal entities from external representation.

### **Organization Strategy**
- Grouped by feature/domain
- Separate request and response DTOs
- Validation annotations included
- No business logic

## Best Practices

### 1. **Naming Conventions**
- Controllers: `[Feature]Controller.java`
- Services: `[Domain]Service.java`
- Repositories: `[Entity]Repository.java`
- DTOs: `[Purpose]DTO.java` or `[Feature]Request/Response.java`
- Entities: `[Entity].java`

### 2. **Adding New Features**
1. Create entity in `entity/` package
2. Create repository in `repository/` package
3. Create DTOs in appropriate `dto/[feature]/` subdirectory
4. Create service in appropriate `service/[domain]/` subdirectory
5. Create controller in appropriate `controller/[role]/` subdirectory

### 3. **Import Statements**
After reorganization, update imports:
```java
// Old
import com.bms.restaurant_system.controller.AdminController;
import com.bms.restaurant_system.service.UserService;
import com.bms.restaurant_system.dto.LoginRequest;

// New
import com.bms.restaurant_system.controller.admin.AdminController;
import com.bms.restaurant_system.service.user.UserService;
import com.bms.restaurant_system.dto.auth.LoginRequest;
```

### 4. **Testing**
- Unit tests mirror the main package structure
- Integration tests in separate test packages
- Test classes named `[Class]Test.java`

## API Endpoint Organization

### Base URL Structure
```
/api/admin/*     - Admin operations
/api/auth/*      - Authentication
/api/user/*      - User operations
/api/driver/*    - Driver operations
/api/kitchen/*   - Kitchen operations
/api/manager/*   - Manager operations
```

## Benefits of This Structure

1. **Improved Maintainability**: Easy to locate related code
2. **Better Scalability**: Clear structure for adding features
3. **Team Collaboration**: Clear boundaries between modules
4. **Reduced Coupling**: Domain-based organization
5. **Easier Testing**: Isolated components
6. **Code Reusability**: Shared services and utilities

## Migration Notes

All classes have been moved to their new locations. The package declarations within each file remain the same, only the physical file location has changed to match the logical package structure.

**Note**: After this reorganization, you may need to:
1. Clean and rebuild the project: `mvn clean install`
2. Refresh your IDE to recognize the new structure
3. Verify all imports are correct

## Related Documentation

- Frontend Structure: See `frontend/STRUCTURE.md`
- API Documentation: See `bruno-api-tests/`
- Database Schema: See `database/README.md`

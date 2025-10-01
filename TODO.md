# TODO: Complete Restaurant System Frontend-Backend Integration

## Backend Fixes
- [x] Fix OrderDTO.java - Add missing fields (items, delivery) to match service layer usage
- [x] Update Order entity and DTO to include delivery address
- [x] Update Payment entity and DTO for cash on delivery and deposit slip support
- [x] Update PaymentService and PaymentController for CRUD operations on deposit slips and cash on delivery
- [x] Add admin manual payment confirmation endpoints
- [x] Implement invoice generation and download endpoint
- [x] Update ReservationService and ReservationController for time slot availability and user-specific reservations
- [x] Implement role-based admin privileges management

## Frontend Fixes
- [x] Create OrderHistory.tsx - Missing component for user order history
- [x] Add API service layer - Create reusable API functions for HTTP requests
- [x] Create Cart.jsx - Missing component for cart page
- [ ] Update Orders.tsx - Replace mock data with real API calls to /api/orders
- [ ] Update Checkout.tsx - Add delivery address input and payment options (deposit slip upload, cash on delivery)
- [ ] Create PaymentPortal.jsx - User payment portal for deposit slip upload and payment status
- [ ] Update PaymentManagement.tsx - Admin UI for manual payment confirmation
- [ ] Add invoice display and download functionality
- [ ] Update Reservations.jsx - Show time slot availability and user-specific reservations
- [ ] Update OrderManagement.tsx - Replace mock data with real API calls to admin endpoints

## Testing
- [x] Test integration - Verify frontend-backend communication works properly
- [ ] Test payment portal CRUD operations
- [ ] Test cash on delivery option
- [ ] Test invoice generation and download
- [ ] Test reservation time slot availability
- [ ] Test role-based admin privileges

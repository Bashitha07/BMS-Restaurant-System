# Task: Enable Admin to View Customer Order Details

## Current Status
- [x] Analyzed frontend OrderManagement.jsx - UI exists but needs data transformation for real backend response.
- [x] Verified and updated backend AdminController - GET /admin/orders exists, added PUT /admin/orders/{id}/status.
- [x] Verified OrderService - getAllOrders() provides detailed DTOs.
- [x] Verified adminService.js - Calls correct endpoints.
- [x] Verified OrderDTO - Contains all required fields (user details, items, etc.).
- [x] Transform backend data in OrderManagement.jsx to match UI structure.
- [x] Add updateOrderStatus endpoint in AdminController.java.
- [ ] Test integration: Load real orders in admin UI, verify details display correctly.
- [ ] Seed sample orders if needed via DataInitializer.
- [ ] Confirm admin role access in SecurityConfig.

## Next Steps
1. Edit OrderManagement.jsx to transform OrderDTO to UI format.
2. Run servers and test admin order view.

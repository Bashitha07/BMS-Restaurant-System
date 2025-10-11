This folder contains PlantUML use-case diagrams split by functional area.

Files:
- login_usecases.puml - login, register, password reset, 2FA
- menu_browsing_usecases.puml - browsing, filtering, item details, favorites
- ordering_reservations_usecases.puml - cart, checkout, order tracking, reservations
- payment_portal_usecases.puml - payment gateway integration, manual slips, refunds

How to render:
- Install PlantUML or use an online renderer (e.g. plantuml.com/plantuml)
- From the project root:
  - java -jar plantuml.jar docs/usecases/*.puml
- Or open in VS Code with PlantUML extension and press "Preview" or "Export PNG/SVG"

Mapping to code (quick pointers):
- Authentication: src/main/java/com/bms/restaurant_system/entity/User.java, UserService, UserController
- Menu: frontend/src/components/menu, backend MenuController / MenuService
- Orders: backend OrderController / OrderService, frontend CartSidebar, OrderForm
- Payment: backend paymentService, frontend PaymentPortal
- Reservations: ReservationController, ReservationService, ReservationForm

If you want, I can render PNGs of each diagram and commit them into the docs folder.

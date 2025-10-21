# Documentation

This directory contains all documentation and diagrams for the Restaurant Management System.

## Directory Structure

### `/diagrams`
Contains all PlantUML (`.puml`) diagram files for system architecture and design:

#### Database Diagrams
- `Database_ER_Diagram.puml` - Detailed Entity-Relationship diagram with all field specifications
- `Database_ER_Diagram_Simple.puml` - Simplified ER diagram for presentations

#### System Architecture
- `Restaurant_System_Class_Diagram.puml` - Complete system class diagram
- `BMS_Restaurant_System_Class_Diagram.puml` - BMS-specific class diagram
- `Restaurant_System_Use_Case_Diagram.puml` - Overall use case diagram
- `Restaurant_System_Activity_Diagrams.puml` - Complete activity diagrams

#### Feature-Specific Diagrams

**Login & Registration**
- `Login_Register_Use_Cases.puml` - Use cases for authentication
- `Login_Registration_Activity.puml` - Activity flow for login/registration

**Menu Handling**
- `Menu_Handling_Use_Cases.puml` - Use cases for menu management
- `Menu_Handling_Activity.puml` - Activity flow for menu operations

**Ordering & Reservations**
- `Ordering_Reservations_Use_Cases.puml` - Use cases for orders and reservations
- `Ordering_Reservations_Activity.puml` - Activity flow for ordering process

**Payment Portal**
- `Payment_Portal_Use_Cases.puml` - Use cases for payment processing
- `Payment_Portal_Activity.puml` - Activity flow for payment operations

## Viewing Diagrams

### VS Code (Recommended)
1. Install the **PlantUML** extension by jebbs
2. Open any `.puml` file
3. Press `Alt + D` to preview the diagram

### Online
1. Visit [PlantUML Online Server](http://www.plantuml.com/plantuml/uml/)
2. Copy and paste the diagram code
3. View the rendered diagram

### Command Line
```bash
# Install PlantUML
# On Windows with Chocolatey:
choco install plantuml

# Generate PNG from PUML file:
plantuml diagram.puml

# Generate SVG:
plantuml -tsvg diagram.puml
```

## Contributing

When adding new diagrams:
1. Use descriptive filenames following the pattern: `Feature_DiagramType.puml`
2. Add a header comment in the file explaining its purpose
3. Update this README with the new diagram description
4. Keep diagrams in sync with actual implementation

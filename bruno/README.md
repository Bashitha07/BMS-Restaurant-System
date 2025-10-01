# Restaurant System API Testing with Bruno

This directory contains Bruno API test collections for testing the Restaurant System backend.

## What is Bruno?

Bruno is a modern, lightweight API testing tool that runs as a VS Code extension. It provides:
- Fast and lightweight API testing
- No cloud dependency
- Beautiful and intuitive UI
- Environment and collection management
- Scriptable tests with JavaScript

## Installation

1. Install the Bruno extension in VS Code:
   - Search for "Bruno" in VS Code extensions
   - Install "Bruno" by UseBruno

2. Reload VS Code after installation

## Getting Started

1. Open the `bruno/restaurant-api-collection` folder in VS Code
2. You should see the Bruno collection in the explorer
3. Make sure your Spring Boot application is running on `http://localhost:8080`
4. Start testing the endpoints!

## Available Tests

### Menu Endpoints
- **Get All Menus** - Retrieve all menu items
- **Get Available Menus** - Get only available menu items
- **Get Menus by Category** - Filter menus by category (Pizza, Salads, etc.)
- **Create Menu** - Add a new menu item (Admin only)

### User Endpoints
- **Register User** - Create a new user account
- **Login User** - Authenticate and get JWT token

## Running Tests

1. Click on any `.bru` file in the collection
2. Click the "Run" button in the Bruno interface
3. View the response and test results

## Environment Variables

The collection uses these variables:
- `baseUrl`: http://localhost:8080
- `testUsername`: testuser
- `testPassword`: testpass123

## Test Structure

Each test file contains:
- **Request configuration** (method, URL, headers, body)
- **Variables** for dynamic values
- **Test assertions** using JavaScript

## Example Test Output

```
✓ status code is 200
✓ response has menus array
✓ each menu has required fields
```

## Tips

1. **Authentication**: Some endpoints require JWT tokens. Run the login test first to get a token.
2. **Variables**: Use `{{variableName}}` syntax for dynamic values
3. **Scripts**: Add custom JavaScript logic in the `tests` section
4. **Environments**: Create different environments for dev/staging/production

## Troubleshooting

1. **Connection refused**: Make sure the Spring Boot app is running on port 8080
2. **Authentication errors**: Check if your JWT token is valid
3. **Test failures**: Review the response data and adjust assertions accordingly

## Next Steps

1. Run all tests to ensure API functionality
2. Create additional test cases for edge cases
3. Set up different environments (dev, staging, prod)
4. Add performance tests for high-load scenarios

Happy testing! 🚀

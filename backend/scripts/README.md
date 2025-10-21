# Scripts

This directory contains all executable scripts for the Restaurant Management System.

## PowerShell Scripts (`.ps1`)

### Development Scripts

**`start-backend.ps1`**
- Starts the Spring Boot backend server
- Runs on port 8084
- Usage: `.\start-backend.ps1`

**`start-frontend.ps1`**
- Starts the React frontend development server
- Runs on port 5173 (Vite default)
- Usage: `.\start-frontend.ps1`

### Testing Scripts

**`run-all-tests.ps1`**
- Executes all Maven test suites
- Generates test reports
- Usage: `.\run-all-tests.ps1`

**`test-jwt-config.ps1`**
- Tests JWT configuration and token generation
- Validates authentication setup
- Usage: `.\test-jwt-config.ps1`

## Bash Scripts (`.sh`)

**`start-servers.sh`**
- Starts both backend and frontend servers (Linux/Mac)
- Runs servers in parallel
- Usage: `./start-servers.sh`

## Batch Scripts (`.bat`)

**`start-servers.bat`**
- Starts both backend and frontend servers (Windows)
- Opens separate command windows for each server
- Usage: `start-servers.bat`

## Prerequisites

### For PowerShell Scripts
- PowerShell 5.1 or higher
- Java 24+ installed
- Node.js 18+ installed (for frontend scripts)
- Maven installed

### For Bash Scripts
- Bash shell (Linux/Mac/WSL)
- Java 24+ installed
- Node.js 18+ installed
- Maven installed

### For Batch Scripts
- Windows Command Prompt
- Java 24+ installed
- Node.js 18+ installed
- Maven installed

## Script Execution Policy (Windows)

If you encounter execution policy errors with PowerShell scripts:

```powershell
# Check current policy
Get-ExecutionPolicy

# Set policy to allow local scripts (Run as Administrator)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Or run a single script bypassing policy
PowerShell -ExecutionPolicy Bypass -File .\script-name.ps1
```

## Making Scripts Executable (Linux/Mac)

```bash
# Make script executable
chmod +x start-servers.sh

# Run script
./start-servers.sh
```

## Troubleshooting

### Backend won't start
- Check if port 8084 is already in use
- Verify MySQL is running on port 3306
- Check `application.properties` configuration

### Frontend won't start
- Check if port 5173 is already in use
- Run `npm install` in frontend directory
- Check Node.js version compatibility

### Tests fail
- Ensure MySQL test database `restaurant_db_test` is accessible
- Check database credentials in `application-test.properties`
- Run `mvn clean` before testing

## Adding New Scripts

When adding new scripts:
1. Use descriptive names following the pattern: `action-target.ext`
2. Add error handling and user feedback
3. Document the script purpose and usage in this README
4. Test on all target platforms (Windows/Linux/Mac)

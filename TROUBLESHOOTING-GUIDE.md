# 🚨 TROUBLESHOOTING GUIDE - Complete System Diagnosis

## 📊 Current Problems Detected

### **CRITICAL ISSUE: Git Merge Conflicts**
**Status:** 🔴 **BLOCKING** - 70+ files in conflict  
**Impact:** Cannot push to GitHub, backend might not start  
**Priority:** **HIGHEST** - Must resolve first

---

## 🔍 Problem Analysis

### **Issue #1: Git Merge Conflict**

**What Happened:**
- You ran: `git pull origin main`
- Remote repository deleted many files
- Your local repository has those files modified
- Git cannot automatically merge → **CONFLICT**

**Affected Files (70+):**
- `database-setup.sql` - Your simplified schema
- Frontend files (AppRouter.jsx, components, pages, services)
- Backend files (controllers, entities, DTOs, services, configs)
- Configuration files (pom.xml, application.properties)
- Scripts (start-servers.bat, start-servers.sh)

**Result:**
- ❌ Cannot push to GitHub
- ❌ Files are in conflicted state
- ⚠️ Backend might fail to start
- ⚠️ Frontend might not work

---

## ✅ SOLUTION OPTIONS

### **OPTION 1: Keep ALL Your Local Changes (RECOMMENDED)**

This will keep all your simplified schema work and discard remote changes.

```powershell
# Navigate to project
cd C:\SpringBoot\restaurant-system

# Abort current merge
git merge --abort

# Force push your local changes (overwrites remote)
git push origin main --force

# Verification
git status
```

**When to use:** 
- ✅ You want to keep your simplified database schema
- ✅ You want to keep all your local work
- ✅ You are the main developer (can overwrite remote)

---

### **OPTION 2: Accept ALL Your Local Changes (Alternative)**

This resolves conflicts by keeping your version of all files.

```powershell
# Keep your version of all conflicted files
git checkout --ours .

# Add all resolved files
git add .

# Complete the merge
git commit -m "Resolve merge conflicts - keep local simplified schema"

# Push to GitHub
git push origin main
```

**When to use:**
- ✅ You want to keep your changes
- ✅ You want to preserve merge history
- ✅ You're working with a team

---

### **OPTION 3: Start Fresh from Remote (NOT RECOMMENDED)**

This will DELETE all your local changes and use remote version.

```powershell
# ⚠️ WARNING: This deletes ALL your local work!

# Reset to remote state
git fetch origin
git reset --hard origin/main

# Clean untracked files
git clean -fd
```

**When to use:**
- ❌ **NOT RECOMMENDED** - You'll lose all simplified schema work
- Only if you have backups elsewhere

---

## 🚀 RECOMMENDED FIX (Step-by-Step)

### **Step 1: Abort Current Merge**
```powershell
cd C:\SpringBoot\restaurant-system
git merge --abort
```

### **Step 2: Verify Status**
```powershell
git status
```
Expected: "On branch main, Your branch is ahead of 'origin/main'"

### **Step 3: Force Push Your Changes**
```powershell
# This overwrites remote with your local changes
git push origin main --force
```

### **Step 4: Verify Push Success**
```powershell
git status
```
Expected: "Your branch is up to date with 'origin/main'"

### **Step 5: Verify Files**
```powershell
# Check database-setup.sql exists and has simplified schema
cat database-setup.sql | Select-String -Pattern "21 fields"

# Check backend builds
mvn clean compile
```

---

## 🔧 Additional Problems to Check

### **Problem #2: Backend Not Starting**

**Check:**
```powershell
# Try to compile
mvn clean compile

# Check for errors
mvn verify
```

**Common Issues:**
- Entity classes don't match simplified database
- DTOs have wrong field counts
- Tests expect old schema

**Fix:**
- Update entities to match 21-field menu schema
- Update MenuDTO to have 21 fields
- Update tests with new schema

---

### **Problem #3: Database Schema Mismatch**

**Check:**
```sql
-- Connect to database
mysql -u root -p restaurant_db

-- Count menu fields
SELECT COUNT(*) FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'restaurant_db' AND TABLE_NAME = 'menus';
-- Should be: 21

-- Check for calories/allergens
SELECT COLUMN_NAME FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'restaurant_db' AND TABLE_NAME = 'menus' 
AND COLUMN_NAME IN ('calories', 'allergens');
-- Should be: 0 rows
```

**Fix:**
```powershell
# Reinstall simplified database
mysql -u root -p -e "DROP DATABASE IF EXISTS restaurant_db;"
mysql -u root -p < database-setup.sql
```

---

### **Problem #4: Maven Build Issues**

**Check:**
```powershell
mvn clean compile
```

**Common Errors:**
- Compilation errors in entities
- Missing dependencies
- Test failures

**Fix:**
```powershell
# Skip tests and build
mvn clean install -DskipTests

# Or clean target directory
Remove-Item -Path "target" -Recurse -Force
mvn clean install
```

---

### **Problem #5: Frontend Build Issues**

**Check:**
```powershell
cd frontend
npm run build
```

**Common Errors:**
- Missing node_modules
- API endpoint mismatches
- Component import errors

**Fix:**
```powershell
cd frontend

# Reinstall dependencies
Remove-Item -Path "node_modules" -Recurse -Force
npm install

# Check for build errors
npm run build
```

---

## 📋 Complete Troubleshooting Checklist

### **1. Git Conflicts** 🔴 **CRITICAL**
```powershell
# Check status
git status

# Fix: Abort and force push
git merge --abort
git push origin main --force
```
- [ ] Merge conflicts resolved
- [ ] Pushed to GitHub successfully
- [ ] No conflicted files in `git status`

### **2. Database Schema** 🟡 **HIGH PRIORITY**
```powershell
# Reinstall database
mysql -u root -p < database-setup.sql
mysql -u root -p restaurant_db < verify-database.sql
```
- [ ] Database installed successfully
- [ ] Menus table has 21 fields
- [ ] NO calories or allergens fields
- [ ] All 10 tables exist

### **3. Backend Compilation** 🟡 **HIGH PRIORITY**
```powershell
mvn clean compile
```
- [ ] No compilation errors
- [ ] All entities match database
- [ ] MenuDTO has 21 fields
- [ ] Tests pass (or skip with -DskipTests)

### **4. Backend Startup** 🟢 **MEDIUM**
```powershell
mvn spring-boot:run
```
- [ ] Backend starts on port 8084
- [ ] No errors in console
- [ ] Database connection successful
- [ ] API endpoints accessible

### **5. Frontend Build** 🟢 **MEDIUM**
```powershell
cd frontend
npm run dev
```
- [ ] Frontend starts on port 5176
- [ ] No build errors
- [ ] Can access http://localhost:5176
- [ ] API calls work

### **6. API Testing** 🟢 **LOW**
```powershell
# Test with Bruno or PowerShell
Invoke-WebRequest -Uri "http://localhost:8084/api/menu" -UseBasicParsing
```
- [ ] API responds
- [ ] MenuDTO returns 21 fields
- [ ] NO calories or allergens in response
- [ ] CORS working

---

## 🆘 Emergency Commands

### **If Everything Breaks:**
```powershell
# 1. Save your work
cd C:\SpringBoot\restaurant-system
Copy-Item database-setup.sql C:\Backup\database-setup.sql

# 2. Reset to known good state
git fetch origin
git reset --hard HEAD~1

# 3. Re-apply database changes
Copy-Item C:\Backup\database-setup.sql database-setup.sql

# 4. Commit and force push
git add database-setup.sql
git commit -m "Restore simplified database schema"
git push origin main --force
```

### **If Database is Corrupted:**
```powershell
# Drop and recreate
mysql -u root -p -e "DROP DATABASE IF EXISTS restaurant_db;"
mysql -u root -p < database-setup.sql
mysql -u root -p restaurant_db < verify-database.sql
```

### **If Backend Won't Start:**
```powershell
# Clean everything
mvn clean
Remove-Item -Path "target" -Recurse -Force

# Rebuild
mvn clean install -DskipTests

# Start
mvn spring-boot:run
```

### **If Frontend Won't Build:**
```powershell
cd frontend
Remove-Item -Path "node_modules" -Recurse -Force
Remove-Item -Path "package-lock.json" -Force
npm install
npm run dev
```

---

## 📞 Quick Diagnostic Commands

### **System Status Check:**
```powershell
# Git status
git status

# Database status
mysql -u root -p -e "SHOW DATABASES LIKE 'restaurant_db';"

# Backend status
netstat -ano | findstr :8084

# Frontend status
netstat -ano | findstr :5176

# Maven version
mvn -v

# Node version
node -v
```

### **Health Check:**
```powershell
# Backend health
Invoke-WebRequest -Uri "http://localhost:8084/api/menu" -UseBasicParsing

# Frontend health
Invoke-WebRequest -Uri "http://localhost:5176" -UseBasicParsing
```

---

## 🎯 Priority Order

1. **🔴 CRITICAL:** Fix Git conflicts (OPTION 1 recommended)
2. **🟡 HIGH:** Verify database schema (21 fields in menus)
3. **🟡 HIGH:** Compile backend (mvn clean compile)
4. **🟢 MEDIUM:** Start backend (mvn spring-boot:run)
5. **🟢 MEDIUM:** Start frontend (npm run dev)
6. **🟢 LOW:** Run tests (Bruno API tests)

---

## ✅ Success Criteria

**All problems resolved when:**
- ✅ `git status` shows: "Your branch is up to date"
- ✅ `git push origin main` succeeds
- ✅ Database has 21 fields in menus (NO calories, NO allergens)
- ✅ `mvn clean compile` succeeds
- ✅ Backend starts on port 8084
- ✅ Frontend starts on port 5176
- ✅ API returns MenuDTO with 21 fields
- ✅ Bruno tests pass

---

## 📖 Related Documentation

- **Git Conflicts:** This file (current)
- **Database Setup:** database-setup.sql
- **Database Verification:** verify-database.sql
- **Update Queries:** database-update-queries.sql
- **Migration Guide:** DATABASE-MIGRATION-GUIDE.md
- **Testing Guide:** TESTING-COMPLETE-GUIDE.md

---

**Last Updated:** October 19, 2025  
**Issue:** Git merge conflicts + 70 files  
**Status:** Awaiting resolution  
**Recommended Action:** Use OPTION 1 (Force push local changes)

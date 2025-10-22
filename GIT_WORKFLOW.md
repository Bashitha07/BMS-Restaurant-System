# Professional Git Workflow for Spring Boot Project

## 🔄 Standard Development Cycle

### 1. **Before Starting Work**
```bash
# Ensure you're on the main branch
git checkout main

# Pull latest changes
git pull origin main

# Create feature branch (recommended)
git checkout -b feature/menu-improvements
```

### 2. **During Development**
```bash
# Check what files changed
git status

# Review changes
git diff

# Stage specific files (NEVER use 'git add .')
git add backend/src/main/java/com/bms/restaurant_system/controller/MenuController.java
git add frontend/src/components/Menu.jsx

# Verify what's staged
git status
git diff --staged
```

### 3. **Committing Changes**
```bash
# Commit with meaningful message following conventional commits
git commit -m "feat: Add menu filtering by category"

# Or for bug fixes
git commit -m "fix: Resolve menu availability sync issue"
```

### 4. **Before Pushing**
```bash
# Pull latest changes and rebase
git pull origin main --rebase

# Resolve conflicts if any, then
git add <resolved-files>
git rebase --continue

# Run tests (IMPORTANT for Spring Boot)
cd backend
./mvnw clean test

# Run frontend tests
cd frontend
npm test
```

### 5. **Pushing to Remote**
```bash
# Push feature branch
git push origin feature/menu-improvements

# Or push to main (after PR approval)
git checkout main
git merge feature/menu-improvements
git push origin main
```

## 📝 Commit Message Convention

### Format:
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples:
```bash
git commit -m "feat(menu): Add real-time menu availability sync"
git commit -m "fix(auth): Resolve JWT token expiration issue"
git commit -m "refactor(user): Extract user service into separate module"
git commit -m "docs(api): Update API endpoint documentation"
git commit -m "test(order): Add integration tests for order controller"
git commit -m "chore(deps): Update Spring Boot to 3.5.6"
```

## 🌿 Branch Strategy

### Main Branches:
- `main` - Production-ready code
- `develop` - Development branch (optional)

### Feature Branches:
```bash
feature/user-authentication
feature/menu-management
feature/order-tracking
bugfix/login-validation
hotfix/payment-error
```

### Workflow:
```bash
# Create feature branch from main
git checkout main
git pull origin main
git checkout -b feature/new-feature

# Work on feature, commit regularly
git add <files>
git commit -m "feat: Description"

# Keep branch updated
git fetch origin
git rebase origin/main

# Push feature branch
git push origin feature/new-feature

# Create Pull Request on GitHub
# After PR approval, merge to main
git checkout main
git pull origin main
git merge --no-ff feature/new-feature
git push origin main

# Delete feature branch
git branch -d feature/new-feature
git push origin --delete feature/new-feature
```

## 🚫 What NOT to Commit

Already configured in `.gitignore`:
- ✅ `target/` - Maven build output
- ✅ `node_modules/` - Node dependencies
- ✅ `.env` files - Environment variables
- ✅ IDE files - IntelliJ, Eclipse settings
- ✅ Logs and temporary files

### Files TO Commit:
- ✅ Source code (`.java`, `.jsx`, `.tsx`)
- ✅ Configuration templates
- ✅ Documentation (`.md` files)
- ✅ Database schemas (`schema.sql`, migrations)
- ✅ VS Code settings (`.vscode/settings.json`)
- ✅ Package files (`pom.xml`, `package.json`)

## 🔍 Pre-Push Checklist

```bash
# 1. Run backend tests
cd backend
./mvnw clean test

# 2. Build backend
./mvnw clean package

# 3. Check frontend
cd ../frontend
npm run lint
npm test
npm run build

# 4. Verify no sensitive data
git diff --staged | grep -i "password\|secret\|key\|token"

# 5. Check commit message
git log -1 --pretty=%B

# 6. Push
git push origin <branch-name>
```

## 🛠️ Useful Git Commands

### Undo Changes:
```bash
# Unstage file
git restore --staged <file>

# Discard local changes
git restore <file>

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1
```

### View History:
```bash
# View commit history
git log --oneline --graph --all

# View file history
git log --follow <file>

# View changes in commit
git show <commit-hash>
```

### Branch Management:
```bash
# List all branches
git branch -a

# Delete local branch
git branch -d <branch-name>

# Delete remote branch
git push origin --delete <branch-name>

# Rename branch
git branch -m old-name new-name
```

### Stash Changes:
```bash
# Save changes temporarily
git stash save "Work in progress on menu feature"

# List stashes
git stash list

# Apply stash
git stash apply stash@{0}

# Apply and remove stash
git stash pop
```

## 🤝 Team Collaboration

### Pull Request Guidelines:
1. **Title**: Clear, descriptive (e.g., "Add menu availability toggle")
2. **Description**: 
   - What changed?
   - Why was it changed?
   - How to test?
3. **Screenshots**: For UI changes
4. **Tests**: Ensure all tests pass
5. **Review**: Request review from team members

### Code Review Checklist:
- ✅ Code follows project conventions
- ✅ No hardcoded credentials or sensitive data
- ✅ Tests added/updated
- ✅ Documentation updated
- ✅ No console.log() or debug statements
- ✅ Backend builds successfully
- ✅ Frontend runs without errors

## 🔐 Security Best Practices

### Never Commit:
```bash
# Database credentials
spring.datasource.password=actual_password

# API keys
STRIPE_SECRET_KEY=sk_live_...

# JWT secrets
jwt.secret=actual_secret_key

# AWS credentials
AWS_ACCESS_KEY_ID=AKIA...
```

### Use Environment Variables:
```properties
# application.properties
spring.datasource.password=${DB_PASSWORD:}
jwt.secret=${JWT_SECRET:}
```

## 📊 Project-Specific Commands

### For Your Restaurant System:

```bash
# Full project commit workflow
cd c:\SpringBoot\restaurant-system

# Check backend changes
git status backend/

# Check frontend changes
git status frontend/

# Stage backend changes
git add backend/src/main/java/com/bms/restaurant_system/

# Stage frontend changes
git add frontend/src/

# Commit both
git commit -m "feat: Implement menu availability toggle feature"

# Test before push
cd backend; ./mvnw test; cd ..
cd frontend; npm test; cd ..

# Push
git push origin main
```

### Quick Commands:
```bash
# View recent changes
git log --oneline -10

# See what will be pushed
git diff origin/main..HEAD

# Check branch status
git status -sb
```

## 🎯 Current Project Status

**Repository**: BMS-Restaurant-System  
**Owner**: Bashitha07  
**Branch**: main  
**Structure**:
- `backend/` - Spring Boot application
- `frontend/` - React + Vite application
- `DATABASE_FRONTEND_MAPPING.md` - API documentation
- `README.md` - Project documentation

**Recent Commits**:
1. `0d87e43` - Fix: Menu tab displays items from MySQL
2. `51b8fa3` - Fix: Menu availability toggle sync

---

## 💡 Pro Tips

1. **Commit Often**: Small, focused commits are better than large ones
2. **Pull Before Push**: Always `git pull --rebase` before pushing
3. **Test Locally**: Run tests before every commit
4. **Write Good Messages**: Future you will thank you
5. **Use Branches**: Never commit directly to main in team projects
6. **Review Changes**: Always `git diff` before committing
7. **Clean History**: Use `git rebase -i` to clean up commits before PR
8. **Backup Work**: Push to remote regularly

---

**Last Updated**: October 22, 2025

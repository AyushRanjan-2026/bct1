# Fix Backend Errors - Step by Step

## Issues Found:
1. **Missing dependencies** - `express` package not found
2. **Node.js v22 compatibility** - Veramo packages have issues with Node.js v22

## Solution:

### Option 1: Use Node.js 20 (Recommended)

Node.js v22 has compatibility issues with Veramo. Use Node.js 20 instead.

#### Install Node Version Manager (nvm) if not installed:
```bash
# macOS/Linux
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart terminal or run:
source ~/.zshrc
```

#### Install and use Node.js 20:
```bash
nvm install 20
nvm use 20
node --version  # Should show v20.x.x
```

### Option 2: Fix Dependencies (If staying on Node 22)

If you must use Node 22, we need to reinstall dependencies:

```bash
cd /Users/ayushranjan/Desktop/bct1/backend
rm -rf node_modules package-lock.json
npm install
```

---

## Complete Fix Commands:

### Step 1: Install Dependencies
```bash
cd /Users/ayushranjan/Desktop/bct1/backend
npm install
```

### Step 2: Verify Node Version (should be 18-20)
```bash
node --version
# If it shows v22, switch to v20:
nvm use 20
# Or install nvm first, then:
nvm install 20
nvm use 20
```

### Step 3: Clean and Reinstall (if errors persist)
```bash
cd /Users/ayushranjan/Desktop/bct1/backend
rm -rf node_modules package-lock.json
npm install
```

### Step 4: Test Backend
```bash
cd /Users/ayushranjan/Desktop/bct1/backend
npm start
```

---

## Quick Fix Script:

Run this to fix everything:

```bash
cd /Users/ayushranjan/Desktop/bct1/backend

# Remove old dependencies
rm -rf node_modules package-lock.json

# Install fresh
npm install

# If using nvm, ensure Node 20
if command -v nvm &> /dev/null; then
    nvm use 20 || nvm install 20
fi

# Test
npm start
```


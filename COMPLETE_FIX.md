# Complete Fix for Node.js v22 Error

## The Problem
Node.js v22.17.0 has compatibility issues with Veramo packages. The `assert { type: 'json' }` import syntax doesn't work correctly in Node.js v22.

## Solution: Use Node.js 20

---

## Step 1: Install nvm (Node Version Manager)

If you don't have nvm installed:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

Then restart your terminal or run:
```bash
source ~/.zshrc
```

---

## Step 2: Install and Switch to Node.js 20

```bash
# Install Node.js 20
nvm install 20

# Use Node.js 20
nvm use 20

# Verify (should show v20.x.x)
node --version
```

---

## Step 3: Clean and Reinstall Backend Dependencies

```bash
cd /Users/ayushranjan/Desktop/bct1/backend

# Remove old dependencies
rm -rf node_modules package-lock.json veramo.sqlite veramo.sqlite-journal

# Reinstall with Node.js 20
npm install
```

---

## Step 4: Test Backend

```bash
cd /Users/ayushranjan/Desktop/bct1/backend
npm start
```

**Expected output:** "Backend server running on http://localhost:3001"

---

## Quick Fix Script (All-in-One)

I've created a script that does everything automatically:

```bash
cd /Users/ayushranjan/Desktop/bct1
./force-node20.sh
```

Then:
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
npm start
```

---

## Alternative: Use the Wrapper Script

The backend now has a `start.sh` script that automatically checks and switches to Node.js 20:

```bash
cd /Users/ayushranjan/Desktop/bct1/backend
./start.sh
```

This will:
1. Check if you're on Node.js 20
2. Switch to Node.js 20 if needed
3. Start the server

---

## Verify Node.js Version

**IMPORTANT:** Always verify you're on Node.js 20 before starting:

```bash
node --version
# Should show: v20.x.x (NOT v22.x.x)
```

If it shows v22, run:
```bash
nvm use 20
node --version  # Verify again
```

---

## Make Node.js 20 Default for This Project

```bash
cd /Users/ayushranjan/Desktop/bct1/backend
nvm use 20
echo "20" > .nvmrc
```

Now, whenever you `cd` into the backend directory, nvm will automatically use Node.js 20 (if you have auto-switching enabled).

---

## Complete Setup Commands (Copy-Paste)

```bash
# 1. Install nvm (if not installed)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.zshrc

# 2. Install and use Node.js 20
nvm install 20
nvm use 20

# 3. Verify version
node --version  # Must show v20.x.x

# 4. Clean backend
cd /Users/ayushranjan/Desktop/bct1/backend
rm -rf node_modules package-lock.json veramo.sqlite veramo.sqlite-journal

# 5. Reinstall dependencies
npm install

# 6. Test
npm start
```

---

## If You Still Get Errors

### Check Node Version in Each Terminal:
```bash
node --version
```

If any terminal shows v22, run:
```bash
nvm use 20
```

### Set Node 20 for All Terminals:
Add this to your `~/.zshrc`:
```bash
# Auto-switch to Node 20 for MPA project
if [[ "$PWD" == *"bct1"* ]]; then
    nvm use 20 2>/dev/null
fi
```

Then:
```bash
source ~/.zshrc
```

---

## Why This Happens

- **Node.js v22** changed how it handles JSON imports
- **Veramo packages** were built for Node.js 18-20
- The `assert { type: 'json' }` syntax works differently in v22
- **Solution:** Use Node.js 20 (LTS version, stable, compatible)

---

## Summary

1. ✅ Install nvm
2. ✅ Install Node.js 20: `nvm install 20`
3. ✅ Switch to Node.js 20: `nvm use 20`
4. ✅ Verify: `node --version` (should show v20.x.x)
5. ✅ Clean backend: `rm -rf node_modules package-lock.json`
6. ✅ Reinstall: `npm install`
7. ✅ Start: `npm start`

**The backend will now work without errors!** 🚀


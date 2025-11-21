# Final Corrected Commands - Error-Free Setup

## ⚠️ CRITICAL: You MUST use Node.js 20 (NOT 22)

The error you're seeing is because Node.js v22 is incompatible with Veramo.

---

## Step 1: Fix Node.js Version (REQUIRED)

### Install nvm (if not installed):
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.zshrc
```

### Switch to Node.js 20:
```bash
nvm install 20
nvm use 20
node --version  # MUST show v20.x.x (NOT v22.x.x)
```

**⚠️ IMPORTANT:** If `node --version` still shows v22, you need to:
1. Close and reopen your terminal
2. Run `nvm use 20` again
3. Verify with `node --version`

---

## Step 2: Clean and Reinstall Backend

```bash
cd /Users/ayushranjan/Desktop/bct1/backend
rm -rf node_modules package-lock.json veramo.sqlite veramo.sqlite-journal
npm install
```

---

## Step 3: Start All Services

### Terminal 1: IPFS
```bash
ipfs daemon
```
**Wait for:** "Daemon is ready"

### Terminal 2: Hardhat Node
```bash
cd /Users/ayushranjan/Desktop/bct1
nvm use 20  # Ensure Node 20
npm run node
```
**Wait for:** "Started HTTP and WebSocket JSON-RPC server"
**Keep running!**

### Terminal 3: Deploy Contracts
```bash
cd /Users/ayushranjan/Desktop/bct1
nvm use 20  # Ensure Node 20
npm run deploy
```
**Wait for:** "Deployment addresses saved to deployments.json"

### Terminal 4: Backend
```bash
cd /Users/ayushranjan/Desktop/bct1/backend
nvm use 20  # Ensure Node 20
npm start
```
**Wait for:** "Backend server running on http://localhost:3001"

### Terminal 5: Frontend
```bash
cd /Users/ayushranjan/Desktop/bct1/frontend
npm run dev
```
**Wait for:** "Local: http://localhost:5173"

---

## Quick Fix Script

Run this to fix everything:

```bash
# Run the automated fix
cd /Users/ayushranjan/Desktop/bct1
./force-node20.sh

# Then clean and reinstall backend
cd backend
rm -rf node_modules package-lock.json
npm install
npm start
```

---

## Verification Checklist

Before starting services, verify:

✅ **Node.js version is 20:**
```bash
node --version
# Must show: v20.x.x
```

✅ **Backend dependencies installed:**
```bash
cd /Users/ayushranjan/Desktop/bct1/backend
ls node_modules | head -5
# Should show directories like: @veramo, express, etc.
```

✅ **Contracts deployed:**
```bash
cat /Users/ayushranjan/Desktop/bct1/deployments.json
# Should show contract addresses
```

---

## If Backend Still Errors

### Check Node version in that terminal:
```bash
node --version
```

### If it shows v22:
```bash
nvm use 20
node --version  # Verify it's now v20
cd /Users/ayushranjan/Desktop/bct1/backend
npm start
```

### If dependencies are missing:
```bash
cd /Users/ayushranjan/Desktop/bct1/backend
rm -rf node_modules package-lock.json
npm install
npm start
```

---

## Complete Setup (One-Time)

```bash
# 1. Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.zshrc

# 2. Install Node.js 20
nvm install 20
nvm use 20

# 3. Verify (CRITICAL - must show v20)
node --version

# 4. Install all dependencies
cd /Users/ayushranjan/Desktop/bct1
npm install

cd backend
rm -rf node_modules package-lock.json
npm install

cd ../frontend
npm install

# 5. Test backend
cd ../backend
npm start
```

---

## Why This Error Happens

- **Node.js v22** changed JSON import handling
- **Veramo v5** was built for Node.js 18-20
- The `assert { type: 'json' }` syntax fails in v22
- **Solution:** Use Node.js 20 (LTS, stable, compatible)

---

## Make Node.js 20 Default

To avoid switching every time:

```bash
# Set Node 20 as default
nvm alias default 20

# Or for this project only
cd /Users/ayushranjan/Desktop/bct1/backend
nvm use 20
echo "20" > .nvmrc
```

---

## Summary

**The ONLY way to fix this error is to use Node.js 20 instead of Node.js 22.**

1. ✅ Install nvm
2. ✅ `nvm install 20`
3. ✅ `nvm use 20`
4. ✅ Verify: `node --version` shows v20.x.x
5. ✅ Clean backend: `rm -rf node_modules package-lock.json`
6. ✅ Reinstall: `npm install`
7. ✅ Start: `npm start`

**The backend will work perfectly!** 🎉


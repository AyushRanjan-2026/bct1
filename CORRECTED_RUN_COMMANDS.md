# Corrected Commands to Run Project (Error-Free)

## ⚠️ IMPORTANT: Node.js Version Issue

**Problem**: Node.js v22 has compatibility issues with Veramo packages.

**Solution**: Use Node.js v18 or v20.

---

## Step 1: Fix Node.js Version

### Check Current Version:
```bash
node --version
```

### If you see v22.x.x, switch to v20:

#### Install nvm (Node Version Manager) if needed:
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.zshrc
```

#### Install and use Node.js 20:
```bash
nvm install 20
nvm use 20
node --version  # Should show v20.x.x
```

---

## Step 2: Install All Dependencies

### Root Directory:
```bash
cd /Users/ayushranjan/Desktop/bct1
npm install
```

### Backend (Fix dependencies):
```bash
cd /Users/ayushranjan/Desktop/bct1/backend
rm -rf node_modules package-lock.json
npm install
```

### Frontend:
```bash
cd /Users/ayushranjan/Desktop/bct1/frontend
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
npm run node
```
**Wait for:** "Started HTTP and WebSocket JSON-RPC server"
**Keep running!**

### Terminal 3: Deploy Contracts
```bash
cd /Users/ayushranjan/Desktop/bct1
npm run deploy
```
**Wait for:** "Deployment addresses saved to deployments.json"

### Terminal 4: Backend
```bash
cd /Users/ayushranjan/Desktop/bct1/backend
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

## Complete One-Time Setup Script

Copy and paste this entire block:

```bash
# Fix Node.js version
if command -v nvm &> /dev/null; then
    echo "Switching to Node.js 20..."
    nvm install 20
    nvm use 20
else
    echo "⚠️  nvm not found. Please install nvm first:"
    echo "curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
    exit 1
fi

# Verify Node version
node --version

# Install root dependencies
cd /Users/ayushranjan/Desktop/bct1
npm install

# Install backend dependencies (clean install)
cd backend
rm -rf node_modules package-lock.json
npm install

# Install frontend dependencies
cd ../frontend
npm install

echo "✅ All dependencies installed!"
echo "Now start services using the commands in Step 3"
```

---

## Quick Verification

After starting all services, verify:

```bash
# Check backend
curl http://localhost:3001/health
# Should return: {"status":"ok","timestamp":"..."}

# Check IPFS
curl http://127.0.0.1:5001/api/v0/version
# Should return: {"Version":"...","Commit":"..."}

# Check frontend
# Open: http://localhost:5173
```

---

## If Backend Still Errors

### Clean everything and reinstall:
```bash
cd /Users/ayushranjan/Desktop/bct1/backend

# Remove everything
rm -rf node_modules package-lock.json veramo.sqlite veramo.sqlite-journal

# Reinstall
npm install

# Try again
npm start
```

---

## Common Errors & Fixes

### Error: "Cannot find package 'express'"
**Fix:**
```bash
cd /Users/ayushranjan/Desktop/bct1/backend
npm install
```

### Error: "SyntaxError: Unexpected identifier 'assert'"
**Fix:** This is a Node.js v22 issue. Switch to Node.js v20:
```bash
nvm use 20
cd /Users/ayushranjan/Desktop/bct1/backend
rm -rf node_modules package-lock.json
npm install
npm start
```

### Error: "Port already in use"
**Fix:**
```bash
# Kill processes
pkill -f "ipfs daemon"
pkill -f "hardhat node"
lsof -ti:3001 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

---

## Updated Startup Script

The `start-project.sh` script has been updated. Run:

```bash
cd /Users/ayushranjan/Desktop/bct1
./start-project.sh
```

It will now check for Node.js version and handle dependencies properly.

---

## Summary

1. **Switch to Node.js 20** (required for Veramo compatibility)
2. **Install dependencies** (clean install for backend)
3. **Start services** in order (IPFS → Hardhat → Deploy → Backend → Frontend)

**That's it! The project should now run error-free.** 🚀


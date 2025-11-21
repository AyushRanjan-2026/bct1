# VS Code Setup Guide - Quick Start

## Method 1: Using the Startup Script (Easiest)

### One Command to Start Everything:
```bash
cd /Users/ayushranjan/Desktop/bct1
./start-project.sh
```

This script will:
- ✅ Check prerequisites
- ✅ Install dependencies if needed
- ✅ Clear ports
- ✅ Start IPFS
- ✅ Start Hardhat node
- ✅ Deploy contracts
- ✅ Start backend
- ✅ Start frontend
- ✅ Open browser

**That's it!** All services will start automatically.

---

## Method 2: Using VS Code Tasks (Recommended)

### Step 1: Open VS Code
```bash
code /Users/ayushranjan/Desktop/bct1
```

### Step 2: Open Command Palette
- Press: `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
- Type: "Tasks: Run Task"
- Select tasks in order:

1. **"1. Start IPFS"** - Wait for "Daemon is ready"
2. **"2. Start Hardhat Node"** - Wait for node to start
3. **"3. Deploy Contracts"** - Wait for deployment
4. **"4. Start Backend"** - Wait for "Backend server running"
5. **"5. Start Frontend"** - Wait for "Local: http://localhost:5173"

### Step 3: Open Browser
Navigate to: http://localhost:5173

---

## Method 3: Manual Terminal Commands

### Open 5 Terminals in VS Code:
1. **Terminal → New Terminal** (repeat 5 times)
2. Or use: `Ctrl+` (backtick) to toggle terminal

### Terminal 1: IPFS
```bash
ipfs daemon
```

### Terminal 2: Hardhat Node
```bash
cd /Users/ayushranjan/Desktop/bct1
npm run node
```

### Terminal 3: Deploy Contracts (wait for Terminal 2)
```bash
cd /Users/ayushranjan/Desktop/bct1
npm run deploy
```

### Terminal 4: Backend
```bash
cd /Users/ayushranjan/Desktop/bct1/backend
npm start
```

### Terminal 5: Frontend
```bash
cd /Users/ayushranjan/Desktop/bct1/frontend
npm run dev
```

---

## First Time Setup

### 1. Install Dependencies (One Time)
```bash
# Root
cd /Users/ayushranjan/Desktop/bct1
npm install

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Install IPFS (if not installed)
```bash
# macOS
brew install ipfs

# Initialize (first time only)
ipfs init
```

---

## Verification

### Check All Services:
```bash
# IPFS
curl http://127.0.0.1:5001/api/v0/version

# Backend
curl http://localhost:3001/health

# Frontend
# Open: http://localhost:5173
```

### Expected Outputs:
- **IPFS**: `{"Version":"...","Commit":"..."}`
- **Backend**: `{"status":"ok","timestamp":"..."}`
- **Frontend**: Dashboard loads in browser

---

## Troubleshooting

### Port Already in Use?
```bash
# Kill all services
pkill -f "ipfs daemon"
pkill -f "hardhat node"
pkill -f "node.*backend"
pkill -f "vite"
```

### Dependencies Not Installed?
```bash
cd /Users/ayushranjan/Desktop/bct1
npm install
cd backend && npm install
cd ../frontend && npm install
```

### Contracts Not Deployed?
```bash
cd /Users/ayushranjan/Desktop/bct1
npm run compile
npm run deploy
```

### Backend Errors?
```bash
cd /Users/ayushranjan/Desktop/bct1/backend
rm -f veramo.sqlite veramo.sqlite-journal
npm start
```

---

## VS Code Extensions (Optional but Recommended)

Install these for better development:

1. **Solidity** (Juan Blanco)
2. **ES7+ React/Redux/React-Native snippets** (dsznajder)
3. **Tailwind CSS IntelliSense** (Tailwind Labs)
4. **Prettier** (Prettier)
5. **ESLint** (Microsoft)

---

## Quick Reference

### Ports:
- **3001**: Backend API
- **5173**: Frontend (Vite)
- **8545**: Hardhat RPC
- **5001**: IPFS API

### Key Files:
- `deployments.json`: Contract addresses
- `backend/veramo.sqlite`: Veramo database
- `backend/vc-store.json`: VC storage
- `backend/policy-requests.json`: Policy requests

### Logs:
- IPFS: Check terminal output
- Hardhat: Check terminal output
- Backend: Check terminal output or `/tmp/backend.log`
- Frontend: Check terminal output or `/tmp/frontend.log`

---

## Stopping Services

### Using Startup Script:
The script shows process IDs. To stop:
```bash
pkill -f "ipfs daemon"
pkill -f "hardhat node"
pkill -f "node.*backend"
pkill -f "vite"
```

### Manual Stop:
Press `Ctrl+C` in each terminal

---

## Success Checklist

✅ All 5 terminals running without errors
✅ Backend responds: `curl http://localhost:3001/health`
✅ Frontend loads: http://localhost:5173
✅ No red errors in browser console
✅ `deployments.json` exists with contract addresses
✅ MetaMask can connect to localhost:8545

---

**You're ready! Open http://localhost:5173 and start the demo! 🚀**


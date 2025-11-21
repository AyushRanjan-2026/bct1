# How to Run MPA Project in VS Code

## Prerequisites Check

First, verify you have these installed:
```bash
node --version    # Should be v18 or higher
npm --version     # Should be v8 or higher
ipfs --version    # IPFS should be installed
```

---

## Step 1: Install All Dependencies

### Root Directory (Hardhat)
```bash
cd /Users/ayushranjan/Desktop/bct1
npm install
```

### Backend
```bash
cd /Users/ayushranjan/Desktop/bct1/backend
npm install
```

### Frontend
```bash
cd /Users/ayushranjan/Desktop/bct1/frontend
npm install
```

---

## Step 2: Start IPFS Daemon

**Open Terminal 1 in VS Code:**
```bash
ipfs daemon
```

**Wait for:** "Daemon is ready"
**Keep this terminal running!**

---

## Step 3: Compile and Deploy Smart Contracts

**Open Terminal 2 in VS Code:**
```bash
cd /Users/ayushranjan/Desktop/bct1
npm run compile
```

**Then start Hardhat node:**
```bash
npm run node
```

**Keep this terminal running!** You'll see account addresses and private keys.

**Open Terminal 3 in VS Code (new terminal):**
```bash
cd /Users/ayushranjan/Desktop/bct1
npm run deploy
```

**Wait for:** "Deployment addresses saved to deployments.json"

---

## Step 4: Start Backend Server

**Open Terminal 4 in VS Code:**
```bash
cd /Users/ayushranjan/Desktop/bct1/backend
npm start
```

**Wait for:** "Backend server running on http://localhost:3001"

---

## Step 5: Start Frontend

**Open Terminal 5 in VS Code:**
```bash
cd /Users/ayushranjan/Desktop/bct1/frontend
npm run dev
```

**Wait for:** "Local: http://localhost:5173"

---

## Complete Command Sequence (Copy-Paste Ready)

### Terminal 1: IPFS
```bash
ipfs daemon
```

### Terminal 2: Hardhat Node
```bash
cd /Users/ayushranjan/Desktop/bct1
npm run node
```

### Terminal 3: Deploy Contracts (after Terminal 2 is running)
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

## VS Code Terminal Setup

1. **Open VS Code** in the project directory:
   ```bash
   code /Users/ayushranjan/Desktop/bct1
   ```

2. **Open 5 Terminals:**
   - Click Terminal → New Terminal (5 times)
   - Or use: `Ctrl+Shift+` (backtick) to open terminal
   - Or: View → Terminal

3. **Label Each Terminal** (optional but helpful):
   - Terminal 1: "IPFS"
   - Terminal 2: "Hardhat Node"
   - Terminal 3: "Deploy"
   - Terminal 4: "Backend"
   - Terminal 5: "Frontend"

---

## Verification Checklist

After starting all services, verify:

### ✅ IPFS Running
- Terminal 1 shows: "Daemon is ready"
- Test: `curl http://127.0.0.1:5001/api/v0/version`

### ✅ Hardhat Node Running
- Terminal 2 shows: "Started HTTP and WebSocket JSON-RPC server"
- Shows account addresses and private keys

### ✅ Contracts Deployed
- Terminal 3 shows: "Deployment addresses saved to deployments.json"
- Check: `cat deployments.json` should show contract addresses

### ✅ Backend Running
- Terminal 4 shows: "Backend server running on http://localhost:3001"
- Test: `curl http://localhost:3001/health`

### ✅ Frontend Running
- Terminal 5 shows: "Local: http://localhost:5173"
- Open browser: http://localhost:5173

---

## Common Errors & Fixes

### Error: "Cannot find module"
**Fix:**
```bash
# Reinstall dependencies
cd /Users/ayushranjan/Desktop/bct1
rm -rf node_modules package-lock.json
npm install

cd backend
rm -rf node_modules package-lock.json
npm install

cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

### Error: "IPFS connection failed"
**Fix:**
```bash
# Check IPFS is running
ipfs daemon

# If not installed:
# macOS: brew install ipfs
# Then: ipfs init
```

### Error: "Port already in use"
**Fix:**
```bash
# Kill process on port 3001 (Backend)
lsof -ti:3001 | xargs kill -9

# Kill process on port 5173 (Frontend)
lsof -ti:5173 | xargs kill -9

# Kill process on port 8545 (Hardhat)
lsof -ti:8545 | xargs kill -9

# Kill process on port 5001 (IPFS)
lsof -ti:5001 | xargs kill -9
```

### Error: "Deployments file not found"
**Fix:**
```bash
cd /Users/ayushranjan/Desktop/bct1
npm run deploy
```

### Error: "Veramo database error"
**Fix:**
```bash
cd /Users/ayushranjan/Desktop/bct1/backend
# Delete old database
rm -f veramo.sqlite veramo.sqlite-journal
# Restart backend
npm start
```

### Error: "Contract ABI not found"
**Fix:**
```bash
cd /Users/ayushranjan/Desktop/bct1
npm run compile
npm run deploy
```

---

## Quick Start Script (All-in-One)

Create a file `start-all.sh`:

```bash
#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting MPA Project...${NC}"

# Check IPFS
if ! pgrep -x "ipfs" > /dev/null; then
    echo -e "${GREEN}Starting IPFS...${NC}"
    ipfs daemon &
    sleep 3
fi

# Start Hardhat Node
echo -e "${GREEN}Starting Hardhat Node...${NC}"
cd /Users/ayushranjan/Desktop/bct1
npm run node &
sleep 5

# Deploy Contracts
echo -e "${GREEN}Deploying Contracts...${NC}"
npm run deploy
sleep 2

# Start Backend
echo -e "${GREEN}Starting Backend...${NC}"
cd backend
npm start &
sleep 3

# Start Frontend
echo -e "${GREEN}Starting Frontend...${NC}"
cd ../frontend
npm run dev

echo -e "${GREEN}All services started!${NC}"
```

**Make it executable:**
```bash
chmod +x start-all.sh
```

**Run it:**
```bash
./start-all.sh
```

---

## VS Code Workspace Configuration

Create `.vscode/settings.json`:

```json
{
  "terminal.integrated.defaultProfile.osx": "zsh",
  "terminal.integrated.profiles.osx": {
    "zsh": {
      "path": "/bin/zsh"
    }
  },
  "files.exclude": {
    "**/node_modules": true,
    "**/artifacts": false,
    "**/cache": true
  }
}
```

---

## Recommended VS Code Extensions

Install these for better development:

1. **Solidity** - For smart contract syntax highlighting
2. **ES7+ React/Redux/React-Native snippets** - React shortcuts
3. **Tailwind CSS IntelliSense** - Tailwind autocomplete
4. **Prettier** - Code formatting
5. **ESLint** - Code linting

---

## Testing the Setup

### Test Backend API:
```bash
curl http://localhost:3001/health
```

**Expected:** `{"status":"ok","timestamp":"..."}`

### Test IPFS:
```bash
curl http://127.0.0.1:5001/api/v0/version
```

**Expected:** `{"Version":"...","Commit":"...","Repo":"..."}`

### Test Frontend:
Open browser: http://localhost:5173

**Expected:** MPA dashboard loads

---

## Stopping All Services

### Manual Stop:
- Press `Ctrl+C` in each terminal

### Stop All at Once:
```bash
# Kill all Node processes
pkill -f node

# Kill IPFS
pkill -f ipfs

# Kill Hardhat
pkill -f hardhat
```

---

## Project Structure Reminder

```
bct1/
├── contracts/          # Smart contracts
├── scripts/            # Deployment scripts
├── backend/            # Node.js backend
│   ├── server.js       # Main server
│   └── ...
├── frontend/           # React frontend
│   └── src/           # React components
└── deployments.json   # Contract addresses (after deploy)
```

---

## Port Reference

- **3001**: Backend API
- **5173**: Frontend (Vite)
- **8545**: Hardhat node (RPC)
- **5001**: IPFS API

---

## Success Indicators

✅ All terminals running without errors
✅ Backend responds to `/health` endpoint
✅ Frontend loads in browser
✅ MetaMask can connect to localhost:8545
✅ No red errors in browser console
✅ Contracts deployed (check `deployments.json`)

---

**You're ready to demo! 🚀**


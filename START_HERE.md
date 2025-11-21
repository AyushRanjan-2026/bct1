# 🚀 START HERE - Run Project Every Time

## ⚡ Quick Start (One Command)

```bash
cd /Users/ayushranjan/Desktop/bct1
./START_PROJECT.sh
```

---

## 📋 Manual Start (If Script Doesn't Work)

### Prerequisites:
```bash
# Must be Node.js 20
nvm use 20
node --version  # Must show v20.x.x
```

### Step 1: Install Package (First Time Only)
```bash
cd /Users/ayushranjan/Desktop/bct1/backend
npm install @veramo/kms-local
```

### Step 2: Clean Database
```bash
cd /Users/ayushranjan/Desktop/bct1/backend
rm -f veramo.sqlite veramo.sqlite-journal
```

### Step 3: Start 5 Terminals

**Terminal 1: IPFS**
```bash
ipfs daemon
```

**Terminal 2: Hardhat**
```bash
cd /Users/ayushranjan/Desktop/bct1
nvm use 20
npm run node
```

**Terminal 3: Deploy** (after Terminal 2)
```bash
cd /Users/ayushranjan/Desktop/bct1
nvm use 20
npm run deploy
```

**Terminal 4: Backend**
```bash
cd /Users/ayushranjan/Desktop/bct1/backend
nvm use 20
npm start
```

**Wait for:**
- ✅ "Backend server running on http://localhost:3001"
- ✅ "Veramo database initialized"
- ✅ "Veramo agent initialized"

**Terminal 5: Frontend**
```bash
cd /Users/ayushranjan/Desktop/bct1/frontend
npm run dev
```

---

## ✅ Verify

### Test Backend:
```bash
curl http://localhost:3001/health
# Expected: {"status":"ok","timestamp":"..."}
```

### Test Create DID:
```bash
curl -X POST http://localhost:3001/did/create
# Expected: {"did":"did:key:...","success":true}
```

### Open Browser:
http://localhost:5173

---

## 🔧 If Create DID Still Doesn't Work

### Check Backend is Running:
```bash
curl http://localhost:3001/health
```

### Check Backend Logs:
Look in Terminal 4 for errors

### Check Browser Console (F12):
Look for API request/response logs

### Fix:
```bash
# Restart backend with clean database
cd /Users/ayushranjan/Desktop/bct1/backend
rm -f veramo.sqlite veramo.sqlite-journal
nvm use 20
npm start
```

---

## 🛑 Stop All

```bash
pkill -f "ipfs daemon"
pkill -f "hardhat node"
pkill -f "node.*server"
pkill -f "vite"
```

---

**That's it! Follow these steps every time.** 🚀


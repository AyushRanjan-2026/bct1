# Commands to Run Project - Every Time

## ⚡ Quick Start (One Command)

```bash
cd /Users/ayushranjan/Desktop/bct1
./START_PROJECT.sh
```

**That's it!** All services will start automatically.

---

## 📋 Manual Step-by-Step (If Script Doesn't Work)

### Step 1: Ensure Node.js 20
```bash
# Check version
node --version  # Must show v20.x.x

# If not, switch
nvm use 20
```

### Step 2: Install Missing Package (One Time)
```bash
cd /Users/ayushranjan/Desktop/bct1/backend
npm install @veramo/kms-local
```

### Step 3: Clean Backend Database
```bash
cd /Users/ayushranjan/Desktop/bct1/backend
rm -f veramo.sqlite veramo.sqlite-journal
```

### Step 4: Start Services (5 Terminals)

**Terminal 1: IPFS**
```bash
ipfs daemon
```
**Wait for:** "Daemon is ready"

**Terminal 2: Hardhat Node**
```bash
cd /Users/ayushranjan/Desktop/bct1
nvm use 20
npm run node
```
**Wait for:** "Started HTTP and WebSocket JSON-RPC server"
**Keep running!**

**Terminal 3: Deploy Contracts** (after Terminal 2 is running)
```bash
cd /Users/ayushranjan/Desktop/bct1
nvm use 20
npm run deploy
```
**Wait for:** "Deployment addresses saved to deployments.json"

**Terminal 4: Backend**
```bash
cd /Users/ayushranjan/Desktop/bct1/backend
nvm use 20
npm start
```
**Wait for:** "Backend server running on http://localhost:3001"

**Terminal 5: Frontend**
```bash
cd /Users/ayushranjan/Desktop/bct1/frontend
npm run dev
```
**Wait for:** "Local: http://localhost:5173"

---

## ✅ Verification

### Test Backend:
```bash
curl http://localhost:3001/health
```
**Expected:** `{"status":"ok","timestamp":"..."}`

### Test DID Creation:
```bash
curl -X POST http://localhost:3001/did/create
```
**Expected:** `{"did":"did:key:...","success":true}`

### Open Frontend:
Browser: http://localhost:5173

---

## 🔧 If Create DID Still Doesn't Work

### Check Backend Logs:
Look in Terminal 4 for:
- ✅ "Veramo database initialized"
- ✅ "Veramo agent initialized"
- ✅ "📝 Creating DID..."
- ✅ "✅ DID created: did:key:..."

### Check Browser Console (F12):
Look for:
- `📤 API Request: POST /did/create`
- `✅ API Response: /did/create 200`
- Any `❌ API Error` messages

### Common Fixes:

**1. Backend not responding:**
```bash
# Kill and restart backend
pkill -f "node.*server.js"
cd /Users/ayushranjan/Desktop/bct1/backend
rm -f veramo.sqlite veramo.sqlite-journal
nvm use 20
npm start
```

**2. Missing package:**
```bash
cd /Users/ayushranjan/Desktop/bct1/backend
npm install @veramo/kms-local
npm start
```

**3. Database locked:**
```bash
cd /Users/ayushranjan/Desktop/bct1/backend
rm -f veramo.sqlite veramo.sqlite-journal
npm start
```

---

## 🛑 Stop All Services

```bash
pkill -f "ipfs daemon"
pkill -f "hardhat node"
pkill -f "node.*server.js"
pkill -f "vite"
```

---

## 📝 Summary

**Every time you want to run the project:**

1. **Quick way:** `./START_PROJECT.sh`
2. **Manual way:** Follow Step 4 above (5 terminals)

**First time only:**
- Install `@veramo/kms-local`: `cd backend && npm install @veramo/kms-local`

**If Create DID fails:**
- Check backend logs
- Check browser console
- Restart backend with clean database

---

**The project should now work perfectly!** 🚀


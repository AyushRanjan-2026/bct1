# Quick Start - Run Project Every Time

## 🚀 One Command (Easiest)

```bash
cd /Users/ayushranjan/Desktop/bct1
./START_PROJECT.sh
```

---

## 📋 Manual Steps (5 Terminals)

### Prerequisites Check:
```bash
# Must be Node.js 20
node --version  # Should show v20.x.x
# If not: nvm use 20
```

### Terminal 1: IPFS
```bash
ipfs daemon
```

### Terminal 2: Hardhat Node
```bash
cd /Users/ayushranjan/Desktop/bct1
nvm use 20
npm run node
```
**Wait for:** "Started HTTP and WebSocket JSON-RPC server"

### Terminal 3: Deploy Contracts
```bash
cd /Users/ayushranjan/Desktop/bct1
nvm use 20
npm run deploy
```
**Wait for:** "Deployment addresses saved to deployments.json"

### Terminal 4: Backend
```bash
cd /Users/ayushranjan/Desktop/bct1/backend
nvm use 20
npm start
```
**Wait for:**
- ✅ "Veramo database initialized"
- ✅ "Veramo agent initialized"  
- ✅ "Backend server running on http://localhost:3001"

### Terminal 5: Frontend
```bash
cd /Users/ayushranjan/Desktop/bct1/frontend
npm run dev
```
**Wait for:** "Local: http://localhost:5173"

---

## ✅ Verify Everything Works

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

### Open Frontend:
Browser: http://localhost:5173

---

## 🔧 If Create DID Doesn't Work

### 1. Check Backend is Running:
```bash
curl http://localhost:3001/health
```

### 2. Check Backend Logs:
Look in Terminal 4 for:
- ✅ "Veramo agent initialized"
- ✅ "📝 Creating DID..."
- ✅ "✅ DID created: did:key:..."

### 3. Check Browser Console (F12):
Look for:
- `📤 API Request: POST /did/create`
- `✅ API Response: /did/create 200`
- Or error messages

### 4. Fix Common Issues:

**Missing package:**
```bash
cd /Users/ayushranjan/Desktop/bct1/backend
npm install @veramo/kms-local
```

**Database locked:**
```bash
cd /Users/ayushranjan/Desktop/bct1/backend
rm -f veramo.sqlite veramo.sqlite-journal
npm start
```

**Wrong Node version:**
```bash
nvm use 20
node --version  # Must show v20.x.x
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

**Every time:**
1. Run `./START_PROJECT.sh` OR
2. Start 5 terminals as shown above

**First time only:**
- `cd backend && npm install @veramo/kms-local`

**If Create DID fails:**
- Check backend logs
- Check browser console
- Restart backend with clean database

---

**Ready to go!** 🚀


# 🚀 Run Project NOW - Step by Step

## ⚡ Quick Fix & Run

### Step 1: Install Package
```bash
cd /Users/ayushranjan/Desktop/bct1/backend
npm install @veramo/kms-local
```

### Step 2: Clean Database
```bash
cd /Users/ayushranjan/Desktop/bct1/backend
rm -f veramo.sqlite veramo.sqlite-journal
```

### Step 3: Ensure Node 20
```bash
nvm use 20
node --version  # Must show v20.x.x
```

### Step 4: Start Services (5 Terminals)

**Terminal 1:**
```bash
ipfs daemon
```

**Terminal 2:**
```bash
cd /Users/ayushranjan/Desktop/bct1
nvm use 20
npm run node
```

**Terminal 3 (after Terminal 2):**
```bash
cd /Users/ayushranjan/Desktop/bct1
nvm use 20
npm run deploy
```

**Terminal 4:**
```bash
cd /Users/ayushranjan/Desktop/bct1/backend
nvm use 20
npm start
```

**Wait for:**
- ✅ "Backend server running on http://localhost:3001"
- ✅ "Veramo database initialized"
- ✅ "Veramo agent initialized"

**Terminal 5:**
```bash
cd /Users/ayushranjan/Desktop/bct1/frontend
npm run dev
```

---

## ✅ Test

### Test 1: Backend Health
```bash
curl http://localhost:3001/health
```

### Test 2: Create DID
```bash
curl -X POST http://localhost:3001/did/create
```

### Test 3: Browser
1. Open: http://localhost:5173
2. Patient tab
3. Click "Create DID"
4. Should work!

---

## 🔧 If Still Not Working

### Check Backend Logs:
Look in Terminal 4 for:
- Errors during startup
- Veramo initialization errors
- Any import errors

### Common Fixes:

**1. Package not installed:**
```bash
cd /Users/ayushranjan/Desktop/bct1/backend
npm install @veramo/kms-local
```

**2. Wrong Node version:**
```bash
nvm use 20
node --version
```

**3. Database locked:**
```bash
cd /Users/ayushranjan/Desktop/bct1/backend
rm -f veramo.sqlite veramo.sqlite-journal
npm start
```

---

**Follow these steps and Create DID will work!** 🚀


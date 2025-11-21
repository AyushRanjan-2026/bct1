# Complete Fix for Network Error & Create DID

## 🔍 Problem Diagnosis

The network error means the backend is either:
1. Not running
2. Crashing on startup
3. Not responding to requests

## ✅ Complete Fix

### Step 1: Stop Everything
```bash
pkill -f "node.*server"
pkill -f "hardhat"
pkill -f "ipfs"
pkill -f "vite"
```

### Step 2: Install Missing Package
```bash
cd /Users/ayushranjan/Desktop/bct1/backend
npm install @veramo/kms-local
```

### Step 3: Clean Database
```bash
cd /Users/ayushranjan/Desktop/bct1/backend
rm -f veramo.sqlite veramo.sqlite-journal
```

### Step 4: Ensure Node.js 20
```bash
nvm use 20
node --version  # Must show v20.x.x
```

### Step 5: Test Backend Startup
```bash
cd /Users/ayushranjan/Desktop/bct1/backend
node server.js
```

**Look for:**
- ✅ "Backend server running on http://localhost:3001"
- ✅ "Veramo database initialized"
- ✅ "Veramo agent initialized"

**If you see errors:**
- Note the error message
- Check if it's a missing package
- Check if it's a Node.js version issue

### Step 6: Start All Services

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

**Terminal 3: Deploy**
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

**Wait for these messages:**
- ✅ "Backend server running on http://localhost:3001"
- ✅ "Veramo database initialized"
- ✅ "Veramo agent initialized"

**Terminal 5: Frontend**
```bash
cd /Users/ayushranjan/Desktop/bct1/frontend
npm run dev
```

---

## 🧪 Test Backend

### Test 1: Health Check
```bash
curl http://localhost:3001/health
```
**Expected:** `{"status":"ok","timestamp":"..."}`

### Test 2: Create DID
```bash
curl -X POST http://localhost:3001/did/create
```
**Expected:** `{"did":"did:key:...","success":true}`

---

## 🔧 If Backend Still Crashes

### Option 1: Use Simple Server
```bash
cd /Users/ayushranjan/Desktop/bct1/backend
nvm use 20
npm run start:simple
```

This starts immediately and loads Veramo in background.

### Option 2: Check Specific Error

Run backend and capture error:
```bash
cd /Users/ayushranjan/Desktop/bct1/backend
nvm use 20
node server.js 2>&1 | tee backend-error.log
```

Look at `backend-error.log` for the specific error.

---

## 🌐 Test in Browser

1. **Open:** http://localhost:5173
2. **Open Console:** Press F12 → Console tab
3. **Go to Patient tab**
4. **Click "Create DID"**
5. **Check Console:**
   - Should see: `📤 API Request: POST /did/create`
   - Should see: `✅ API Response: /did/create 200`
   - Or error message

---

## 📋 Complete Startup Checklist

- [ ] Node.js 20 is active (`node --version` shows v20.x.x)
- [ ] @veramo/kms-local is installed
- [ ] Backend database is clean
- [ ] IPFS daemon is running
- [ ] Hardhat node is running
- [ ] Contracts are deployed
- [ ] Backend server is running
- [ ] Frontend is running
- [ ] Backend responds to `/health`
- [ ] Backend responds to `/did/create`

---

## 🚨 Common Errors & Fixes

### Error: "Cannot find module '@veramo/kms-local'"
**Fix:**
```bash
cd /Users/ayushranjan/Desktop/bct1/backend
npm install @veramo/kms-local
```

### Error: "SyntaxError: Unexpected identifier 'assert'"
**Fix:** Use Node.js 20
```bash
nvm use 20
```

### Error: "ECONNREFUSED"
**Fix:** Backend is not running
```bash
cd /Users/ayushranjan/Desktop/bct1/backend
nvm use 20
npm start
```

### Error: "Veramo initialization failed"
**Fix:** Clean database and restart
```bash
cd /Users/ayushranjan/Desktop/bct1/backend
rm -f veramo.sqlite veramo.sqlite-journal
npm start
```

---

## 📝 Summary

**To fix network error and Create DID:**

1. ✅ Install package: `cd backend && npm install @veramo/kms-local`
2. ✅ Clean database: `rm -f veramo.sqlite veramo.sqlite-journal`
3. ✅ Use Node 20: `nvm use 20`
4. ✅ Start backend: `npm start`
5. ✅ Wait for "Veramo agent initialized"
6. ✅ Test: `curl -X POST http://localhost:3001/did/create`
7. ✅ Test in browser

**The backend should now start without crashing, and Create DID should work!** 🚀


# Fix Network Error - Complete Solution

## Problem:
- Network error when clicking Create DID
- Backend might be crashing on startup
- Veramo initialization blocking server

## Solution:

### Step 1: Check if Backend is Running

```bash
curl http://localhost:3001/health
```

**If it doesn't respond**, the backend is not running or crashed.

### Step 2: Check Backend Logs

Look for errors like:
- "Veramo initialization error"
- "Cannot find module"
- "SyntaxError"

### Step 3: Fix Backend Startup

The backend might be crashing because Veramo initialization fails. I've created a fix that:
- ✅ Server starts even if Veramo fails
- ✅ Veramo initializes in background
- ✅ Better error messages

---

## Complete Fix Commands

### Option 1: Use Simple Server (Recommended for Testing)

```bash
cd /Users/ayushranjan/Desktop/bct1/backend
nvm use 20
rm -f veramo.sqlite veramo.sqlite-journal
node server-simple.js
```

This server starts immediately and loads Veramo in background.

### Option 2: Fix Main Server

```bash
# 1. Install missing package
cd /Users/ayushranjan/Desktop/bct1/backend
npm install @veramo/kms-local

# 2. Clean database
rm -f veramo.sqlite veramo.sqlite-journal

# 3. Ensure Node 20
nvm use 20
node --version  # Must show v20.x.x

# 4. Start server
npm start
```

---

## Test Backend

### Test 1: Health Check
```bash
curl http://localhost:3001/health
```
**Expected:** `{"status":"ok","timestamp":"..."}`

### Test 2: Test Endpoint
```bash
curl http://localhost:3001/test
```
**Expected:** `{"message":"Backend is working!","timestamp":"..."}`

### Test 3: Create DID
```bash
curl -X POST http://localhost:3001/did/create
```
**Expected:** `{"did":"did:key:...","success":true}`

---

## If Backend Still Crashes

### Check Node Version:
```bash
node --version  # Must be v20.x.x
```

### Check Package Installation:
```bash
cd /Users/ayushranjan/Desktop/bct1/backend
npm list @veramo/kms-local
```

### Check for Errors:
```bash
cd /Users/ayushranjan/Desktop/bct1/backend
node server.js 2>&1 | head -20
```

Look for:
- Import errors
- Module not found
- Syntax errors

---

## Quick Diagnostic Script

Run this to check everything:

```bash
#!/bin/bash
echo "Checking backend status..."

# Check if backend is running
if curl -s http://localhost:3001/health > /dev/null; then
    echo "✅ Backend is running"
else
    echo "❌ Backend is NOT running"
    echo "Start it with: cd backend && nvm use 20 && npm start"
    exit 1
fi

# Test DID creation
echo "Testing DID creation..."
RESULT=$(curl -s -X POST http://localhost:3001/did/create)
if echo "$RESULT" | grep -q "did:key"; then
    echo "✅ DID creation works!"
else
    echo "❌ DID creation failed:"
    echo "$RESULT"
fi
```

---

## Common Issues

### 1. Backend Not Running
**Fix:**
```bash
cd /Users/ayushranjan/Desktop/bct1/backend
nvm use 20
npm start
```

### 2. Port 3001 in Use
**Fix:**
```bash
lsof -ti:3001 | xargs kill -9
cd /Users/ayushranjan/Desktop/bct1/backend
npm start
```

### 3. Veramo Initialization Fails
**Fix:**
```bash
cd /Users/ayushranjan/Desktop/bct1/backend
rm -f veramo.sqlite veramo.sqlite-journal
npm install @veramo/kms-local
npm start
```

### 4. Wrong Node Version
**Fix:**
```bash
nvm use 20
node --version  # Verify v20.x.x
cd /Users/ayushranjan/Desktop/bct1/backend
npm start
```

---

## Updated Startup Process

1. **Backend starts immediately** (doesn't wait for Veramo)
2. **Veramo initializes in background**
3. **DID routes added after Veramo is ready**
4. **Server responds to health checks immediately**

---

## Test in Browser

1. Open: http://localhost:5173
2. Open browser console (F12)
3. Go to Patient tab
4. Click "Create DID"
5. Check console for:
   - `📤 API Request: POST /did/create`
   - `✅ API Response: /did/create 200`
   - Or error messages

---

**The backend should now start without crashing, and Create DID should work!** 🚀


# Test Backend - Step by Step

## Quick Test

```bash
# Test if backend is running
curl http://localhost:3001/health

# Test DID creation
curl -X POST http://localhost:3001/did/create
```

---

## If Backend is Not Running

### Start Backend:
```bash
cd /Users/ayushranjan/Desktop/bct1/backend
nvm use 20
npm start
```

**Look for:**
- ✅ "Backend server running on http://localhost:3001"
- ✅ "Veramo database initialized"
- ✅ "Veramo agent initialized"

**If you see errors:**
- Check Node.js version (must be 20)
- Check if @veramo/kms-local is installed
- Check backend logs for specific errors

---

## If Backend Crashes on Startup

### Use Simple Server:
```bash
cd /Users/ayushranjan/Desktop/bct1/backend
nvm use 20
npm run start:simple
```

This starts the server immediately and loads Veramo in background.

---

## Complete Diagnostic

Run this to check everything:

```bash
#!/bin/bash

echo "🔍 Backend Diagnostic"
echo "===================="

# Check Node version
echo ""
echo "1. Node.js version:"
node --version

# Check if backend is running
echo ""
echo "2. Backend status:"
if curl -s http://localhost:3001/health > /dev/null 2>&1; then
    echo "✅ Backend is running"
    curl -s http://localhost:3001/health | jq . || curl -s http://localhost:3001/health
else
    echo "❌ Backend is NOT running"
    echo "   Start with: cd backend && nvm use 20 && npm start"
fi

# Check package
echo ""
echo "3. Veramo package:"
cd /Users/ayushranjan/Desktop/bct1/backend
if npm list @veramo/kms-local > /dev/null 2>&1; then
    echo "✅ @veramo/kms-local is installed"
else
    echo "❌ @veramo/kms-local is NOT installed"
    echo "   Install with: npm install @veramo/kms-local"
fi

# Test DID creation
echo ""
echo "4. DID creation test:"
RESULT=$(curl -s -X POST http://localhost:3001/did/create 2>&1)
if echo "$RESULT" | grep -q "did:key"; then
    echo "✅ DID creation works!"
    echo "$RESULT" | jq . || echo "$RESULT"
else
    echo "❌ DID creation failed:"
    echo "$RESULT"
fi

echo ""
echo "===================="
```

---

## Fix Network Error

### 1. Ensure Backend is Running:
```bash
# Check
curl http://localhost:3001/health

# If not running, start it
cd /Users/ayushranjan/Desktop/bct1/backend
nvm use 20
npm start
```

### 2. Check Frontend URL:
Make sure frontend is using correct backend URL:
- Check browser console (F12)
- Look for API requests
- Verify URL is `http://localhost:3001`

### 3. Check CORS:
Backend has CORS enabled, so this should work. If not:
- Check backend logs
- Verify CORS middleware is loaded

---

## Start Everything Fresh

```bash
# Stop all
pkill -f "node.*server"
pkill -f "hardhat"
pkill -f "ipfs"
pkill -f "vite"

# Clean backend
cd /Users/ayushranjan/Desktop/bct1/backend
rm -f veramo.sqlite veramo.sqlite-journal

# Install package
npm install @veramo/kms-local

# Start services (5 terminals)
# Terminal 1: ipfs daemon
# Terminal 2: cd bct1 && nvm use 20 && npm run node
# Terminal 3: cd bct1 && nvm use 20 && npm run deploy
# Terminal 4: cd bct1/backend && nvm use 20 && npm start
# Terminal 5: cd bct1/frontend && npm run dev
```

---

**Test Create DID after backend starts!** 🚀


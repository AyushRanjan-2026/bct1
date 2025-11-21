# Fix Network Errors and Create DID Issues

## Issues Found:
1. ✅ Create DID buttons not working
2. ✅ Backend flickering/refreshing
3. ✅ Network errors in frontend

## Fixes Applied:

### 1. Backend Stability
- ✅ Fixed Veramo initialization to not block server startup
- ✅ Added better error handling
- ✅ Added logging for debugging
- ✅ Server starts even if Veramo takes time to initialize

### 2. Frontend Error Handling
- ✅ Added axios interceptors for better error messages
- ✅ Added timeout (30 seconds)
- ✅ Better error messages for connection issues
- ✅ Console logging for debugging

### 3. DID Creation
- ✅ Fixed error handling in PatientDashboard
- ✅ Fixed error handling in InsurerDashboard
- ✅ Added loading states
- ✅ Better error messages

---

## How to Fix Right Now:

### Step 1: Stop All Running Services
```bash
# Kill all processes
pkill -f "node.*server.js"
pkill -f "hardhat node"
pkill -f "ipfs daemon"
pkill -f "vite"
```

### Step 2: Clean Backend Database
```bash
cd /Users/ayushranjan/Desktop/bct1/backend
rm -f veramo.sqlite veramo.sqlite-journal
```

### Step 3: Ensure Node.js 20
```bash
# Check version
node --version  # Should show v20.x.x

# If not, switch
nvm use 20
```

### Step 4: Start Services in Order

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

**Terminal 4: Backend (Use stable script)**
```bash
cd /Users/ayushranjan/Desktop/bct1/backend
nvm use 20
./start-stable.sh
```

**Terminal 5: Frontend**
```bash
cd /Users/ayushranjan/Desktop/bct1/frontend
npm run dev
```

---

## Verify Backend is Working

### Test Backend Health:
```bash
curl http://localhost:3001/health
```

**Expected:** `{"status":"ok","timestamp":"..."}`

### Test DID Creation:
```bash
curl -X POST http://localhost:3001/did/create \
  -H "Content-Type: application/json"
```

**Expected:** `{"did":"did:key:...","success":true}`

---

## Debugging Tips

### Check Backend Logs:
Look for these messages in Terminal 4:
- ✅ "Backend server running on http://localhost:3001"
- ✅ "Veramo database initialized"
- ✅ "Veramo agent initialized"

### Check Frontend Console:
Open browser DevTools (F12) and check Console tab:
- Look for API request logs: `📤 API Request: POST /did/create`
- Look for errors: `❌ API Error: ...`

### Common Issues:

**Backend not starting:**
- Check Node.js version: `node --version` (must be 20)
- Check if port 3001 is free: `lsof -ti:3001`
- Check backend logs for errors

**Network Error in frontend:**
- Backend not running
- Wrong backend URL (check `.env` file)
- CORS issues (should be fixed)

**DID creation fails:**
- Veramo not initialized (check backend logs)
- Database locked (delete `veramo.sqlite-journal`)
- Node.js version wrong

---

## Updated package.json Script

The backend now has a stable startup script. Update `package.json`:

```json
"scripts": {
  "start": "./start-stable.sh",
  "start:direct": "node server.js"
}
```

---

## Quick Test

After starting all services:

1. Open browser: http://localhost:5173
2. Go to Patient tab
3. Click "Create DID"
4. Check browser console (F12) for logs
5. Check backend terminal for logs

**Expected:**
- Backend: "📝 Creating DID..." → "✅ DID created: did:key:..."
- Frontend: Success message with DID

---

## If Still Not Working

### Complete Reset:
```bash
# Stop everything
pkill -f node
pkill -f ipfs

# Clean backend
cd /Users/ayushranjan/Desktop/bct1/backend
rm -rf node_modules package-lock.json veramo.sqlite*

# Reinstall
npm install

# Start fresh
nvm use 20
./start-stable.sh
```

---

**The fixes are applied. Restart the backend and try again!** 🚀


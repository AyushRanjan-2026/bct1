# How to Run the Project (Fixed)

## Prerequisites
- Node.js v20 (use `nvm use 20` if you have nvm)
- npm installed

## Step 1: Start the Backend

```bash
cd /Users/ayushranjan/Desktop/bct1/backend
nvm use 20
npm start
```

The backend should start on `http://localhost:3001`

**Verify it's working:**
```bash
curl http://localhost:3001/health
# Should return: {"status":"ok","timestamp":"..."}
```

## Step 2: Start the Frontend

Open a **new terminal window** and run:

```bash
cd /Users/ayushranjan/Desktop/bct1/frontend
npm run dev
```

The frontend should start on `http://localhost:5173`

## Step 3: Access the Application

Open your browser and go to: **http://localhost:5173**

## Features Working:

✅ **Create DID** - Works for Patient, Insurer, and Provider
✅ **Issue Verifiable Credentials** - Dynamic VC generation with QR codes
✅ **Policy Requests** - Patient can request policies, Insurer can view them
✅ **QR Code Display** - All VCs can be displayed as QR codes

## Troubleshooting

### Port 3001 already in use:
```bash
lsof -ti:3001 | xargs kill -9
```

### Backend not starting:
1. Make sure you're using Node.js v20: `nvm use 20`
2. Reinstall dependencies: `cd backend && rm -rf node_modules && npm install`
3. Check backend logs for errors

### Frontend not connecting:
1. Make sure backend is running on port 3001
2. Check browser console for errors
3. Verify `VITE_BACKEND_URL` in frontend `.env` (if exists) or it defaults to `http://localhost:3001`

## API Endpoints

- `GET /health` - Health check
- `POST /did/create` - Create a new DID
- `POST /vc/issue` - Issue a verifiable credential
- `POST /policy/request` - Submit a policy request
- `GET /policy/requests` - Get all policy requests

## Notes

- IPFS upload is optional (will skip if IPFS daemon is not running)
- On-chain operations are simplified (basic functionality only)
- All VCs are stored locally in JSON files
- QR codes are generated dynamically from VC data


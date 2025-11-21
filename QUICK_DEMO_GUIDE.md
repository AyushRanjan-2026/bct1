# Quick Demo Guide - Step-by-Step Commands

## Pre-Demo Setup (Run in separate terminals)

### Terminal 1: Hardhat Node
```bash
cd /Users/ayushranjan/Desktop/bct1
npm run node
```
**Keep this running** - Note the account addresses and private keys shown

### Terminal 2: Deploy Contracts
```bash
cd /Users/ayushranjan/Desktop/bct1
npm run deploy
```
**Wait for deployment** - Note the contract addresses in `deployments.json`

### Terminal 3: IPFS Daemon
```bash
ipfs daemon
```
**Keep this running** - Should show "Daemon is ready"

### Terminal 4: Backend Server
```bash
cd /Users/ayushranjan/Desktop/bct1/backend
npm start
```
**Keep this running** - Should show "Backend server running on http://localhost:3001"

### Terminal 5: Frontend
```bash
cd /Users/ayushranjan/Desktop/bct1/frontend
npm run dev
```
**Keep this running** - Should show "Local: http://localhost:5173"

---

## Demo Steps (Follow in Order)

### Step 1: Patient Creates DID
1. Open browser: http://localhost:5173
2. Click "Patient" tab
3. Click "Connect MetaMask"
4. Select Account 1 (or import from Hardhat)
5. Click "Create DID"
6. **Result**: DID appears (e.g., `did:key:z6Mk...`)

### Step 2: Patient Registers on Blockchain
1. Click "Register on Blockchain"
2. Enter Account 1 private key (from Hardhat output)
3. Click "Register"
4. **Result**: "Registered on blockchain as Patient"

### Step 3: Patient Requests Policy
1. Coverage Amount: `1000000000000000000`
2. Additional Details: `{"premium": "100", "duration": "12"}`
3. Click "Submit Policy Request"
4. **Result**: "Policy request submitted successfully!"

### Step 4: Insurer Creates DID
1. Click "Insurer" tab
2. Click "Connect MetaMask"
3. Switch to Account 2 in MetaMask
4. Click "Create Insurer DID"
5. **Result**: Insurer DID appears

### Step 5: Insurer Issues VC + Policy
1. See policy request from Step 3
2. Check "Create on-chain policy when issuing VC"
3. Enter Account 2 private key
4. Click "Issue VC + Create On-Chain Policy"
5. **Result**: Success with CID and Policy ID

### Step 6: Provider Uploads File
1. Click "Provider" tab
2. Click "Connect MetaMask"
3. Switch to Account 3 in MetaMask
4. Click file upload area, select a file
5. Click "Upload to IPFS"
6. **Result**: IPFS CID appears

### Step 7: Provider Submits Claim
1. Policy ID: `1` (from Step 5)
2. VC CID: (from Step 5)
3. Beneficiary: Account 1 address
4. Insurer: Account 2 address
5. Amount: `500000000000000000`
6. Private Key: Account 3 private key
7. Click "Submit Claim"
8. **Result**: "Claim submitted successfully! Claim ID: [ID]"

### Step 8: Insurer Approves Claim (via API)
```bash
curl -X POST http://localhost:3001/onchain/insurerAction \
  -H "Content-Type: application/json" \
  -d '{
    "privateKey": "ACCOUNT_2_PRIVATE_KEY",
    "claimId": "1",
    "action": "setUnderReview"
  }'

curl -X POST http://localhost:3001/onchain/insurerAction \
  -H "Content-Type: application/json" \
  -d '{
    "privateKey": "ACCOUNT_2_PRIVATE_KEY",
    "claimId": "1",
    "action": "approveClaim"
  }'

curl -X POST http://localhost:3001/onchain/insurerAction \
  -H "Content-Type: application/json" \
  -d '{
    "privateKey": "ACCOUNT_2_PRIVATE_KEY",
    "claimId": "1",
    "action": "markPaid"
  }'
```

---

## Quick Verification Commands

### Check Deployments
```bash
cat deployments.json
```

### Check Policy Requests
```bash
cat backend/policy-requests.json
```

### Check VC Store
```bash
cat backend/vc-store.json
```

### Test Backend Health
```bash
curl http://localhost:3001/health
```

---

## Troubleshooting

### If MetaMask won't connect:
- Ensure Hardhat node is running
- Check MetaMask network: localhost:8545, Chain ID: 1337
- Reset MetaMask account if needed

### If IPFS fails:
- Check `ipfs daemon` is running
- Verify port 5001 is accessible
- Check backend logs for IPFS errors

### If contracts not found:
- Run `npm run deploy` again
- Check `deployments.json` exists
- Verify Hardhat node is running

### If backend errors:
- Check all dependencies installed: `npm install`
- Verify Veramo database initialized
- Check port 3001 is not in use

---

## Demo Data Reference

### Sample Values:
- **Coverage Amount**: `1000000000000000000` (1 ETH)
- **Claim Amount**: `500000000000000000` (0.5 ETH)
- **Policy ID**: Usually starts at `1`
- **Claim ID**: Usually starts at `1`

### Account Roles:
- **Account 1**: Patient
- **Account 2**: Insurer  
- **Account 3**: Provider

---

## Time Estimates

- Setup: 5 minutes
- Step 1-3 (Patient): 3 minutes
- Step 4-5 (Insurer): 3 minutes
- Step 6-7 (Provider): 3 minutes
- Step 8 (Approval): 1 minute
- **Total**: ~15 minutes

---

**Ready to demo! 🚀**


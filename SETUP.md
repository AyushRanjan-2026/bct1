# Quick Setup Guide

## Step 1: Install Dependencies

```bash
# Root (Hardhat)
npm install

# Backend
cd backend && npm install && cd ..

# Frontend
cd frontend && npm install && cd ..
```

## Step 2: Start IPFS

```bash
# Install IPFS: https://docs.ipfs.tech/install/command-line/
# Then start daemon:
ipfs daemon
```

## Step 3: Deploy Contracts

```bash
# Terminal 1: Start Hardhat node
npm run node

# Terminal 2: Deploy contracts
npm run deploy
```

## Step 4: Start Backend

```bash
cd backend
npm start
```

## Step 5: Start Frontend

```bash
cd frontend
# Create .env file: VITE_BACKEND_URL=http://localhost:3001
npm run dev
```

## Step 6: Configure MetaMask

1. Open MetaMask
2. Add Network:
   - Network Name: Hardhat Local
   - RPC URL: http://127.0.0.1:8545
   - Chain ID: 1337
   - Currency Symbol: ETH
3. Import one of the Hardhat test accounts (private keys shown when you run `npm run node`)

## Testing the Flow

1. **Patient**: 
   - Connect wallet
   - Create DID
   - Request policy (coverage amount in wei, e.g., 1000000000000000000)

2. **Insurer**:
   - Connect wallet
   - Create DID
   - View policy requests
   - Issue VC (optionally create on-chain policy)

3. **Provider**:
   - Connect wallet
   - Upload medical report to IPFS
   - Submit claim with VC CID and policy details

4. **Insurer**:
   - Review and manage claims (approve/reject/mark paid)


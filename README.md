# Medical Policy Automation (MPA)

A complete full-stack blockchain + SSI (Self-Sovereign Identity) system for medical policy automation using Solidity, Hardhat, Node.js, Express, Veramo SSI, IPFS, and React.

## Project Structure

```
mpa/
├── contracts/              # Smart contracts (Solidity)
│   ├── IdentityRegistry.sol
│   ├── PolicyContract.sol
│   └── ClaimContract.sol
├── scripts/                # Hardhat deployment scripts
│   └── deploy.js
├── backend/                # Node.js + Express backend
│   ├── server.js
│   ├── veramo-setup.js
│   ├── ipfs-service.js
│   ├── contract-service.js
│   ├── vc-service.js
│   └── vc-utils.js
└── frontend/               # React + Vite frontend
    └── src/
        ├── App.jsx
        ├── PatientDashboard.jsx
        ├── InsurerDashboard.jsx
        ├── ProviderDashboard.jsx
        ├── ConnectWallet.jsx
        └── api.js
```

## Prerequisites

- Node.js (v18+)
- npm or yarn
- MetaMask browser extension
- IPFS daemon (local)
- Hardhat localhost node

## Setup Instructions

### 1. Install Dependencies

```bash
# Root (Hardhat)
npm install

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Start IPFS Daemon

```bash
# Install IPFS if not already installed
# https://docs.ipfs.tech/install/command-line/

# Start IPFS daemon
ipfs daemon
```

The IPFS daemon should be running on `http://127.0.0.1:5001`

### 3. Deploy Smart Contracts

```bash
# Terminal 1: Start Hardhat node
npm run node

# Terminal 2: Deploy contracts
npm run deploy
```

This will create a `deployments.json` file with contract addresses.

### 4. Start Backend Server

```bash
cd backend
npm start
```

Backend runs on `http://localhost:3001`

### 5. Start Frontend

```bash
cd frontend
# Create .env file with:
# VITE_BACKEND_URL=http://localhost:3001
npm run dev
```

Frontend runs on `http://localhost:5173`

## System Flow

### 1. Patient Flow
- **Create DID**: Patient creates a decentralized identifier
- **Register on Blockchain**: Register identity with role "Patient"
- **Request Policy**: Submit a policy request with coverage amount

### 2. Insurer Flow
- **View Policy Requests**: See all pending policy requests
- **Issue VC**: Create and issue a Verifiable Credential for the policy
- **Create On-Chain Policy** (optional): Deploy policy to blockchain

### 3. Provider Flow
- **Upload Medical Report**: Upload file to IPFS
- **Submit Claim**: Submit claim with VC validation, IPFS hash, and policy details

### 4. Insurer Claim Management
- **Review Claims**: View submitted claims
- **Approve/Reject**: Change claim state
- **Mark Paid**: Finalize approved claims

## API Endpoints

### DID Management
- `POST /did/create` - Create a new DID

### Policy Management
- `POST /policy/request` - Submit policy request
- `GET /policy/requests` - Get all policy requests

### Verifiable Credentials
- `POST /vc/issue` - Issue a VC
- `GET /vc/:policyId` - Get VC by policy ID
- `POST /vc/verify` - Verify a VC

### IPFS
- `POST /file/upload` - Upload file to IPFS
- `GET /file/:cid` - Retrieve file from IPFS

### On-Chain Operations
- `POST /onchain/register` - Register identity on blockchain
- `POST /onchain/issuePolicy` - Issue policy on blockchain
- `POST /onchain/submitClaim` - Submit claim on blockchain
- `POST /onchain/insurerAction` - Insurer actions (approve/reject/markPaid)

## Smart Contracts

### IdentityRegistry
- Manages user identities and roles (Patient, Provider, Insurer)
- Functions: `register()`, `getRole()`

### PolicyContract
- Handles policy issuance
- Functions: `issuePolicy()`
- Events: `PolicyIssued`

### ClaimContract
- Manages insurance claims
- States: Submitted, UnderReview, Approved, Rejected, Paid
- Functions: `submitClaim()`, `setUnderReview()`, `approveClaim()`, `rejectClaim()`, `markPaid()`

## Environment Variables

### Backend (.env)
```
PORT=3001
RPC_URL=http://127.0.0.1:8545
IPFS_URL=http://127.0.0.1:5001
SECRET_KEY=your-secret-key-here
```

### Frontend (.env)
```
VITE_BACKEND_URL=http://localhost:3001
```

## Technologies Used

- **Blockchain**: Solidity, Hardhat, Ethers.js v6
- **Backend**: Node.js, Express, Veramo SSI
- **Storage**: IPFS (local daemon)
- **Frontend**: React, Vite, Ethers.js v6
- **Identity**: Veramo (DID + VC)

## Notes

- Private keys are handled in the frontend for demo purposes. In production, use secure key management.
- IPFS daemon must be running locally.
- Hardhat node must be running for on-chain operations.
- MetaMask should be connected to Hardhat localhost network (Chain ID: 1337).

## Troubleshooting

1. **IPFS Connection Error**: Ensure IPFS daemon is running on port 5001
2. **Contract Not Found**: Deploy contracts first using `npm run deploy`
3. **Wallet Connection Issues**: Ensure MetaMask is installed and connected to localhost:8545
4. **Veramo Errors**: Check that SQLite database is created properly

## License

MIT


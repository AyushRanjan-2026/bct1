# Medical Policy Automation (MPA) - Project Summary

## ✅ Complete Implementation

This project implements a full-stack blockchain + SSI system for medical policy automation with the following components:

### 📋 Smart Contracts (Solidity + Hardhat)

1. **IdentityRegistry.sol**
   - ✅ `register(address, did, role)` function
   - ✅ `getRole(address)` function
   - ✅ Roles: Patient (1), Provider (2), Insurer (3)
   - ✅ `Registered` event

2. **PolicyContract.sol**
   - ✅ `issuePolicy()` function returning policyId
   - ✅ `PolicyIssued(policyId, insurer, beneficiary, coverageAmount)` event
   - ✅ Policy management functions

3. **ClaimContract.sol**
   - ✅ `submitClaim()` function
   - ✅ States: Submitted, UnderReview, Approved, Rejected, Paid
   - ✅ Insurer actions: `setUnderReview()`, `approveClaim()`, `rejectClaim()`, `markPaid()`

### 🔧 Backend (Node.js + Express)

**Service Files:**
- ✅ `server.js` - Main Express server
- ✅ `veramo-setup.js` - Veramo SSI agent configuration
- ✅ `ipfs-service.js` - IPFS integration (local daemon)
- ✅ `contract-service.js` - Ethers v6 contract interactions
- ✅ `vc-service.js` - Verifiable Credential management
- ✅ `vc-utils.js` - VC creation utilities
- ✅ `vc-store.json` - VC storage
- ✅ `policy-requests.json` - Policy request storage

**API Routes:**
- ✅ `POST /did/create` - Create DID
- ✅ `POST /policy/request` - Submit policy request
- ✅ `GET /policy/requests` - Get all policy requests
- ✅ `POST /vc/issue` - Issue VC (with optional on-chain policy)
- ✅ `GET /vc/:policyId` - Get VC by policy ID
- ✅ `POST /vc/verify` - Verify VC
- ✅ `POST /file/upload` - Upload to IPFS
- ✅ `GET /file/:cid` - Retrieve from IPFS
- ✅ `POST /onchain/register` - Register identity on blockchain
- ✅ `POST /onchain/issuePolicy` - Issue policy on blockchain
- ✅ `POST /onchain/submitClaim` - Submit claim on blockchain
- ✅ `POST /onchain/insurerAction` - Insurer claim actions

**Technologies:**
- ✅ Ethers.js v6
- ✅ Hardhat deployment artifacts
- ✅ Local IPFS (http://127.0.0.1:5001)
- ✅ Veramo SSI framework

### 🎨 Frontend (React + Vite)

**Components:**
- ✅ `App.jsx` - Main app with tab navigation
- ✅ `PatientDashboard.jsx` - Patient workflow
- ✅ `InsurerDashboard.jsx` - Insurer workflow
- ✅ `ProviderDashboard.jsx` - Provider workflow
- ✅ `ConnectWallet.jsx` - MetaMask wallet connection
- ✅ `api.js` - API client with `import.meta.env.VITE_BACKEND_URL`
- ✅ `vc-utils.js` - VC utilities

**Patient Features:**
- ✅ Create DID
- ✅ Register on blockchain
- ✅ Request policy

**Insurer Features:**
- ✅ View policy requests
- ✅ Issue VC
- ✅ Create on-chain policy (optional checkbox)

**Provider Features:**
- ✅ Upload medical report to IPFS
- ✅ Submit claim with VC CID + policyId

**Technologies:**
- ✅ React 18
- ✅ Vite
- ✅ Ethers.js v6
- ✅ Environment variable: `VITE_BACKEND_URL`

### 🔄 Complete End-to-End Flow

1. **Patient → DID Creation**
   - Patient creates DID via Veramo
   - DID stored in Veramo database

2. **Patient → Policy Request**
   - Patient submits policy request with coverage amount
   - Request stored in `policy-requests.json`

3. **Insurer → VC Issuance + On-Chain Policy**
   - Insurer views policy requests
   - Issues Verifiable Credential
   - Optionally creates on-chain policy via smart contract

4. **Provider → IPFS Upload**
   - Provider uploads medical report to IPFS
   - Receives IPFS CID

5. **Provider → Claim Submission**
   - Provider submits claim with:
     - VC CID (validated)
     - Policy ID
     - IPFS hash
     - Amount
   - Claim stored on blockchain

6. **Insurer → Claim Management**
   - Insurer can:
     - Set claim under review
     - Approve claim
     - Reject claim (with reason)
     - Mark approved claim as paid

## 📁 Project Structure

```
mpa/
├── contracts/
│   ├── IdentityRegistry.sol
│   ├── PolicyContract.sol
│   └── ClaimContract.sol
├── scripts/
│   └── deploy.js
├── backend/
│   ├── server.js
│   ├── veramo-setup.js
│   ├── ipfs-service.js
│   ├── contract-service.js
│   ├── vc-service.js
│   ├── vc-utils.js
│   ├── vc-store.json
│   └── policy-requests.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── PatientDashboard.jsx
│   │   ├── InsurerDashboard.jsx
│   │   ├── ProviderDashboard.jsx
│   │   ├── ConnectWallet.jsx
│   │   ├── api.js
│   │   └── vc-utils.js
│   └── vite.config.js
├── hardhat.config.js
├── package.json
└── README.md
```

## 🚀 Quick Start

1. Install dependencies (root, backend, frontend)
2. Start IPFS daemon: `ipfs daemon`
3. Deploy contracts: `npm run node` (Terminal 1), `npm run deploy` (Terminal 2)
4. Start backend: `cd backend && npm start`
5. Start frontend: `cd frontend && npm run dev`

## 📝 Notes

- Private keys are handled via user input in frontend (for demo). In production, use secure key management.
- IPFS daemon must run locally on port 5001
- Hardhat node must run on port 8545
- MetaMask should connect to localhost network (Chain ID: 1337)
- All environment variables use `VITE_` prefix in frontend (Vite requirement)
- Backend uses `process.env` for configuration

## ✨ Features Implemented

- ✅ Complete smart contract suite
- ✅ Veramo SSI integration (DID + VC)
- ✅ IPFS file storage
- ✅ Blockchain integration with Ethers v6
- ✅ Full CRUD operations for policies and claims
- ✅ Verifiable Credential issuance and verification
- ✅ Role-based access (Patient, Provider, Insurer)
- ✅ Modern React UI with Vite
- ✅ MetaMask wallet integration
- ✅ End-to-end workflow implementation

## 🎯 Requirements Met

All specified requirements have been implemented:
- ✅ Smart contracts with exact specifications
- ✅ Backend with all required services and routes
- ✅ Frontend with all dashboard components
- ✅ Ethers v6 throughout
- ✅ Hardhat localhost network
- ✅ IPFS local daemon integration
- ✅ Veramo SSI for DID/VC
- ✅ Complete end-to-end flow


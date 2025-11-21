# Medical Policy Automation (MPA) - Demonstration Script

## Project Overview (2 minutes)

**Opening Statement:**
"Good [morning/afternoon], [Teacher's Name]. Today I'll be demonstrating the Medical Policy Automation system, a full-stack blockchain application that combines Self-Sovereign Identity (SSI) with smart contracts to automate medical insurance policy management.

**Key Technologies:**
- **Blockchain**: Solidity smart contracts on Hardhat localhost
- **SSI**: Veramo framework for DID and Verifiable Credentials
- **Storage**: IPFS for decentralized file storage
- **Frontend**: React with TailwindCSS
- **Backend**: Node.js with Express

**The System Flow:**
1. Patient creates a DID and requests a policy
2. Insurer issues a Verifiable Credential and creates on-chain policy
3. Provider uploads medical reports to IPFS
4. Provider submits claims with VC validation
5. Insurer reviews and approves claims

Let me walk you through the complete workflow."

---

## Pre-Demonstration Setup (Before Presentation)

### Checklist:
- [ ] Hardhat node is running (`npm run node` in Terminal 1)
- [ ] Contracts are deployed (`npm run deploy` in Terminal 2)
- [ ] IPFS daemon is running (`ipfs daemon` in Terminal 3)
- [ ] Backend server is running (`cd backend && npm start` in Terminal 4)
- [ ] Frontend is running (`cd frontend && npm run dev` in Terminal 5)
- [ ] MetaMask is installed and connected to localhost:8545
- [ ] Have 3 MetaMask accounts ready (Patient, Insurer, Provider)

### Test Accounts Setup:
```
Account 1 (Patient): Import private key from Hardhat node
Account 2 (Insurer): Import private key from Hardhat node  
Account 3 (Provider): Import private key from Hardhat node
```

---

## Step 1: Patient Creates DID (2 minutes)

### What to Say:
"Let's start with the Patient role. The first step is creating a Decentralized Identifier (DID), which is a self-sovereign identity that the patient controls."

### Actions:
1. **Navigate to Patient Dashboard**
   - Click on "Patient" tab in navigation
   - Point out the clean, modern UI

2. **Connect Wallet**
   - Click "Connect MetaMask"
   - Select Account 1 (Patient account)
   - Show: "Connected: 0x..." appears

3. **Create DID**
   - Click "Create DID" button
   - **Expected Result**: A DID appears (e.g., `did:key:z6Mk...`)
   - **Explain**: "This DID is cryptographically generated and stored in Veramo's database. It's unique to this patient."

### What to Highlight:
- "Notice the DID format - it's a W3C standard decentralized identifier"
- "The patient now has a self-sovereign identity that they control"
- "This DID will be used throughout the system for identity verification"

---

## Step 2: Patient Registers on Blockchain (1 minute)

### What to Say:
"Now we'll register this patient's identity on the blockchain with their role."

### Actions:
1. **Register Identity**
   - Click "Register on Blockchain"
   - Enter the private key for Account 1 (Patient)
   - Click "Register"
   - **Expected Result**: "Registered on blockchain as Patient" message appears

### What to Highlight:
- "The IdentityRegistry smart contract now stores the patient's DID and role"
- "This creates an on-chain identity record that can be verified by anyone"
- "The role (Patient) is stored as an enum in the smart contract"

---

## Step 3: Patient Requests Policy (2 minutes)

### What to Say:
"The patient can now request a medical insurance policy by submitting their coverage requirements."

### Actions:
1. **Fill Policy Request Form**
   - Coverage Amount: Enter `1000000000000000000` (1 ETH in wei)
   - Additional Details: Enter `{"premium": "100", "duration": "12"}`
   - Click "Submit Policy Request"

2. **Expected Result**:
   - Success message: "Policy request submitted successfully!"
   - Form fields clear

### What to Highlight:
- "The policy request is stored in the backend database"
- "This creates a pending request that insurers can view"
- "The request includes the patient's DID, address, and coverage amount"

---

## Step 4: Insurer Views Requests & Creates DID (2 minutes)

### What to Say:
"Now let's switch to the Insurer role. The insurer needs to review policy requests and issue verifiable credentials."

### Actions:
1. **Switch to Insurer Dashboard**
   - Click "Insurer" tab
   - Show the dashboard loads

2. **Connect Insurer Wallet**
   - Click "Connect MetaMask"
   - Switch to Account 2 (Insurer account) in MetaMask
   - Show connection confirmation

3. **Create Insurer DID**
   - Click "Create Insurer DID"
   - **Expected Result**: Insurer DID appears

### What to Highlight:
- "The insurer also has their own DID for issuing credentials"
- "This ensures the credentials are cryptographically signed by the insurer"

---

## Step 5: Insurer Issues VC & Creates On-Chain Policy (3 minutes)

### What to Say:
"The insurer can now view pending policy requests and issue a Verifiable Credential. We can also optionally create an on-chain policy simultaneously."

### Actions:
1. **View Policy Requests**
   - Show the policy request from Step 3 appears
   - Point out: Patient DID, Address, Coverage Amount, Status: "pending"

2. **Enable On-Chain Policy Creation**
   - Check the checkbox: "Create on-chain policy when issuing VC"
   - **Explain**: "This will create both a VC and an on-chain smart contract policy"

3. **Issue VC with On-Chain Policy**
   - Enter the Insurer's private key (Account 2)
   - Click "Issue VC + Create On-Chain Policy"
   - **Expected Result**: 
     - Success message with VC CID and Policy ID
     - Request status updates (you may need to refresh)

### What to Highlight:
- **Verifiable Credential**: "The VC is a W3C standard credential that proves the policy exists"
- **IPFS Storage**: "The VC is uploaded to IPFS and we get a Content ID (CID)"
- **On-Chain Policy**: "The PolicyContract smart contract creates a policy with a unique ID"
- **Event Emission**: "The contract emits a PolicyIssued event with all details"

### Technical Details to Mention:
- "The VC contains the policy details and is cryptographically signed by the insurer's DID"
- "The on-chain policy is stored in the PolicyContract mapping"
- "Both can be independently verified"

---

## Step 6: Provider Uploads Medical Report (2 minutes)

### What to Say:
"Now let's switch to the Provider role. Healthcare providers need to upload medical reports to IPFS before submitting claims."

### Actions:
1. **Switch to Provider Dashboard**
   - Click "Provider" tab
   - Show the dashboard

2. **Connect Provider Wallet**
   - Click "Connect MetaMask"
   - Switch to Account 3 (Provider account)
   - Show connection

3. **Upload Medical Report**
   - Click the file upload area
   - Select a sample medical report file (PDF, DOC, or image)
   - Click "Upload to IPFS"
   - **Expected Result**: 
     - Success message appears
     - IPFS CID is displayed (e.g., `Qm...`)
     - Copy button available

### What to Highlight:
- **IPFS**: "IPFS is a decentralized file storage system"
- **CID**: "The Content ID (CID) is a unique hash of the file"
- **Immutable**: "Once uploaded, the file is immutable and can be retrieved using the CID"
- **Decentralized**: "The file is stored across the IPFS network, not on a central server"

---

## Step 7: Provider Submits Claim (3 minutes)

### What to Say:
"The provider can now submit a claim using the VC CID, IPFS hash, and policy details. The system validates the VC before accepting the claim."

### Actions:
1. **Fill Claim Form**
   - Policy ID: Enter the policy ID from Step 5 (e.g., `1`)
   - Click "Get VC" button (optional - retrieves VC for verification)
   - VC CID: Enter the CID from the VC issued in Step 5
   - Beneficiary Address: Enter Patient's address (Account 1)
   - Insurer Address: Enter Insurer's address (Account 2)
   - Claim Amount: Enter `500000000000000000` (0.5 ETH in wei)
   - Private Key: Enter Provider's private key (Account 3)

2. **Submit Claim**
   - Click "Submit Claim"
   - **Expected Result**: 
     - Success message: "Claim submitted successfully! Claim ID: [ID]"
     - Form clears

### What to Highlight:
- **VC Validation**: "The backend verifies the VC before accepting the claim"
- **On-Chain Storage**: "The claim is stored in the ClaimContract with state 'Submitted'"
- **Claim ID**: "Each claim gets a unique ID for tracking"
- **Event Emission**: "ClaimSubmitted event is emitted with all details"

### Technical Details:
- "The claim includes the IPFS hash of the medical report"
- "The VC CID proves the policy is valid"
- "The claim state machine starts at 'Submitted'"

---

## Step 8: Insurer Reviews & Approves Claim (2 minutes)

### What to Say:
"Finally, the insurer reviews the claim and can change its state through various actions."

### Actions:
1. **Switch Back to Insurer Dashboard**
   - Go to Insurer tab
   - (Note: For this demo, you'll need to use the backend API or add a claims view)

2. **View Claim States** (Explain the workflow):
   - **Submitted**: Initial state when provider submits
   - **UnderReview**: Insurer sets this when reviewing
   - **Approved**: Insurer approves the claim
   - **Rejected**: Insurer rejects with a reason
   - **Paid**: Final state after payment

3. **Demonstrate Claim Actions** (via API or add UI):
   - Use backend API endpoint: `POST /onchain/insurerAction`
   - Or explain: "The insurer can call smart contract functions:
     - `setUnderReview(claimId)`
     - `approveClaim(claimId)`
     - `rejectClaim(claimId, reason)`
     - `markPaid(claimId)`"

### What to Highlight:
- **State Machine**: "Claims follow a strict state machine"
- **Access Control**: "Only the insurer can change claim states"
- **Immutability**: "Once approved, the claim record is permanent on-chain"
- **Transparency**: "All state changes are recorded as events"

---

## Summary & Key Features (2 minutes)

### What to Say:
"Let me summarize what we've demonstrated and highlight the key features of this system."

### Key Points to Cover:

1. **Self-Sovereign Identity (SSI)**
   - "Patients control their own identity through DIDs"
   - "No central authority manages identities"
   - "Verifiable Credentials provide cryptographic proof"

2. **Blockchain Integration**
   - "Smart contracts ensure transparency and immutability"
   - "All policy and claim data is stored on-chain"
   - "Events provide an audit trail"

3. **Decentralized Storage**
   - "IPFS stores medical reports without central servers"
   - "Content-addressed storage ensures data integrity"
   - "CIDs provide permanent references"

4. **End-to-End Workflow**
   - "Complete automation from policy request to claim approval"
   - "Role-based access control (Patient, Provider, Insurer)"
   - "VC validation ensures policy authenticity"

5. **Modern UI/UX**
   - "Clean, professional interface built with TailwindCSS"
   - "Responsive design for all devices"
   - "Smooth animations and transitions"

### Technical Architecture:
- **Frontend**: React + Vite + TailwindCSS + Ethers.js v6
- **Backend**: Node.js + Express + Veramo SSI + IPFS
- **Blockchain**: Solidity + Hardhat + Localhost network
- **Storage**: IPFS daemon + SQLite (for Veramo)

---

## Q&A Preparation

### Potential Questions & Answers:

**Q: Why use SSI instead of traditional identity?**
A: "SSI gives patients control over their identity. They can prove their identity without revealing unnecessary information, and credentials are portable across systems."

**Q: What happens if IPFS goes down?**
A: "IPFS is a distributed network. As long as at least one node has the file, it's accessible. For production, we'd use IPFS pinning services for redundancy."

**Q: How do you handle private keys securely?**
A: "In this demo, we use private key input for simplicity. In production, we'd use hardware wallets, key management services, or wallet integrations like MetaMask."

**Q: What's the gas cost?**
A: "On localhost, gas is free. On mainnet, costs depend on network congestion. We've optimized contracts to minimize gas usage."

**Q: Can this scale?**
A: "Yes. The system uses Layer 2 solutions, IPFS for large files, and can be deployed on scalable blockchains. The architecture supports horizontal scaling."

**Q: How do you ensure data privacy?**
A: "Medical reports are stored on IPFS with encryption. Only authorized parties (with VC) can access claims. Zero-knowledge proofs could be added for enhanced privacy."

---

## Troubleshooting Guide

### Common Issues During Demo:

1. **MetaMask Connection Issues**
   - Ensure MetaMask is connected to localhost:8545
   - Chain ID should be 1337
   - Refresh the page if needed

2. **IPFS Connection Error**
   - Check IPFS daemon is running: `ipfs daemon`
   - Verify it's on port 5001
   - Check backend logs for connection errors

3. **Contract Not Found**
   - Ensure contracts are deployed: `npm run deploy`
   - Check `deployments.json` exists
   - Verify Hardhat node is running

4. **VC Issuance Fails**
   - Check Veramo database is initialized
   - Verify DID is created before issuing VC
   - Check backend logs for Veramo errors

5. **Transaction Fails**
   - Ensure account has enough balance (Hardhat provides test ETH)
   - Check private key is correct
   - Verify contract addresses in deployments.json

---

## Demo Checklist

### Before Starting:
- [ ] All services running (Hardhat, IPFS, Backend, Frontend)
- [ ] MetaMask configured with 3 accounts
- [ ] Test file ready for upload
- [ ] Browser tabs organized
- [ ] Screen sharing ready (if remote)

### During Demo:
- [ ] Speak clearly and explain each step
- [ ] Show code/contracts if time permits
- [ ] Highlight technical decisions
- [ ] Demonstrate error handling
- [ ] Show the complete flow without rushing

### After Demo:
- [ ] Summarize key achievements
- [ ] Mention future improvements
- [ ] Thank the audience
- [ ] Be ready for questions

---

## Additional Talking Points

### If Time Permits:

1. **Show Smart Contract Code**
   - Open `contracts/PolicyContract.sol`
   - Explain the `issuePolicy` function
   - Show event definitions

2. **Show Backend API**
   - Open `backend/server.js`
   - Explain the VC issuance endpoint
   - Show IPFS integration

3. **Show Frontend Components**
   - Open `frontend/src/PatientDashboard.jsx`
   - Explain React hooks and state management
   - Show TailwindCSS styling

4. **Demonstrate Verification**
   - Show how to verify a VC
   - Explain cryptographic signatures
   - Show IPFS file retrieval

---

## Closing Statement

"Thank you for your attention. This Medical Policy Automation system demonstrates how blockchain, SSI, and decentralized storage can work together to create a transparent, secure, and user-controlled healthcare insurance system. The combination of Verifiable Credentials, smart contracts, and IPFS provides a foundation for trustless interactions while maintaining user privacy and data sovereignty.

Are there any questions?"

---

## Estimated Total Time: 15-20 minutes

- Overview: 2 minutes
- Step 1-3 (Patient): 5 minutes
- Step 4-5 (Insurer VC): 5 minutes
- Step 6-7 (Provider Claim): 5 minutes
- Step 8 (Approval): 2 minutes
- Summary & Q&A: 3-5 minutes

---

**Good luck with your presentation! 🎓**


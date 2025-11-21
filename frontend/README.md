# MPA Frontend

React + Vite frontend for Medical Policy Automation system.

## Setup

```bash
npm install
npm run dev
```

## Environment Variables

Create a `.env` file:

```
VITE_BACKEND_URL=http://localhost:3001
```

## Features

- **Patient Dashboard**: Create DID, request policies
- **Insurer Dashboard**: View requests, issue VCs, manage policies
- **Provider Dashboard**: Upload files to IPFS, submit claims

## Dependencies

- React 18
- Vite
- Ethers.js v6
- Axios

## Usage

1. Connect MetaMask wallet
2. Select your role (Patient/Insurer/Provider)
3. Follow the workflow for your role


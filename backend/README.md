# MPA Backend

Express server with Veramo SSI, IPFS integration, and blockchain contract interactions.

## Setup

```bash
npm install
npm start
```

## Environment Variables

Create a `.env` file:

```
PORT=3001
RPC_URL=http://127.0.0.1:8545
IPFS_URL=http://127.0.0.1:5001
SECRET_KEY=your-secret-key-here
```

## Dependencies

- Express - Web server
- Veramo - SSI framework for DID/VC
- IPFS HTTP Client - IPFS integration
- Ethers.js v6 - Blockchain interactions
- TypeORM - Database (SQLite for Veramo)

## Files

- `server.js` - Main Express server with all routes
- `veramo-setup.js` - Veramo agent configuration
- `ipfs-service.js` - IPFS upload/retrieve functions
- `contract-service.js` - Smart contract interaction helpers
- `vc-service.js` - Verifiable Credential management
- `vc-utils.js` - VC creation utilities


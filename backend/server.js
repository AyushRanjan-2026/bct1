import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createDID, issueVC, verifyVC, getVCByPolicyId, addPolicyRequest, getPolicyRequests, updatePolicyRequest } from './vc-service.js';
import { uploadToIPFS, getFromIPFS } from './ipfs-service.js';
import { getContract, getSigner } from './contract-service.js';
import { createPolicyVC } from './vc-utils.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// DID Routes
app.post('/did/create', async (req, res) => {
  try {
    console.log('📝 Creating DID...');
    
    // Check if Veramo initialization failed
    if (veramoInitError) {
      return res.status(503).json({ 
        error: `Veramo initialization failed: ${veramoInitError.message}. Please check backend logs and restart server.`, 
        success: false 
      });
    }
    
    // Wait for Veramo to initialize (max 10 seconds)
    if (!veramoReady) {
      console.log('⏳ Waiting for Veramo to initialize...');
      let waitCount = 0;
      while (!veramoReady && waitCount < 20) {
        await new Promise(resolve => setTimeout(resolve, 500));
        waitCount++;
      }
      
      if (!veramoReady) {
        return res.status(503).json({ 
          error: 'Veramo is still initializing. Please wait a few seconds and try again.', 
          success: false 
        });
      }
    }
    
    const did = await createDID();
    console.log('✅ DID created:', did);
    res.json({ did, success: true });
  } catch (error) {
    console.error('❌ DID creation error:', error);
    console.error('❌ Error message:', error.message);
    if (error.stack) {
      console.error('❌ Error stack (first 5 lines):', error.stack.split('\n').slice(0, 5).join('\n'));
    }
    res.status(500).json({ 
      error: error.message || 'Failed to create DID. Check backend logs for details.', 
      success: false
    });
  }
});

// Policy Request Routes
app.post('/policy/request', async (req, res) => {
  try {
    const { patientDid, patientAddress, coverageAmount, details } = req.body;
    if (!patientDid || !patientAddress || !coverageAmount) {
      return res.status(400).json({ error: 'Missing required fields', success: false });
    }

    const request = addPolicyRequest({
      patientDid,
      patientAddress,
      coverageAmount,
      details: details || {},
    });

    res.json({ request, success: true });
  } catch (error) {
    console.error('Policy request error:', error);
    res.status(500).json({ error: error.message, success: false });
  }
});

app.get('/policy/requests', async (req, res) => {
  try {
    const requests = getPolicyRequests();
    res.json({ requests, success: true });
  } catch (error) {
    console.error('Get policy requests error:', error);
    res.status(500).json({ error: error.message, success: false });
  }
});

// VC Routes
app.post('/vc/issue', async (req, res) => {
  try {
    const { credential, issuerDid, createOnchain } = req.body;
    if (!credential || !issuerDid) {
      return res.status(400).json({ error: 'Missing credential or issuerDid', success: false });
    }

    const result = await issueVC(credential, issuerDid);

    let onchainPolicyId = null;
    if (createOnchain && credential.credentialSubject) {
      try {
        const { insurerPrivateKey, beneficiary, coverageAmount } = req.body;
        if (!insurerPrivateKey || !beneficiary || !coverageAmount) {
          throw new Error('Missing on-chain parameters');
        }

        const signer = await getSigner(insurerPrivateKey);
        const policyContract = getContract('PolicyContract', signer);
        
        const tx = await policyContract.issuePolicy(beneficiary, coverageAmount);
        const receipt = await tx.wait();
        
        // Extract policyId from event (ethers v6)
        if (receipt && receipt.logs) {
          for (const log of receipt.logs) {
            try {
              const parsed = policyContract.interface.parseLog({
                topics: log.topics || [],
                data: log.data || '0x'
              });
              if (parsed && parsed.name === 'PolicyIssued') {
                onchainPolicyId = parsed.args.policyId.toString();
                break;
              }
            } catch (e) {
              // Continue to next log
            }
          }
        }
      } catch (onchainError) {
        console.error('On-chain policy creation error:', onchainError);
        // Continue even if on-chain fails
      }
    }

    res.json({
      vc: result.vc,
      cid: result.cid,
      onchainPolicyId,
      success: true,
    });
  } catch (error) {
    console.error('VC issue error:', error);
    res.status(500).json({ error: error.message, success: false });
  }
});

app.get('/vc/:policyId', async (req, res) => {
  try {
    const { policyId } = req.params;
    const vc = getVCByPolicyId(policyId);
    if (!vc) {
      return res.status(404).json({ error: 'VC not found', success: false });
    }
    res.json({ vc, success: true });
  } catch (error) {
    console.error('Get VC error:', error);
    res.status(500).json({ error: error.message, success: false });
  }
});

app.post('/vc/verify', async (req, res) => {
  try {
    const { vcJwt } = req.body;
    if (!vcJwt) {
      return res.status(400).json({ error: 'Missing VC JWT', success: false });
    }

    const result = await verifyVC(vcJwt);
    res.json({ result, success: true });
  } catch (error) {
    console.error('VC verify error:', error);
    res.status(500).json({ error: error.message, success: false });
  }
});

// IPFS Routes
app.post('/file/upload', async (req, res) => {
  try {
    const { data, filename } = req.body;
    if (!data) {
      return res.status(400).json({ error: 'Missing file data', success: false });
    }

    // Handle base64 or raw data
    let fileData;
    if (typeof data === 'string') {
      // Try to decode as base64, fallback to treating as raw string
      try {
        if (typeof Buffer !== 'undefined') {
          fileData = Buffer.from(data, 'base64');
        } else {
          // Node.js should have Buffer, but fallback just in case
          fileData = data;
        }
      } catch {
        fileData = data;
      }
    } else {
      fileData = data;
    }
    const cid = await uploadToIPFS(fileData);

    res.json({ cid, filename: filename || 'uploaded-file', success: true });
  } catch (error) {
    console.error('IPFS upload error:', error);
    res.status(500).json({ error: error.message, success: false });
  }
});

app.get('/file/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const data = await getFromIPFS(cid);
    res.json({ data, success: true });
  } catch (error) {
    console.error('IPFS retrieval error:', error);
    res.status(500).json({ error: error.message, success: false });
  }
});

// On-chain Routes
app.post('/onchain/register', async (req, res) => {
  try {
    const { privateKey, account, did, role } = req.body;
    if (!privateKey || !account || !did || role === undefined) {
      return res.status(400).json({ error: 'Missing required fields', success: false });
    }

    const signer = await getSigner(privateKey);
    const identityRegistry = getContract('IdentityRegistry', signer);
    
    const tx = await identityRegistry.register(account, did, role);
    await tx.wait();

    res.json({ success: true, txHash: tx.hash });
  } catch (error) {
    console.error('On-chain register error:', error);
    res.status(500).json({ error: error.message, success: false });
  }
});

app.post('/onchain/issuePolicy', async (req, res) => {
  try {
    const { privateKey, beneficiary, coverageAmount } = req.body;
    if (!privateKey || !beneficiary || !coverageAmount) {
      return res.status(400).json({ error: 'Missing required fields', success: false });
    }

    const signer = await getSigner(privateKey);
    const policyContract = getContract('PolicyContract', signer);
    
    const tx = await policyContract.issuePolicy(beneficiary, coverageAmount);
    const receipt = await tx.wait();

    // Extract policyId from event (ethers v6)
    let policyId = null;
    if (receipt && receipt.logs) {
      for (const log of receipt.logs) {
        try {
          const parsed = policyContract.interface.parseLog({
            topics: log.topics || [],
            data: log.data || '0x'
          });
          if (parsed && parsed.name === 'PolicyIssued') {
            policyId = parsed.args.policyId.toString();
            break;
          }
        } catch (e) {
          // Continue to next log
        }
      }
    }

    res.json({ success: true, policyId, txHash: tx.hash });
  } catch (error) {
    console.error('On-chain issue policy error:', error);
    res.status(500).json({ error: error.message, success: false });
  }
});

app.post('/onchain/submitClaim', async (req, res) => {
  try {
    const { privateKey, policyId, beneficiary, insurer, ipfsHash, vcCid, amount } = req.body;
    if (!privateKey || !policyId || !beneficiary || !insurer || !ipfsHash || !vcCid || !amount) {
      return res.status(400).json({ error: 'Missing required fields', success: false });
    }

    // Verify VC first
    try {
      const vcData = await getFromIPFS(vcCid);
      const vc = JSON.parse(vcData);
      await verifyVC(vc.proof?.jwt || vc);
    } catch (vcError) {
      console.warn('VC verification warning:', vcError.message);
      // Continue anyway, but log the warning
    }

    const signer = await getSigner(privateKey);
    const claimContract = getContract('ClaimContract', signer);
    
    const tx = await claimContract.submitClaim(
      policyId,
      beneficiary,
      insurer,
      ipfsHash,
      vcCid,
      amount
    );
    const receipt = await tx.wait();

    // Extract claimId from event (ethers v6)
    let claimId = null;
    if (receipt && receipt.logs) {
      for (const log of receipt.logs) {
        try {
          const parsed = claimContract.interface.parseLog({
            topics: log.topics || [],
            data: log.data || '0x'
          });
          if (parsed && parsed.name === 'ClaimSubmitted') {
            claimId = parsed.args.claimId.toString();
            break;
          }
        } catch (e) {
          // Continue to next log
        }
      }
    }

    res.json({ success: true, claimId, txHash: tx.hash });
  } catch (error) {
    console.error('On-chain submit claim error:', error);
    res.status(500).json({ error: error.message, success: false });
  }
});

app.post('/onchain/insurerAction', async (req, res) => {
  try {
    const { privateKey, claimId, action, reason } = req.body;
    if (!privateKey || !claimId || !action) {
      return res.status(400).json({ error: 'Missing required fields', success: false });
    }

    const signer = await getSigner(privateKey);
    const claimContract = getContract('ClaimContract', signer);
    
    let tx;
    switch (action) {
      case 'setUnderReview':
        tx = await claimContract.setUnderReview(claimId);
        break;
      case 'approveClaim':
        tx = await claimContract.approveClaim(claimId);
        break;
      case 'rejectClaim':
        if (!reason) {
          return res.status(400).json({ error: 'Reason required for rejection', success: false });
        }
        tx = await claimContract.rejectClaim(claimId, reason);
        break;
      case 'markPaid':
        tx = await claimContract.markPaid(claimId);
        break;
      default:
        return res.status(400).json({ error: 'Invalid action', success: false });
    }

    await tx.wait();

    res.json({ success: true, txHash: tx.hash, action });
  } catch (error) {
    console.error('On-chain insurer action error:', error);
    res.status(500).json({ error: error.message, success: false });
  }
});

// Veramo initialization state (module-level)
let veramoReady = false;
let veramoInitError = null;

// Initialize Veramo in background (don't block server startup)
(async () => {
  try {
    console.log('🔄 Initializing Veramo...');
    const getVeramoAgent = (await import('./veramo-setup.js')).default;
    // Test initialization
    await getVeramoAgent();
    veramoReady = true;
    console.log('✅ Veramo initialization completed');
  } catch (error) {
    veramoInitError = error;
    console.error('⚠️  Veramo initialization error:', error.message);
    if (error.stack) {
      console.error('⚠️  Error stack:', error.stack.split('\n').slice(0, 5).join('\n'));
    }
    console.log('⚠️  Server is running, but DID/VC features may not work');
    veramoReady = false;
  }
})();

// Start server (doesn't wait for Veramo)
app.listen(PORT, () => {
  console.log(`\n🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📋 Make sure Hardhat node is running on http://127.0.0.1:8545`);
  console.log(`📦 Make sure IPFS daemon is running on http://127.0.0.1:5001`);
  console.log(`\n✅ Server ready to accept requests\n`);
});


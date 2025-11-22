import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createDID, addPolicyRequest, getPolicyRequests, issueVC, createRoleCredential } from './vc-service.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// --- Health -------------------------------------------------
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --- DID creation ------------------------------------------
app.post('/did/create', async (_req, res) => {
  try {
    const did = await createDID();
    res.json({ success: true, did });
  } catch (error) {
    console.error('DID creation failed:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create DID',
    });
  }
});

// --- Policy requests (lightweight JSON store) ---------------
app.post('/policy/request', (req, res) => {
  try {
    const { patientDid, patientAddress, coverageAmount, details } = req.body;
    if (!patientDid || !patientAddress || !coverageAmount) {
      return res
        .status(400)
        .json({ success: false, error: 'patientDid, patientAddress and coverageAmount are required' });
    }

    const request = addPolicyRequest({
      patientDid,
      patientAddress,
      coverageAmount,
      details: details || {},
    });

    res.json({ success: true, request });
  } catch (error) {
    console.error('Policy request failed:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/policy/requests', (_req, res) => {
  try {
    res.json({ success: true, requests: getPolicyRequests() });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// --- Generic VC issuance ------------------------------------
app.post('/vc/issue', async (req, res) => {
  try {
    const { issuerDid, subjectDid, role, data } = req.body;
    if (!issuerDid || !subjectDid || !role) {
      return res.status(400).json({
        success: false,
        error: 'issuerDid, subjectDid, and role are required',
      });
    }

    const credential = createRoleCredential({ issuerDid, subjectDid, role, data });
    const result = await issueVC(credential, issuerDid);

    res.json({
      success: true,
      vc: result.vc,
      cid: result.cid,
    });
  } catch (error) {
    console.error('VC issuance failed:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to issue credential',
    });
  }
});

// --- Get VC by policy ID ------------------------------------
app.get('/vc/policy/:policyId', async (req, res) => {
  try {
    const { policyId } = req.params;
    const { getVCByPolicyId } = await import('./vc-service.js');
    const vc = getVCByPolicyId(policyId);
    
    if (vc) {
      res.json({ success: true, vc });
    } else {
      res.json({ success: false, vc: null });
    }
  } catch (error) {
    console.error('Get VC by policy ID failed:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get VC',
    });
  }
});

// --- start server ------------------------------------------
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});


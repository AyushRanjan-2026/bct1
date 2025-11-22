import getVeramoAgent from './veramo-setup.js';
import { uploadToIPFS } from './ipfs-service.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

let agent = null;

async function getAgent() {
  if (!agent) {
    const getAgentFn = getVeramoAgent;
    agent = await getAgentFn();
  }
  return agent;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VC_STORE_PATH = path.join(__dirname, 'vc-store.json');
const POLICY_REQUESTS_PATH = path.join(__dirname, 'policy-requests.json');

function loadVCStore() {
  if (fs.existsSync(VC_STORE_PATH)) {
    return JSON.parse(fs.readFileSync(VC_STORE_PATH, 'utf8'));
  }
  return {};
}

function saveVCStore(store) {
  fs.writeFileSync(VC_STORE_PATH, JSON.stringify(store, null, 2));
}

function loadPolicyRequests() {
  if (fs.existsSync(POLICY_REQUESTS_PATH)) {
    return JSON.parse(fs.readFileSync(POLICY_REQUESTS_PATH, 'utf8'));
  }
  return [];
}

function savePolicyRequests(requests) {
  fs.writeFileSync(POLICY_REQUESTS_PATH, JSON.stringify(requests, null, 2));
}

export async function createDID() {
  try {
    console.log('🔧 Getting Veramo agent...');
    const veramoAgent = await getAgent();
    if (!veramoAgent) {
      throw new Error('Veramo agent not initialized');
    }
    console.log('✅ Veramo agent obtained, creating DID...');
    const identifier = await veramoAgent.didManagerCreate({
      provider: 'did:key',
      kms: 'local',
    });
    console.log('✅ DID created:', identifier.did);
    return identifier.did;
  } catch (error) {
    console.error('❌ DID creation error:', error);
    throw new Error(`DID creation failed: ${error.message}`);
  }
}

export async function issueVC(credential, issuerDid) {
  try {
    const veramoAgent = await getAgent();
    const verifiableCredential = await veramoAgent.createVerifiableCredential({
      credential: {
        ...credential,
        issuer: { id: issuerDid },
      },
      proofFormat: 'jwt',
    });

    // Store VC
    const store = loadVCStore();
    const vcId = credential.id || `vc-${Date.now()}`;
    store[vcId] = {
      vc: verifiableCredential,
      policyId: credential.credentialSubject?.policyId,
      createdAt: new Date().toISOString(),
    };
    saveVCStore(store);

    // Upload to IPFS (optional)
    let ipfsCid = null;
    try {
      ipfsCid = await uploadToIPFS(JSON.stringify(verifiableCredential));
    } catch (ipfsError) {
      console.warn('IPFS upload skipped:', ipfsError.message);
    }

    return {
      vc: verifiableCredential,
      cid: ipfsCid,
    };
  } catch (error) {
    console.error('VC issuance error:', error);
    throw new Error(`VC issuance failed: ${error.message}`);
  }
}

export async function verifyVC(vcJwt) {
  try {
    const veramoAgent = await getAgent();
    const result = await veramoAgent.verifyCredential({
      credential: vcJwt,
    });
    return result;
  } catch (error) {
    console.error('VC verification error:', error);
    throw new Error(`VC verification failed: ${error.message}`);
  }
}

export function getVCByPolicyId(policyId) {
  const store = loadVCStore();
  for (const [id, data] of Object.entries(store)) {
    if (data.policyId === policyId.toString()) {
      return data.vc;
    }
  }
  return null;
}

export function addPolicyRequest(request) {
  const requests = loadPolicyRequests();
  const newRequest = {
    id: `req-${Date.now()}`,
    ...request,
    createdAt: new Date().toISOString(),
    status: 'pending',
  };
  requests.push(newRequest);
  savePolicyRequests(requests);
  return newRequest;
}

export function getPolicyRequests() {
  return loadPolicyRequests();
}

export function updatePolicyRequest(requestId, updates) {
  const requests = loadPolicyRequests();
  const index = requests.findIndex(r => r.id === requestId);
  if (index !== -1) {
    requests[index] = { ...requests[index], ...updates };
    savePolicyRequests(requests);
    return requests[index];
  }
  return null;
}

export function createRoleCredential({ issuerDid, subjectDid, role, data = {} }) {
  if (!issuerDid || !subjectDid || !role) {
    throw new Error('issuerDid, subjectDid, and role are required to create a credential');
  }

  return {
    '@context': [
      'https://www.w3.org/2018/credentials/v1',
      'https://www.w3.org/2018/credentials/examples/v1',
    ],
    type: ['VerifiableCredential', `${role}Credential`],
    issuer: {
      id: issuerDid,
    },
    issuanceDate: new Date().toISOString(),
    credentialSubject: {
      id: subjectDid,
      role,
      ...data,
    },
  };
}


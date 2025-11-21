import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RPC_URL = process.env.RPC_URL || 'http://127.0.0.1:8545';

let provider = null;
let deployments = null;

export function getProvider() {
  if (!provider) {
    provider = new ethers.JsonRpcProvider(RPC_URL);
  }
  return provider;
}

export function getDeployments() {
  if (!deployments) {
    const deploymentsPath = path.join(__dirname, '..', 'deployments.json');
    if (fs.existsSync(deploymentsPath)) {
      deployments = JSON.parse(fs.readFileSync(deploymentsPath, 'utf8'));
    } else {
      throw new Error('Deployments file not found. Please deploy contracts first.');
    }
  }
  return deployments;
}

export function getContractABI(contractName) {
  const artifactsPath = path.join(__dirname, '..', 'artifacts', 'contracts', `${contractName}.sol`, `${contractName}.json`);
  if (fs.existsSync(artifactsPath)) {
    const artifact = JSON.parse(fs.readFileSync(artifactsPath, 'utf8'));
    return artifact.abi;
  }
  throw new Error(`Contract ABI not found for ${contractName}`);
}

export function getContract(contractName, signerOrProvider) {
  const deployments = getDeployments();
  const abi = getContractABI(contractName);
  const address = deployments.contracts[contractName];
  if (!address) {
    throw new Error(`Contract address not found for ${contractName}`);
  }
  return new ethers.Contract(address, abi, signerOrProvider);
}

export async function getSigner(privateKey) {
  const provider = getProvider();
  return new ethers.Wallet(privateKey, provider);
}


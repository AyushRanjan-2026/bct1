import { create } from 'ipfs-http-client';

const IPFS_URL = process.env.IPFS_URL || 'http://127.0.0.1:5001';

// Use global Buffer if available, otherwise create from data
function createBuffer(data) {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(data);
  }
  // Fallback for environments without Buffer
  if (typeof data === 'string') {
    return new TextEncoder().encode(data);
  }
  return data;
}

function concatBuffers(buffers) {
  if (typeof Buffer !== 'undefined') {
    return Buffer.concat(buffers);
  }
  // Fallback: concatenate Uint8Arrays
  let totalLength = 0;
  for (const buf of buffers) {
    totalLength += buf.length;
  }
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const buf of buffers) {
    result.set(buf, offset);
    offset += buf.length;
  }
  return result;
}

let ipfsClient = null;
let connectionAttempted = false;

export async function getIPFSClient() {
  if (!ipfsClient && !connectionAttempted) {
    connectionAttempted = true;
    try {
      ipfsClient = create({
        url: IPFS_URL,
      });
      // Test connection
      try {
        const version = await ipfsClient.version();
        console.log('IPFS connected, version:', version.version);
      } catch (testError) {
        console.warn('IPFS connection test failed, but client created:', testError.message);
      }
    } catch (error) {
      console.error('Failed to create IPFS client:', error.message);
      connectionAttempted = false;
      throw new Error('IPFS connection failed. Make sure IPFS daemon is running.');
    }
  }
  if (!ipfsClient) {
    throw new Error('IPFS client not available. Make sure IPFS daemon is running.');
  }
  return ipfsClient;
}

export async function uploadToIPFS(data) {
  try {
    const client = await getIPFSClient();
    let dataToUpload = data;
    
    // Convert string to Buffer/Uint8Array if needed
    if (typeof data === 'string') {
      dataToUpload = createBuffer(data);
    } else if (typeof Buffer !== 'undefined' && Buffer.isBuffer(data)) {
      dataToUpload = data;
    } else if (!(data instanceof Uint8Array)) {
      dataToUpload = createBuffer(data);
    }
    
    const result = await client.add(dataToUpload);
    return result.cid.toString();
  } catch (error) {
    console.error('IPFS upload error:', error);
    throw new Error(`IPFS upload failed: ${error.message}`);
  }
}

export async function getFromIPFS(cid) {
  try {
    const client = await getIPFSClient();
    const chunks = [];
    for await (const chunk of client.cat(cid)) {
      chunks.push(chunk);
    }
    const buffer = concatBuffers(chunks);
    
    // Convert to string
    if (typeof Buffer !== 'undefined' && Buffer.isBuffer(buffer)) {
      return buffer.toString('utf8');
    } else if (buffer instanceof Uint8Array) {
      return new TextDecoder('utf8').decode(buffer);
    }
    return String(buffer);
  } catch (error) {
    console.error('IPFS retrieval error:', error);
    throw new Error(`IPFS retrieval failed: ${error.message}`);
  }
}


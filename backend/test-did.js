// Test script to verify DID creation works
import { createDID } from './vc-service.js';

async function test() {
  try {
    console.log('Testing DID creation...');
    const did = await createDID();
    console.log('✅ Success! DID created:', did);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

test();


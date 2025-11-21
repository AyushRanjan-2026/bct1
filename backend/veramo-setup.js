import { createAgent } from '@veramo/core';
import { DIDManager } from '@veramo/did-manager';
import { KeyManager } from '@veramo/key-manager';
import { KeyManagementSystem } from '@veramo/kms-local';
import { SecretBox } from '@veramo/kms-local';
import { CredentialIssuer } from '@veramo/credential-w3c';
import { DIDResolverPlugin } from '@veramo/did-resolver';
import { Resolver } from 'did-resolver';
import { getResolver as keyDidResolver } from '@veramo/did-provider-key';
import { DataStore, DataStoreORM } from '@veramo/data-store';
import { Entities, KeyStore, DIDStore, PrivateKeyStore } from '@veramo/data-store';
import { DataSource } from 'typeorm';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let dbConnection = null;
let agent = null;
let initializationPromise = null;

async function initializeVeramo() {
  if (agent) return agent;
  if (initializationPromise) return initializationPromise;

  initializationPromise = (async () => {
    try {
      // Initialize database connection
      if (!dbConnection || !dbConnection.isInitialized) {
        dbConnection = new DataSource({
          type: 'sqlite',
          database: join(__dirname, 'veramo.sqlite'),
          synchronize: true,
          logging: false,
          entities: Entities,
        });

        await dbConnection.initialize();
        console.log('✅ Veramo database initialized');
      }

      const secretKey = process.env.SECRET_KEY || '29739248cad1bd1a0fc4d9b75cd4d2990de535baf5caadfdf8d8f86664aa830c';

      agent = createAgent({
        plugins: [
          new KeyManager({
            store: new KeyStore(dbConnection),
            kms: {
              local: new KeyManagementSystem(new PrivateKeyStore(dbConnection, new SecretBox(secretKey))),
            },
          }),
          new DIDManager({
            store: new DIDStore(dbConnection),
            defaultProvider: 'did:key',
            providers: {
              'did:key': {
                defaultKms: 'local',
              },
            },
          }),
          new DIDResolverPlugin({
            resolver: new Resolver({
              ...keyDidResolver(),
            }),
          }),
          new CredentialIssuer(),
          new DataStore(dbConnection),
          new DataStoreORM(dbConnection),
        ],
      });

      console.log('✅ Veramo agent initialized');
      return agent;
    } catch (error) {
      console.error('❌ Veramo initialization error:', error);
      throw error;
    }
  })();

  return initializationPromise;
}

// Export a function that returns a promise
// This prevents top-level await from blocking server startup
let agentPromise = null;

export default function getVeramoAgent() {
  if (!agentPromise) {
    agentPromise = initializeVeramo();
  }
  return agentPromise;
}


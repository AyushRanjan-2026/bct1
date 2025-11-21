// Simplified server that starts even if Veramo fails
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

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

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Backend is working!', timestamp: new Date().toISOString() });
});

// Start server immediately
app.listen(PORT, () => {
  console.log(`\n🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`✅ Server started successfully\n`);
  
  // Try to load Veramo in background
  import('./vc-service.js').then(() => {
    console.log('✅ VC service loaded');
  }).catch((error) => {
    console.error('⚠️  VC service load error:', error.message);
  });
  
  // Try to load Veramo setup in background
  import('./veramo-setup.js').then((module) => {
    console.log('✅ Veramo setup loaded');
    // Try to initialize
    const getAgent = module.default;
    getAgent().then(() => {
      console.log('✅ Veramo agent initialized');
    }).catch((err) => {
      console.error('⚠️  Veramo agent initialization error:', err.message);
    });
  }).catch((error) => {
    console.error('⚠️  Veramo setup load error:', error.message);
  });
});

// Add DID route after server starts
setTimeout(async () => {
  try {
    const { createDID } = await import('./vc-service.js');
    
    app.post('/did/create', async (req, res) => {
      try {
        console.log('📝 Creating DID...');
        const did = await createDID();
        console.log('✅ DID created:', did);
        res.json({ did, success: true });
      } catch (error) {
        console.error('❌ DID creation error:', error);
        res.status(500).json({ 
          error: error.message || 'Failed to create DID', 
          success: false 
        });
      }
    });
    
    console.log('✅ DID route added');
  } catch (error) {
    console.error('⚠️  Failed to add DID route:', error.message);
    
    // Add a fallback route
    app.post('/did/create', (req, res) => {
      res.status(503).json({ 
        error: 'DID service not available. Check backend logs.', 
        success: false 
      });
    });
  }
}, 1000);


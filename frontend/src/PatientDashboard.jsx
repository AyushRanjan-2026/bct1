import { useState } from 'react';
import { createDID, requestPolicy, onchainRegister, issueCredential } from './api';
import ConnectWallet from './ConnectWallet';
import QRCode from 'qrcode';

function PatientDashboard() {
  const [did, setDid] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [coverageAmount, setCoverageAmount] = useState('');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [registered, setRegistered] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [vcForm, setVcForm] = useState({ fullName: '', notes: '' });
  const [vcInfo, setVcInfo] = useState(null);
  const [vcQr, setVcQr] = useState('');
  const [vcStatus, setVcStatus] = useState(null);

  const handleCreateDID = async () => {
    setLoading(true);
    setMessage(null);
    try {
      console.log('Creating DID...');
      const result = await createDID();
      console.log('DID creation result:', result);
      if (result && result.success) {
        setDid(result.did);
        setMessage({ type: 'success', text: 'DID created successfully!' });
      } else {
        setMessage({ type: 'error', text: result?.error || 'Failed to create DID' });
      }
    } catch (error) {
      console.error('DID creation error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to create DID. Check if backend is running.';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterOnChain = async (privateKey) => {
    if (!wallet?.account || !did) {
      setMessage({ type: 'error', text: 'Please connect wallet and create DID first' });
      return;
    }

    if (!privateKey) {
      setMessage({ type: 'error', text: 'Please provide private key' });
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const result = await onchainRegister({
        privateKey: privateKey,
        account: wallet.account,
        did: did,
        role: 1, // Patient role
      });

      if (result.success) {
        setRegistered(true);
        setShowRegisterForm(false);
        setMessage({ type: 'success', text: 'Registered on-chain successfully!' });
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to register on-chain' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to register on-chain' });
    } finally {
      setLoading(false);
    }
  };

  const handleRequestPolicy = async () => {
    if (!did || !wallet?.account || !coverageAmount) {
      setMessage({ type: 'error', text: 'Please fill all required fields' });
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const result = await requestPolicy({
        patientDid: did,
        patientAddress: wallet.account,
        coverageAmount: coverageAmount,
        details: details ? JSON.parse(details) : {},
      });

      if (result.success) {
        setMessage({ type: 'success', text: 'Policy request submitted successfully!' });
        setCoverageAmount('');
        setDetails('');
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to submit policy request' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to submit policy request' });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateVC = async () => {
    if (!did) {
      setVcStatus({ type: 'error', text: 'Create your DID first' });
      return;
    }
    setVcStatus(null);
    setLoading(true);
    try {
      const payload = {
        issuerDid: did,
        subjectDid: did,
        role: 'Patient',
        data: {
          fullName: vcForm.fullName || 'Unknown Patient',
          notes: vcForm.notes || 'Patient credential',
          issuedAt: new Date().toISOString(),
        },
      };
      const result = await issueCredential(payload);
      setVcInfo(result.vc);
      const qr = await QRCode.toDataURL(JSON.stringify(result.vc));
      setVcQr(qr);
      setVcStatus({ type: 'success', text: 'Credential generated!' });
    } catch (error) {
      console.error(error);
      setVcStatus({ type: 'error', text: error.message || 'Failed to generate credential' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Patient Dashboard</h1>
        <p className="text-gray-600">Manage your identity and request medical policies</p>
      </div>

      {/* Wallet Connection */}
      <ConnectWallet onWalletConnected={setWallet} />

      {/* Identity Management Card */}
      <div className="card animate-slide-up">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
            <span className="text-2xl">🆔</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Identity Management</h2>
            <p className="text-sm text-gray-500">Create and register your decentralized identity</p>
          </div>
        </div>

        {did ? (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <label className="label">Your Decentralized Identifier (DID)</label>
              <p className="font-mono text-sm text-gray-700 break-all bg-white p-3 rounded border border-gray-200">
                {did}
              </p>
            </div>
            
            {wallet?.account && !registered && (
              <div className="space-y-3">
                {!showRegisterForm ? (
                  <button 
                    className="btn btn-primary w-full sm:w-auto"
                    onClick={() => setShowRegisterForm(true)} 
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <span className="animate-spin mr-2">⏳</span>
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <span className="mr-2">📝</span>
                        Register on Blockchain
                      </span>
                    )}
                  </button>
                ) : (
                  <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <label className="label">Private Key (for on-chain registration)</label>
                    <input
                      type="password"
                      placeholder="Enter your private key"
                      id="patientPrivateKey"
                      className="input-field"
                    />
                    <div className="flex space-x-3">
                      <button
                        className="btn btn-primary flex-1"
                        onClick={() => {
                          const privateKey = document.getElementById('patientPrivateKey').value;
                          handleRegisterOnChain(privateKey);
                        }}
                        disabled={loading}
                      >
                        {loading ? 'Registering...' : 'Register'}
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => setShowRegisterForm(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {registered && (
              <div className="alert alert-success flex items-center space-x-2">
                <span>✓</span>
                <span>Registered on blockchain as Patient</span>
              </div>
            )}
          </div>
        ) : (
          <button 
            className="btn btn-primary w-full sm:w-auto"
            onClick={handleCreateDID} 
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <span className="animate-spin mr-2">⏳</span>
                Creating DID...
              </span>
            ) : (
              <span className="flex items-center">
                <span className="mr-2">✨</span>
                Create DID
              </span>
            )}
          </button>
        )}
      </div>

      {/* Policy Request Card */}
      <div className="card animate-slide-up">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
            <span className="text-2xl">📋</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Request Policy</h2>
            <p className="text-sm text-gray-500">Submit a new medical policy request</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="label">
              Coverage Amount (in wei) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={coverageAmount}
              onChange={(e) => setCoverageAmount(e.target.value)}
              placeholder="1000000000000000000"
              className="input-field"
            />
            <p className="text-xs text-gray-500 mt-1">Enter the coverage amount in wei (1 ETH = 10^18 wei)</p>
          </div>

          <div>
            <label className="label">Additional Details (JSON - Optional)</label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder='{"premium": "100", "duration": "12"}'
              rows="4"
              className="input-field resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">Optional: Add any additional policy details in JSON format</p>
          </div>

          <button
            className="btn btn-success w-full sm:w-auto"
            onClick={handleRequestPolicy}
            disabled={loading || !did || !wallet?.account}
          >
            {loading ? (
              <span className="flex items-center">
                <span className="animate-spin mr-2">⏳</span>
                Submitting...
              </span>
            ) : (
              <span className="flex items-center">
                <span className="mr-2">📤</span>
                Submit Policy Request
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="card animate-slide-up">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
            <span className="text-2xl">🔐</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Patient Verifiable Credential</h2>
            <p className="text-sm text-gray-500">Generate a credential for your DID and share it via QR code</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label">Full Name</label>
            <input
              type="text"
              className="input-field"
              value={vcForm.fullName}
              onChange={(e) => setVcForm({ ...vcForm, fullName: e.target.value })}
              placeholder="Jane Doe"
            />
            <label className="label">Notes / Additional Info</label>
            <textarea
              className="input-field"
              rows="3"
              value={vcForm.notes}
              onChange={(e) => setVcForm({ ...vcForm, notes: e.target.value })}
              placeholder="Allergy info, blood group, etc."
            />
            <button
              className="btn btn-primary mt-3"
              onClick={handleGenerateVC}
              disabled={loading || !did}
            >
              {loading ? 'Generating...' : 'Generate VC & QR'}
            </button>
            {vcStatus && (
              <div className={vcStatus.type === 'error' ? 'error' : 'success'}>
                {vcStatus.text}
              </div>
            )}
          </div>
          <div>
            {vcInfo ? (
              <div className="bg-gray-50 p-4 rounded-lg border">
                {vcQr && (
                  <div className="flex justify-center mb-4">
                    <img
                      src={vcQr}
                      alt="VC QR Code"
                      className="w-48 h-48 object-contain border rounded-lg bg-white"
                    />
                  </div>
                )}
                <pre className="text-xs bg-white p-2 rounded max-h-64 overflow-auto">
                  {JSON.stringify(vcInfo, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="text-gray-500 text-sm">
                Credential details will appear here after generation.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Message Alert */}
      {message && (
        <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'} animate-slide-up`}>
          <div className="flex items-center space-x-2">
            <span>{message.type === 'error' ? '❌' : '✓'}</span>
            <span>{message.text}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientDashboard;

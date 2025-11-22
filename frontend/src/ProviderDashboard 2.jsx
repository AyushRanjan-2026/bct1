import { useState } from 'react';
import { uploadFile, onchainSubmitClaim, getVCByPolicyId, verifyVC } from './api';
import ConnectWallet from './ConnectWallet';

function ProviderDashboard() {
  const [wallet, setWallet] = useState(null);
  const [file, setFile] = useState(null);
  const [policyId, setPolicyId] = useState('');
  const [beneficiary, setBeneficiary] = useState('');
  const [insurer, setInsurer] = useState('');
  const [amount, setAmount] = useState('');
  const [vcCid, setVcCid] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [ipfsHash, setIpfsHash] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUploadFile = async () => {
    if (!file) {
      setMessage({ type: 'error', text: 'Please select a file' });
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const base64Data = e.target.result.split(',')[1] || e.target.result;
          const result = await uploadFile(base64Data, file.name);
          
          if (result.success) {
            setIpfsHash(result.cid);
            setMessage({ type: 'success', text: `File uploaded to IPFS! CID: ${result.cid}` });
          } else {
            setMessage({ type: 'error', text: result.error || 'Failed to upload file' });
          }
        } catch (error) {
          setMessage({ type: 'error', text: error.message || 'Failed to upload file' });
        } finally {
          setLoading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to upload file' });
      setLoading(false);
    }
  };

  const handleGetVC = async () => {
    if (!policyId) {
      setMessage({ type: 'error', text: 'Please enter policy ID' });
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const result = await getVCByPolicyId(policyId);
      if (result.success && result.vc) {
        setMessage({ type: 'success', text: 'VC retrieved successfully' });
      } else {
        setMessage({ type: 'error', text: 'VC not found for this policy ID' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to get VC' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitClaimWithKey = async (privateKey) => {
    if (!privateKey) {
      setMessage({ type: 'error', text: 'Private key required' });
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const result = await onchainSubmitClaim({
        privateKey,
        policyId,
        beneficiary,
        insurer,
        ipfsHash,
        vcCid,
        amount,
      });

      if (result.success) {
        setMessage({
          type: 'success',
          text: `Claim submitted successfully! Claim ID: ${result.claimId}`,
        });
        // Reset form
        setPolicyId('');
        setBeneficiary('');
        setInsurer('');
        setAmount('');
        setVcCid('');
        setIpfsHash(null);
        setFile(null);
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to submit claim' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to submit claim' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Provider Dashboard</h1>
        <p className="text-gray-600">Upload medical reports and submit insurance claims</p>
      </div>

      {/* Wallet Connection */}
      <ConnectWallet onWalletConnected={setWallet} />

      {/* Upload Medical Report Card */}
      <div className="card animate-slide-up">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
            <span className="text-2xl">📄</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Upload Medical Report</h2>
            <p className="text-sm text-gray-500">Upload medical documents to IPFS</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors duration-300">
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <span className="text-4xl mb-2">📎</span>
              <span className="text-gray-600 font-medium">
                {file ? file.name : 'Click to select a file'}
              </span>
              <span className="text-sm text-gray-400 mt-1">
                PDF, DOC, DOCX, TXT, JPG, PNG
              </span>
            </label>
          </div>

          {file && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">📋</span>
                  <div>
                    <p className="font-semibold text-gray-800">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={handleUploadFile}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-2">⏳</span>
                      Uploading...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <span className="mr-2">☁️</span>
                      Upload to IPFS
                    </span>
                  )}
                </button>
              </div>
            </div>
          )}

          {ipfsHash && (
            <div className="alert alert-success">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span>✓</span>
                  <div>
                    <p className="font-semibold">File uploaded successfully!</p>
                    <p className="text-sm font-mono break-all">{ipfsHash}</p>
                  </div>
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(ipfsHash)}
                  className="text-green-700 hover:text-green-800"
                  title="Copy CID"
                >
                  📋
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Submit Claim Card */}
      <div className="card animate-slide-up">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
            <span className="text-2xl">💼</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Submit Claim</h2>
            <p className="text-sm text-gray-500">Submit insurance claim with verifiable credentials</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">
                Policy ID <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={policyId}
                  onChange={(e) => setPolicyId(e.target.value)}
                  placeholder="1"
                  className="input-field flex-1"
                />
                <button
                  className="btn btn-secondary"
                  onClick={handleGetVC}
                  disabled={loading || !policyId}
                >
                  Get VC
                </button>
              </div>
            </div>

            <div>
              <label className="label">
                VC CID (from issued VC) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={vcCid}
                onChange={(e) => setVcCid(e.target.value)}
                placeholder="Qm..."
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">
                Beneficiary Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={beneficiary}
                onChange={(e) => setBeneficiary(e.target.value)}
                placeholder="0x..."
                className="input-field"
              />
            </div>

            <div>
              <label className="label">
                Insurer Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={insurer}
                onChange={(e) => setInsurer(e.target.value)}
                placeholder="0x..."
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="label">
              Claim Amount (in wei) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="500000000000000000"
              className="input-field"
            />
            <p className="text-xs text-gray-500 mt-1">Enter the claim amount in wei</p>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <label className="label">
              Private Key (for on-chain operations) <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              placeholder="Enter your private key"
              id="providerPrivateKey"
              className="input-field mb-4"
            />
            <button
              className="btn btn-success w-full"
              onClick={() => {
                const privateKey = document.getElementById('providerPrivateKey').value;
                handleSubmitClaimWithKey(privateKey);
              }}
              disabled={loading || !wallet?.account || !ipfsHash}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin mr-2">⏳</span>
                  Submitting Claim...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <span className="mr-2">📤</span>
                  Submit Claim
                </span>
              )}
            </button>
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

export default ProviderDashboard;

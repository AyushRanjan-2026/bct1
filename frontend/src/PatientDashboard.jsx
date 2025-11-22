import { useState, useEffect } from 'react';
import { createDID, requestPolicy, issueCredential, getPolicyRequests } from './api';
import ConnectWallet from './ConnectWallet';
import QRCode from 'qrcode';

function PatientDashboard() {
  const [did, setDid] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [coverageAmount, setCoverageAmount] = useState('');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [vcForm, setVcForm] = useState({ fullName: '', notes: '' });
  const [vcInfo, setVcInfo] = useState(null);
  const [vcQr, setVcQr] = useState('');
  const [vcStatus, setVcStatus] = useState(null);
  const [policyRequests, setPolicyRequests] = useState([]);
  const [showVCSection, setShowVCSection] = useState(false);
  const [showDisconnectPopup, setShowDisconnectPopup] = useState(false);
  const [prevWalletState, setPrevWalletState] = useState(null);
  const [jsonError, setJsonError] = useState(null);

  // Monitor wallet disconnection
  useEffect(() => {
    if (prevWalletState?.account && !wallet?.account) {
      // Wallet was connected but now disconnected
      setShowDisconnectPopup(true);
    }
    setPrevWalletState(wallet);
  }, [wallet, prevWalletState]);

  // Load policy requests
  useEffect(() => {
    if (did && wallet?.account) {
      loadPolicyRequests();
      const interval = setInterval(loadPolicyRequests, 5000);
      return () => clearInterval(interval);
    }
  }, [did, wallet?.account]);

  const loadPolicyRequests = async () => {
    try {
      const result = await getPolicyRequests();
      if (result.success) {
        // Filter requests for current patient
        const patientRequests = (result.requests || []).filter(
          req => req.patientDid === did || req.patientAddress === wallet?.account
        );
        setPolicyRequests(patientRequests);
        
        // Check for VCs for each request
        patientRequests.forEach(request => {
          if (request.id) {
            checkForVC(request.id);
          }
        });
      }
    } catch (error) {
      console.error('Error loading policy requests:', error);
    }
  };

  const checkForVC = async (policyId) => {
    try {
      const response = await fetch(`http://localhost:3001/vc/policy/${policyId}`);
      const result = await response.json();
      if (result.success && result.vc) {
        setVcInfo(result.vc);
        const qr = await QRCode.toDataURL(JSON.stringify(result.vc));
        setVcQr(qr);
        setShowVCSection(true);
      }
    } catch (error) {
      console.error('Error checking for VC:', error);
    }
  };

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


  const handleRequestPolicy = async () => {
    if (!did || !wallet?.account || !coverageAmount) {
      setMessage({ type: 'error', text: 'Please fill all required fields' });
      return;
    }

    // Validate and parse JSON details if provided
    let parsedDetails = {};
    const trimmedDetails = details ? details.trim() : '';
    
    // Only parse if there's actual content
    if (trimmedDetails) {
      // Check if there's already a JSON error from real-time validation
      if (jsonError) {
        setMessage({ 
          type: 'error', 
          text: 'Please fix the JSON format in Additional Details or leave it empty.' 
        });
        return;
      }
      
      try {
        // Try to parse as JSON
        parsedDetails = JSON.parse(trimmedDetails);
        // Ensure it's an object (not array, string, number, etc.)
        if (typeof parsedDetails !== 'object' || Array.isArray(parsedDetails) || parsedDetails === null) {
          setMessage({ 
            type: 'error', 
            text: 'Additional Details must be a valid JSON object (e.g., {"key": "value"}). Leave empty if not needed.' 
          });
          return;
        }
      } catch (jsonError) {
        setMessage({ 
          type: 'error', 
          text: 'Invalid JSON format. Please enter a valid JSON object like {"premium": "100"} or leave the field empty.' 
        });
        return;
      }
    }
    // If empty or whitespace, parsedDetails remains {} which is correct

    setLoading(true);
    setMessage(null);
    try {
      const result = await requestPolicy({
        patientDid: did,
        patientAddress: wallet.account,
        coverageAmount: coverageAmount,
        details: parsedDetails,
      });

      if (result.success) {
        setMessage({ type: 'success', text: 'Policy request submitted successfully! Waiting for insurer to issue verifiable credential...' });
        setCoverageAmount('');
        setDetails('');
        setShowVCSection(true); // Show VC section (will be empty until insurer issues)
        loadPolicyRequests(); // Refresh policy requests
        // Check for existing VC for this policy request
        if (result.request?.id) {
          checkForVC(result.request.id);
        }
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
              <p className="text-xs text-gray-500 mt-2">
                ✓ Your DID has been created successfully. You can now generate credentials and request policies.
              </p>
            </div>
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

      {/* Policy Request Form Card */}
      <div className="card animate-slide-up">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
            <span className="text-2xl">📋</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Request Policy</h2>
            <p className="text-sm text-gray-500">Submit a new medical policy request to insurers</p>
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleRequestPolicy(); }} className="space-y-4">
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
              required
            />
            <div className="mt-2 space-y-1">
              <p className="text-xs text-gray-500">
                <strong>Example values:</strong>
              </p>
              <ul className="text-xs text-gray-500 list-disc list-inside space-y-1 ml-2">
                <li><code className="bg-gray-100 px-1 rounded">1000000000000000000</code> = 1 ETH coverage</li>
                <li><code className="bg-gray-100 px-1 rounded">500000000000000000</code> = 0.5 ETH coverage</li>
                <li><code className="bg-gray-100 px-1 rounded">100000000000000000</code> = 0.1 ETH coverage</li>
              </ul>
              <p className="text-xs text-gray-400 mt-2">
                💡 Tip: 1 ETH = 1,000,000,000,000,000,000 wei (10^18)
              </p>
            </div>
          </div>

          <div>
            <label className="label">Additional Details (JSON - Optional)</label>
            <textarea
              value={details}
              onChange={(e) => {
                const value = e.target.value;
                setDetails(value);
                
                // Real-time JSON validation
                const trimmed = value.trim();
                if (trimmed === '') {
                  setJsonError(null);
                  if (message?.type === 'error' && message.text?.includes('JSON')) {
                    setMessage(null);
                  }
                } else {
                  try {
                    const parsed = JSON.parse(trimmed);
                    if (typeof parsed !== 'object' || Array.isArray(parsed) || parsed === null) {
                      setJsonError('Must be a JSON object (e.g., {"key": "value"})');
                    } else {
                      setJsonError(null);
                      if (message?.type === 'error' && message.text?.includes('JSON')) {
                        setMessage(null);
                      }
                    }
                  } catch (err) {
                    setJsonError('Invalid JSON format');
                    if (message?.type === 'error' && message.text?.includes('JSON')) {
                      setMessage(null);
                    }
                  }
                }
              }}
              placeholder='{"premium": "100", "duration": "12", "coverageType": "comprehensive"}'
              rows="5"
              className={`input-field resize-none font-mono text-sm ${jsonError ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
            />
            {jsonError && (
              <div className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                <span>⚠️</span>
                <span>{jsonError}. Please fix or leave empty.</span>
              </div>
            )}
            <div className="mt-2 space-y-1">
              <p className="text-xs text-gray-500">
                <strong>Example JSON format:</strong>
              </p>
              <pre className="text-xs bg-gray-100 p-2 rounded border border-gray-200 overflow-x-auto">
{`{
  "premium": "100",
  "duration": "12",
  "coverageType": "comprehensive",
  "deductible": "500"
}`}
              </pre>
              <p className="text-xs text-gray-400 mt-1">
                💡 Leave empty if you don't need additional details
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-success w-full sm:w-auto"
            disabled={loading || !did || !wallet?.account || !!jsonError}
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
        </form>
      </div>

      {/* Verifiable Credential Display - Issued by Insurer */}
      {showVCSection && (
        <div className="card animate-slide-up">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-2xl">🔐</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Insurance Policy Credential</h2>
              <p className="text-sm text-gray-500">Your digitally signed policy certificate issued by insurer</p>
            </div>
          </div>
          
          {vcInfo ? (
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg border-2 border-gray-200 p-6 shadow-lg">
              {/* Certificate Display */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <span className="text-[#8B4513] font-semibold text-sm">Credential Type:</span>
                  <span className="text-[#2E8B57] font-medium">{vcInfo.credentialSubject?.credentialType || 'Insurance Policy'}</span>
                </div>
                
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <span className="text-[#8B4513] font-semibold text-sm">Issuer:</span>
                  <span className="text-[#2E8B57] font-mono text-xs">
                    {vcInfo.issuer?.id ? (vcInfo.issuer.id.length > 20 ? `${vcInfo.issuer.id.substring(0, 20)}...` : vcInfo.issuer.id) : 'N/A'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <span className="text-[#8B4513] font-semibold text-sm">Issued To:</span>
                  <span className="text-[#2E8B57] font-mono text-xs">
                    {vcInfo.credentialSubject?.id 
                      ? (vcInfo.credentialSubject.id.length > 20 
                          ? `${vcInfo.credentialSubject.id.substring(0, 20)}...` 
                          : vcInfo.credentialSubject.id)
                      : 'N/A'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <span className="text-[#8B4513] font-semibold text-sm">Policy Number:</span>
                  <span className="text-[#2E8B57] font-medium">{vcInfo.credentialSubject?.policyNumber || vcInfo.credentialSubject?.policyId || 'N/A'}</span>
                </div>
                
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <span className="text-[#8B4513] font-semibold text-sm">Valid Till:</span>
                  <span className="text-[#2E8B57] font-medium">{vcInfo.credentialSubject?.validTill || 'N/A'}</span>
                </div>
                
                {vcInfo.credentialSubject?.coverageAmount && (
                  <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                    <span className="text-[#8B4513] font-semibold text-sm">Coverage Amount:</span>
                    <span className="text-[#2E8B57] font-medium">{vcInfo.credentialSubject.coverageAmount} wei</span>
                  </div>
                )}
              </div>
              
              {/* Verification Status */}
              <div className="mt-6 pt-4 border-t border-gray-200 flex items-center space-x-2">
                <span className="text-2xl">🔒</span>
                <span className="text-[#2E8B57] font-semibold">Verified</span>
                <span className="text-green-600">✓</span>
              </div>
              
              {/* QR Code */}
              {vcQr && (
                <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col items-center">
                  <p className="text-sm text-gray-600 mb-3">Share this credential via QR code:</p>
                  <img
                    src={vcQr}
                    alt="VC QR Code"
                    className="w-32 h-32 object-contain border-2 border-gray-300 rounded-lg bg-white shadow-sm"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 text-center">
              <div className="text-4xl mb-3">⏳</div>
              <p className="text-gray-600 font-medium mb-2">Waiting for Insurer</p>
              <p className="text-sm text-gray-500">
                Your policy request has been submitted. The verifiable credential will appear here once the insurer issues it.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Policy Request Status Card - Below VC Section */}
      {policyRequests.length > 0 && (
        <div className="card animate-slide-up">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-2xl">📊</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Policy Request Status</h2>
              <p className="text-sm text-gray-500">Track the status of your submitted policy requests</p>
            </div>
          </div>
          <div className="space-y-4">
            {policyRequests.map((request, index) => (
              <div key={request.id || index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800">Request #{request.id || `REQ-${index + 1}`}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Submitted: {new Date(request.createdAt || Date.now()).toLocaleString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    request.status === 'approved' ? 'bg-green-100 text-green-800' :
                    request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {request.status || 'pending'}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Coverage Amount:</span>
                    <p className="font-mono text-gray-800">{request.coverageAmount || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Patient Address:</span>
                    <p className="font-mono text-xs text-gray-800 break-all">{request.patientAddress || 'N/A'}</p>
                  </div>
                </div>
                {request.details && Object.keys(request.details).length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <span className="text-gray-600 text-sm">Additional Details:</span>
                    <pre className="text-xs bg-white p-2 rounded mt-1 overflow-x-auto">
                      {JSON.stringify(request.details, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MetaMask Disconnect Popup */}
      {showDisconnectPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl animate-slide-up">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800">MetaMask Disconnected</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Your MetaMask wallet has been disconnected. Please reconnect your wallet to continue using the application.
            </p>
            <div className="flex space-x-3">
              <button
                className="btn btn-primary flex-1"
                onClick={() => {
                  setShowDisconnectPopup(false);
                  // Trigger wallet reconnection
                  if (window.ethereum) {
                    window.ethereum.request({ method: 'eth_requestAccounts' });
                  }
                }}
              >
                Reconnect Wallet
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowDisconnectPopup(false)}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

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

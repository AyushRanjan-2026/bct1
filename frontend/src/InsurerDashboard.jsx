import { useState, useEffect } from 'react';
import { getPolicyRequests, issueVC, onchainIssuePolicy, onchainInsurerAction, createDID } from './api';
import { createPolicyVC } from './vc-utils';
import ConnectWallet from './ConnectWallet';

function InsurerDashboard() {
  const [wallet, setWallet] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [createOnchain, setCreateOnchain] = useState(false);
  const [insurerDid, setInsurerDid] = useState(null);

  useEffect(() => {
    loadRequests();
    const interval = setInterval(loadRequests, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadRequests = async () => {
    try {
      const result = await getPolicyRequests();
      if (result.success) {
        setRequests(result.requests || []);
      }
    } catch (error) {
      console.error('Error loading requests:', error);
    }
  };

  const handleIssueVC = async (request) => {
    if (!wallet?.account) {
      setMessage({ type: 'error', text: 'Please connect wallet first' });
      return;
    }

    if (!insurerDid) {
      setMessage({ type: 'error', text: 'Please create DID first' });
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const credential = createPolicyVC(
        request.id,
        wallet.account,
        request.patientAddress,
        request.coverageAmount,
        insurerDid
      );

      const issueData = {
        credential,
        issuerDid: insurerDid,
        createOnchain,
        beneficiary: request.patientAddress,
        coverageAmount: request.coverageAmount,
      };

      if (createOnchain) {
        setMessage({ type: 'error', text: 'Please provide private key for on-chain operations' });
        setLoading(false);
        return;
      }

      const result = await issueVC(issueData);

      if (result.success) {
        setMessage({
          type: 'success',
          text: `VC issued successfully! CID: ${result.cid}${result.onchainPolicyId ? `, On-chain Policy ID: ${result.onchainPolicyId}` : ''}`,
        });
        loadRequests();
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to issue VC' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to issue VC' });
    } finally {
      setLoading(false);
    }
  };

  const handleIssueVCWithOnchain = async (request, privateKey) => {
    if (!privateKey) {
      setMessage({ type: 'error', text: 'Private key required for on-chain operations' });
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const credential = createPolicyVC(
        request.id,
        wallet.account,
        request.patientAddress,
        request.coverageAmount,
        insurerDid
      );

      const issueData = {
        credential,
        issuerDid: insurerDid,
        createOnchain: true,
        insurerPrivateKey: privateKey,
        beneficiary: request.patientAddress,
        coverageAmount: request.coverageAmount,
      };

      const result = await issueVC(issueData);

      if (result.success) {
        setMessage({
          type: 'success',
          text: `VC issued and on-chain policy created! CID: ${result.cid}, Policy ID: ${result.onchainPolicyId}`,
        });
        loadRequests();
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to issue VC' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to issue VC' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Insurer Dashboard</h1>
        <p className="text-gray-600">Review policy requests and issue verifiable credentials</p>
      </div>

      {/* Wallet Connection */}
      <ConnectWallet onWalletConnected={setWallet} />

      {/* Insurer DID Card */}
      <div className="card animate-slide-up">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
            <span className="text-2xl">🏢</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Insurer Identity</h2>
            <p className="text-sm text-gray-500">Create your insurer DID</p>
          </div>
        </div>

        {insurerDid ? (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <label className="label">Your Insurer DID</label>
            <p className="font-mono text-sm text-gray-700 break-all bg-white p-3 rounded border border-gray-200">
              {insurerDid}
            </p>
          </div>
        ) : (
          <button
            className="btn btn-primary"
            onClick={async () => {
              setLoading(true);
              setMessage(null);
              try {
                console.log('Creating Insurer DID...');
                const result = await createDID();
                console.log('Insurer DID creation result:', result);
                if (result && result.success) {
                  setInsurerDid(result.did);
                  setMessage({ type: 'success', text: 'Insurer DID created successfully!' });
                } else {
                  setMessage({ type: 'error', text: result?.error || 'Failed to create DID' });
                }
              } catch (error) {
                console.error('Insurer DID creation error:', error);
                const errorMessage = error.response?.data?.error || error.message || 'Failed to create DID. Check if backend is running on http://localhost:3001';
                setMessage({ type: 'error', text: errorMessage });
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <span className="animate-spin mr-2">⏳</span>
                Creating...
              </span>
            ) : (
              <span className="flex items-center">
                <span className="mr-2">✨</span>
                Create Insurer DID
              </span>
            )}
          </button>
        )}
      </div>

      {/* Policy Requests Card */}
      <div className="card animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-2xl">📋</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Policy Requests</h2>
              <p className="text-sm text-gray-500">Review and process patient policy requests</p>
            </div>
          </div>
          <div className="bg-primary-50 px-3 py-1 rounded-full">
            <span className="text-primary-700 font-semibold">{requests.length} Request{requests.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              id="createOnchain"
              checked={createOnchain}
              onChange={(e) => setCreateOnchain(e.target.checked)}
              className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Create on-chain policy when issuing VC
            </span>
          </label>
        </div>

        {requests.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-500 text-lg">No policy requests yet.</p>
            <p className="text-gray-400 text-sm mt-2">Requests will appear here when patients submit them.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request, index) => (
              <div 
                key={request.id} 
                className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:border-primary-300 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      Request #{request.id}
                    </h3>
                    <div className={`status-badge status-${request.status}`}>
                      {request.status}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(request.createdAt).toLocaleString()}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">Patient DID</label>
                    <p className="font-mono text-sm text-gray-700 break-all mt-1">{request.patientDid}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">Patient Address</label>
                    <p className="font-mono text-sm text-gray-700 break-all mt-1">{request.patientAddress}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">Coverage Amount</label>
                    <p className="text-sm text-gray-700 font-semibold mt-1">{request.coverageAmount} wei</p>
                  </div>
                </div>
                
                {request.status === 'pending' && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    {createOnchain ? (
                      <div className="space-y-3">
                        <input
                          type="password"
                          placeholder="Enter private key for on-chain operations"
                          id={`privateKey-${request.id}`}
                          className="input-field"
                        />
                        <button
                          className="btn btn-success w-full"
                          onClick={() => {
                            const privateKey = document.getElementById(`privateKey-${request.id}`).value;
                            handleIssueVCWithOnchain(request, privateKey);
                          }}
                          disabled={loading || !insurerDid}
                        >
                          {loading ? (
                            <span className="flex items-center justify-center">
                              <span className="animate-spin mr-2">⏳</span>
                              Processing...
                            </span>
                          ) : (
                            <span className="flex items-center justify-center">
                              <span className="mr-2">✅</span>
                              Issue VC + Create On-Chain Policy
                            </span>
                          )}
                        </button>
                      </div>
                    ) : (
                      <button
                        className="btn btn-success w-full"
                        onClick={() => handleIssueVC(request)}
                        disabled={loading || !insurerDid}
                      >
                        {loading ? (
                          <span className="flex items-center justify-center">
                            <span className="animate-spin mr-2">⏳</span>
                            Processing...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center">
                            <span className="mr-2">📜</span>
                            Issue VC
                          </span>
                        )}
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
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

export default InsurerDashboard;

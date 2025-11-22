import { useState } from 'react';
import { createDID, issueCredential } from './api';
import ConnectWallet from './ConnectWallet';
import QRCode from 'qrcode';

function ProviderDashboard() {
  const [wallet, setWallet] = useState(null);
  const [did, setDid] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [vcForm, setVcForm] = useState({ facility: '', speciality: '' });
  const [vcInfo, setVcInfo] = useState(null);
  const [vcQr, setVcQr] = useState('');

  const handleCreateDID = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const result = await createDID();
      if (result.success) {
        setDid(result.did);
        setMessage({ type: 'success', text: 'Provider DID created successfully!' });
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to create DID' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to create DID' });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateVC = async () => {
    if (!did) {
      setMessage({ type: 'error', text: 'Create your DID first' });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const payload = {
        issuerDid: did,
        subjectDid: did,
        role: 'Provider',
        data: {
          facility: vcForm.facility || 'Health Facility',
          speciality: vcForm.speciality || 'General Practice',
          issuedAt: new Date().toISOString(),
        },
      };
      const result = await issueCredential(payload);
      setVcInfo(result.vc);
      const qr = await QRCode.toDataURL(JSON.stringify(result.vc));
      setVcQr(qr);
      setMessage({ type: 'success', text: 'Provider credential generated!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to generate credential' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Provider Dashboard</h1>
        <p className="text-gray-600">Create your DID and share verifiable credentials</p>
      </div>

      <ConnectWallet onWalletConnected={setWallet} />

      <div className="card animate-slide-up">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
            <span className="text-2xl">🏥</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Provider Identity</h2>
            <p className="text-sm text-gray-500">Generate your decentralized identifier</p>
          </div>
        </div>
        {did ? (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <label className="label">Your Provider DID</label>
            <p className="font-mono text-sm text-gray-700 break-all bg-white p-3 rounded border border-gray-200">
              {did}
            </p>
          </div>
        ) : (
          <button className="btn btn-primary" onClick={handleCreateDID} disabled={loading}>
            {loading ? 'Creating DID...' : 'Create Provider DID'}
          </button>
        )}
      </div>

      <div className="card animate-slide-up">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
            <span className="text-2xl">🔑</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Provider Credential & QR</h2>
            <p className="text-sm text-gray-500">Share your specialization using verifiable credentials</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label">Facility / Organization</label>
            <input
              type="text"
              className="input-field"
              value={vcForm.facility}
              onChange={(e) => setVcForm({ ...vcForm, facility: e.target.value })}
              placeholder="City Hospital"
            />
            <label className="label">Speciality / Role</label>
            <input
              type="text"
              className="input-field"
              value={vcForm.speciality}
              onChange={(e) => setVcForm({ ...vcForm, speciality: e.target.value })}
              placeholder="Radiology Department"
            />
            <button className="btn btn-primary mt-3" onClick={handleGenerateVC} disabled={loading || !did}>
              {loading ? 'Generating...' : 'Generate Credential'}
            </button>
          </div>
          <div>
            {vcInfo ? (
              <div className="bg-gray-50 p-4 rounded-lg border">
                {vcQr && (
                  <div className="flex justify-center mb-4">
                    <img
                      src={vcQr}
                      alt="Provider VC QR"
                      className="w-48 h-48 object-contain border rounded-lg bg-white"
                    />
                  </div>
                )}
                <pre className="text-xs bg-white p-2 rounded max-h-64 overflow-auto">
                  {JSON.stringify(vcInfo, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="text-gray-500 text-sm">Credential data will appear here once generated.</div>
            )}
          </div>
        </div>
      </div>

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




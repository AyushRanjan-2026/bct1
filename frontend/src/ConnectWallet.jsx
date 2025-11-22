import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

function ConnectWallet({ onWalletConnected }) {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          await connectWallet();
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask!');
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setProvider(provider);
      setSigner(signer);
      setAccount(address);

      if (onWalletConnected) {
        onWalletConnected({ account: address, provider, signer });
      }

      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          setAccount(null);
          setProvider(null);
          setSigner(null);
          if (onWalletConnected) {
            onWalletConnected({ account: null, provider: null, signer: null });
          }
        } else {
          connectWallet();
        }
      });

      // Listen for disconnect
      window.ethereum.on('disconnect', () => {
        setAccount(null);
        setProvider(null);
        setSigner(null);
        if (onWalletConnected) {
          onWalletConnected({ account: null, provider: null, signer: null });
        }
      });
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet: ' + error.message);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    if (onWalletConnected) {
      onWalletConnected({ account: null, provider: null, signer: null });
    }
  };

  return (
    <div className="card animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <span className="mr-2">🔗</span>
          Wallet Connection
        </h2>
      </div>
      {!account ? (
        <div className="space-y-4">
          <button 
            className="btn btn-primary w-full sm:w-auto flex items-center justify-center space-x-2"
            onClick={connectWallet}
          >
            <span>🦊</span>
            <span>Connect MetaMask</span>
          </button>
          {!window.ethereum && (
            <div className="alert alert-info flex items-center space-x-2">
              <span>ℹ️</span>
              <span>Please install MetaMask extension to connect your wallet.</span>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-green-600">✓</span>
              <span className="font-semibold text-green-800">Connected</span>
            </div>
            <p className="text-sm text-gray-600 font-mono break-all">{account}</p>
          </div>
          <button 
            className="btn btn-secondary w-full sm:w-auto"
            onClick={disconnectWallet}
          >
            Disconnect Wallet
          </button>
        </div>
      )}
    </div>
  );
}

export default ConnectWallet;


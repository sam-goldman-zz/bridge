import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const isMetaMaskInstalled = Boolean(window.ethereum && window.ethereum.isMetaMask);

function useMetamaskProvider() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);

  useEffect(() => { 
    if (!isMetaMaskInstalled) {
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);

    const getInitialAccount = async () => {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        const newAccount = accounts[0];
        setAccount(newAccount);
      }
    }

    getInitialAccount();
  }, []);

  useEffect(() => { 
    if (!isMetaMaskInstalled) {
      return;
    }
  
    const handleAccountsChanged = async (accounts) => {
      if (accounts.length === 0) {
        setProvider(null);
        setAccount(null);
      }
      else {
        const newAccount = accounts[0]
        setAccount(newAccount);
      }
    };
  
    window.ethereum.on('accountsChanged', handleAccountsChanged);
  
    return () => window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
  }, []);

  useEffect(() => {
    if (!isMetaMaskInstalled) {
      return;
    }

    // Gets Chain ID if the Metamask provider is already connected to a chain
    if (window.ethereum.isConnected()) {
      const getChainId = async () => {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        setChainId(chainId);
      };

      getChainId();
    }

    const handleChainChanged = (chainId) => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);
      setChainId(chainId)
    }

    window.ethereum.on('chainChanged', handleChainChanged);

    return () => window.ethereum.removeListener('chainChanged', handleChainChanged);
  }, []);

  useEffect(() => {
    if (!isMetaMaskInstalled) {
      return;
    }

    const handleConnect = (connectInfo) => {
      const chainId = connectInfo.chainId;
      setChainId(chainId);
    }

    window.ethereum.on('connect', handleConnect);

    return () => window.ethereum.removeListener('connect', handleConnect);
  }, []);
  
  return [{account, provider, chainId}];
}

export default useMetamaskProvider;
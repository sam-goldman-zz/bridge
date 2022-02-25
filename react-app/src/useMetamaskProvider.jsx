import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const isMetaMaskInstalled = Boolean(window.ethereum && window.ethereum.isMetaMask);

function useMetamaskProvider() {
  const [provider, setProvider] = useState(null);

  useEffect(() => { 
    if (!isMetaMaskInstalled) {
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);
  
    const handleAccountsChanged = async (accounts) => {
      if (accounts.length === 0) {
        setProvider(null);
      }
    };
  
    window.ethereum.on('accountsChanged', handleAccountsChanged);
  
    return () => window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
  }, []);
  
  return provider;
}

export default useMetamaskProvider;
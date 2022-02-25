import { useState, useEffect } from 'react';

const isMetaMaskInstalled = Boolean(window.ethereum && window.ethereum.isMetaMask);

function useMetamaskChainId() {
  const [chainId, setChainId] = useState(null);

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
      setChainId(chainId)
    }

    window.ethereum.on('chainChanged', handleChainChanged);

    return () => window.ethereum.removeListener('chainChanged', handleChainChanged);
  }, []);

  return chainId;
}

export default useMetamaskChainId;
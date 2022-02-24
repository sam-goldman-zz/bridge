import React, { useState, useEffect } from 'react';
import './App.css';
import { ethers } from 'ethers';
import AccountButton from './AccountButton.jsx';

const isMetaMaskInstalled = Boolean(window.ethereum && window.ethereum.isMetaMask);

const nativeCurrencies = {
  'ETH': ''
}

function App() {
  const [currency, setCurrency] = useState('ETH');
  const [sourceNetwork, setSourceNetwork] = useState('Select Network')
  const [destinationNetwork, setDestinationNetwork] = useState('Select Network')
  const [sourceCurrencyAmount, setSourceCurrencyAmount] = useState('')
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [isBtnDisabled, setIsBtnDisabled] = useState(false);
  const [alert, setAlert] = useState(null);
  const [nativeTokenBalance, setNativeTokenBalance] = useState(null);
  const [chainId, setChainId] = useState(null)

  // Detects if the user is already connected to the network on MetaMask
  useEffect(() => {
    if (isMetaMaskInstalled) {
      const getInitialConnection = async () => {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setupControls(accounts[0])
        }
      }

      getInitialConnection();
    }
  }, []);

  useEffect(() => {
    if (!isMetaMaskInstalled) {
      return;
    }

    const handleChainChanged = (chainId) => {
      setChainId(chainId)
    }

    window.ethereum.on('chainChanged', handleChainChanged);

    return () => window.ethereum.removeListener('chainChanged', handleChainChanged);
  }, []);

  useEffect(() => {
    if (!isMetaMaskInstalled) {
      return;
    }

    const handleAccountsChanged = async (accounts) => {
      if (accounts.length === 0) {
        setProvider(null);
        setAlert(null);
        setAccount(null);
        setIsBtnDisabled(false);
      }
      else {
        setupControls(accounts[0])
      }
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);

    return () => window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
  }, []);

  useEffect(() => {
    if (!isMetaMaskInstalled) {
      return;
    }

    const handleDisconnect = (error) => {
      setAlert('You are disconnected from the network! Please cancel the network request in MetaMask.');
      console.error('User disconnected from network', error);
    };

    window.ethereum.on('disconnect', handleDisconnect);

    return () => window.ethereum.removeListener('disconnect', handleDisconnect);
  }, []);

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value)
  }

  const handleSourceNetworkChange = (e) => {
    const newSourceNetwork = e.target.value;
    if (destinationNetwork === newSourceNetwork) {
      setDestinationNetwork(sourceNetwork)
    }
    setSourceNetwork(newSourceNetwork)
  }

  const handleDestinationNetworkChange = (e) => {
    const newDestinationNetwork = e.target.value;
    if (sourceNetwork === newDestinationNetwork) {
      setSourceNetwork(destinationNetwork)
    }
    setDestinationNetwork(newDestinationNetwork);
  }

  const handleSourceCurrencyAmountChange = (e) => {
    setSourceCurrencyAmount(e.target.value)
  }

  const setupControls = async (account) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(account);
    const formattedBalance = ethers.utils.formatEther(balance);
    const roundedBalance = parseFloat(formattedBalance).toFixed(3);
    const chainId = await ethereum.request({ method: 'eth_chainId' });
    setChainId(chainId);
    setNativeTokenBalance(roundedBalance);
    setAccount(account);
    setProvider(provider);
    setAlert(null);
  }

  const handleNetworkSwap = (e) => {
    const tmpSourceNetwork = sourceNetwork;
    setSourceNetwork(destinationNetwork);
    setDestinationNetwork(tmpSourceNetwork);
  }

  const handleWalletBtnClick = async () => {
    if (isBtnDisabled) {
      return;
    }
    setIsBtnDisabled(true);

    if (!isMetaMaskInstalled) {
      setAlert('Please install MetaMask, then refresh this page!');
    }
    else {
      try {
        // If this connection request is successful, then handleAccountsChanged is automatically called.
        await window.ethereum.request({ method: 'eth_requestAccounts' });
      } catch (e) {
        console.error("Error when requesting user's MetaMask account", e);
      }
    }
    setIsBtnDisabled(false);
  }

  let displayedSourceCurrency;
  if (currency === 'ETH' && (sourceNetwork === 'Polygon' || sourceNetwork === 'Gnosis')) {
    displayedSourceCurrency = 'WETH'
  }
  else if (currency === 'DAI' && sourceNetwork === 'Gnosis') {
    displayedSourceCurrency = 'XDAI'
  }
  else {
    displayedSourceCurrency = currency
  }

  let displayedDestinationCurrency;
  if (currency === 'ETH' && (destinationNetwork === 'Polygon' || destinationNetwork === 'Gnosis')) {
    displayedDestinationCurrency = 'WETH'
  }
  else if (currency === 'DAI' && destinationNetwork === 'Gnosis') {
    displayedDestinationCurrency = 'XDAI'
  }
  else {
    displayedDestinationCurrency = currency
  }

  let accountControls;
  if (account) {
    accountControls = <div>
      {nativeTokenBalance}
      {currency}
      <AccountButton account={account}/>
    </div>
  }
  else {
    accountControls = 
      <button
        disabled={isBtnDisabled}
        onClick={() => handleWalletBtnClick()}>
          Connect Wallet
      </button>
  }

  return (
    <>
      <div>
        {accountControls}
      </div>
      <div>
        Send
        <select value={currency} onChange={(e) => handleCurrencyChange(e)}>
          <option>ETH</option>
          <option>USDC</option>
          <option>USDT</option>
          <option>MATIC</option>
          <option>DAI</option>
        </select>
      </div>
      
      <div>
        From
        <select value={sourceNetwork} onChange={(e) => handleSourceNetworkChange(e)}>
          <option>Select Network</option>
          <option>Mainnet</option>
          <option>Polygon</option>
          <option>Gnosis</option>
          <option>Arbitrum</option>
          <option>Optimism</option>
        </select>
        <input type="text"
          value={sourceCurrencyAmount}
          placeholder="0.0"
          onChange={(e) => handleSourceCurrencyAmountChange(e)}
        />
        {displayedSourceCurrency}
      </div>
      <div>
        <button onClick={() => handleNetworkSwap()}>↓</button>
      </div>
      <div>
        To (estimated)
        <select value={destinationNetwork} onChange={(e) => handleDestinationNetworkChange(e)}>
          <option>Select Network</option>
          <option>Mainnet</option>
          <option>Polygon</option>
          <option>Gnosis</option>
          <option>Arbitrum</option>
          <option>Optimism</option>
        </select>
        {displayedDestinationCurrency}
      </div>
    </>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import './App.css';
import { ethers } from 'ethers';
import AccountButton from './AccountButton.jsx';
import TokenBalanceCard from './TokenBalanceCard.jsx';
import useMetamaskProvider from './useMetamaskProvider.jsx';
import BalanceText from './BalanceText.jsx'

const isMetaMaskInstalled = Boolean(window.ethereum && window.ethereum.isMetaMask);

const networks = {
  homestead: {
    name: 'homestead',
    nativeTokenSymbol: 'ETH',
    displayName: 'Mainnet',
    chainId: '0x1'
  },
  gnosis: {
    name: 'gnosis',
    nativeTokenSymbol: 'XDAI',
    displayName: 'Gnosis',
    chainId: '0xa4b1'
  },
  matic: {
    name: 'matic',
    nativeTokenSymbol: 'MATIC',
    displayName: 'Polygon',
    chainId: '0xa'
  },
  optimism: {
    name: 'optimism',
    nativeTokenSymbol: 'ETH',
    displayName: 'Optimism',
    chainId: '0x64'
  },
  arbitrum: {
    name: 'arbitrum',
    nativeTokenSymbol: 'ETH',
    displayName: 'Arbitrum',
    chainId: '0x89'
  }
}

const tokens = {
  ETH: {
    symbol: 'ETH',
    decimals: 18,
  },
  MATIC: {
    symbol: 'MATIC',
    decimals: 18,
  },
  DAI: {
    symbol: 'DAI',
    decimals: 18,
  },
  USDC: {
    symbol: 'USDC',
    decimals: 6
  },
  USDT: {
    symbol: 'USDT',
    decimals: 6
  }
}

const tokenAddresses = {
  gnosis: {
    'MATIC': '0x7122d7661c4564b7c6cd4878b06766489a6028a2',
    'WETH': '0x6a023ccd1ff6f2045c3309768ead9e68f978f6e1',
    'USDC': '0xddafbb505ad214d7b80b1f830fccc89b60fb7a83',
    'USDT': '0x4ecaba5870353805a9f068101a40e0f32ed605c6'
  }
}

function App() {
  const [currency, setCurrency] = useState('ETH');
  const [sourceNetwork, setSourceNetwork] = useState("noneSelected")
  const [destinationNetwork, setDestinationNetwork] = useState('Select Network')
  const [sourceCurrencyAmount, setSourceCurrencyAmount] = useState('')
  const [isBtnDisabled, setIsBtnDisabled] = useState(false);
  const [alert, setAlert] = useState(null);
  const [{account, provider, chainId}] = useMetamaskProvider();

  useEffect(() => {
    if (!isMetaMaskInstalled) {
      return;
    }

    const handleDisconnect = (error) => {
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
  if (currency === 'ETH' && (sourceNetwork === 'matic' || sourceNetwork === 'gnosis')) {
    displayedSourceCurrency = 'WETH'
  }
  else if (currency === 'DAI' && sourceNetwork === 'gnosis') {
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
  if (account && provider) {
    accountControls = <div>
      <TokenBalanceCard account={account} provider={provider} chainId={chainId} />
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

  let sourceBalanceText;
  if (account && (sourceNetwork !== 'noneSelected')) {

    let customRpcProvider;
    if (sourceNetwork === 'gnosis') {
      customRpcProvider = new ethers.providers.JsonRpcProvider('https://rpc.gnosischain.com');
    }
    else {
      customRpcProvider = new ethers.providers.InfuraProvider(sourceNetwork, process.env.REACT_APP_INFURA_API_KEY);
    }

    let tokenAddress;
    if (displayedSourceCurrency !== networks[sourceNetwork].nativeTokenSymbol) {
      tokenAddress = tokenAddresses[sourceNetwork][displayedSourceCurrency]
    }
    sourceBalanceText =
      <BalanceText
        account={account}
        provider={customRpcProvider}
        token={tokens[currency]}
        tokenAddress={tokenAddress}
      />
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
          <option value="noneSelected">Select Network</option>
          {Object.keys(networks).map(network => (
            <option
              value={network}
              key={networks[network].chainId}>
                {networks[network].displayName}
            </option>
          ))}
        </select>
        {sourceBalanceText}
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

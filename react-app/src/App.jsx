import React, { useState, useEffect } from 'react';
import './App.css';
import { ethers } from 'ethers';
import AccountButton from './AccountButton.jsx';
import TokenBalanceCard from './TokenBalanceCard.jsx';
import useMetamaskProvider from './useMetamaskProvider.jsx';
import BalanceText from './BalanceText.jsx'
import useERC20Balance from './useERC20Balance.jsx'
import useNativeTokenBalance from './useNativeTokenBalance.jsx'
import MaxAmountButton from './MaxAmountButton';
import BalanceControls from './BalanceControls';

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

const erc20Addresses = {
  gnosis: {
    'MATIC': '0x7122d7661c4564b7c6cd4878b06766489a6028a2',
    'WETH': '0x6a023ccd1ff6f2045c3309768ead9e68f978f6e1',
    'USDC': '0xddafbb505ad214d7b80b1f830fccc89b60fb7a83',
    'USDT': '0x4ecaba5870353805a9f068101a40e0f32ed605c6'
  },
  homestead: {
    'USDC': '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    'USDT': '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    'MATIC': '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
    'DAI': '0x6B175474E89094C44Da98b954EedeAC495271d0F'
  },
  matic: {
    'WETH': '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
    'USDC': '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    'USDT': '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    'DAI': '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063'
  },
  optimism: {
    'USDC': '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
    'USDT': '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
    'MATIC': '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
    'DAI': '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1'
  },
  arbitrum: {
    'USDC': '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
    'USDT': '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
    'DAI': '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1'
  }
}

function App() {
  const [currency, setCurrency] = useState('ETH');
  const [sourceNetwork, setSourceNetwork] = useState("noneSelected")
  const [destinationNetwork, setDestinationNetwork] = useState('Select Network')
  const [sourceAmount, setSourceAmount] = useState('')
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

  const handleSourceAmount = (e) => {
    setSourceAmount(e.target.value)
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

  let balanceControls;
  if (account && (sourceNetwork !== 'noneSelected')) {

    let customRpcProvider;
    if (sourceNetwork === 'gnosis') {
      customRpcProvider = new ethers.providers.JsonRpcProvider('https://rpc.gnosischain.com');
    }
    else {
      customRpcProvider = new ethers.providers.InfuraProvider(sourceNetwork, process.env.REACT_APP_INFURA_API_KEY);
    }

    let erc20Address, useBalance;
    if (displayedSourceCurrency !== networks[sourceNetwork].nativeTokenSymbol) {
      erc20Address = erc20Addresses[sourceNetwork][displayedSourceCurrency]
      useBalance = useERC20Balance
    }
    else {
      useBalance = useNativeTokenBalance
    }

    balanceControls =
      <BalanceControls
        account={account}
        provider={customRpcProvider}
        token={tokens[currency]}
        erc20Address={erc20Address}
        useBalance={useBalance}
        handleClick={setSourceAmount}
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

        {balanceControls}

        <input type="text"
          value={sourceAmount}
          placeholder="0.0"
          onChange={(e) => handleSourceAmount(e)}
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

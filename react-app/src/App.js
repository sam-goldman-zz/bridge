import React, { useState } from 'react';
import './App.css';

function App() {
  const [currency, setCurrency] = useState('ETH');
  const [sourceNetwork, setSourceNetwork] = useState('Select Network')
  const [destinationNetwork, setDestinationNetwork] = useState('Select Network')
  const [sourceCurrencyAmount, setSourceCurrencyAmount] = useState()

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

  return (
    <>
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

import { useState } from 'react';
import { ethers } from 'ethers';

const nativeTokenSymbols = {
  '0x1': 'ETH',
  '0xa': 'ETH',
  '0xa4b1': 'ETH',
  '0x89': 'MATIC',
  '0x64': 'XDAI'
}

function useBalance(chainId, account, provider, decimals) {
  const [balance, setBalance] = useState(null);

  const tokenSymbol = nativeTokenSymbols[chainId];
  
  const getRoundedTokenBalance = async () => {
    const balance = await provider.getBalance(account);
    const formattedBalance = ethers.utils.formatEther(balance);
    const roundedBalance = parseFloat(formattedBalance).toFixed(decimals);
    setBalance(roundedBalance);
  }

  getRoundedTokenBalance();

  if (balance === null) {
    return;
  }
  return `${balance} ${tokenSymbol}`;
}

export default useBalance;
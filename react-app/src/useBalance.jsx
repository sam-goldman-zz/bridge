import { useState } from 'react';
import { ethers } from 'ethers';

function useBalance(chainId, account, provider, decimals) {
  const [balance, setBalance] = useState(null);
  
  const getRoundedTokenBalance = async () => {
    const balance = await provider.getBalance(account);
    const formattedBalance = ethers.utils.formatEther(balance);
    const roundedBalance = parseFloat(formattedBalance).toFixed(decimals);
    setBalance(roundedBalance);
  }

  getRoundedTokenBalance();

  return balance;
}

export default useBalance;
import { useState } from 'react';
import { ethers } from 'ethers';

function useNativeTokenBalance(account, provider, roundedDigits) {
  const [balance, setBalance] = useState(null);
  
  const getRoundedBalance = async () => {
    const balance = await provider.getBalance(account);
    const formattedBalance = ethers.utils.formatEther(balance);
    const roundedBalance = parseFloat(formattedBalance).toFixed(roundedDigits);
    setBalance(roundedBalance);
  }

  getRoundedBalance();

  if (balance === null) {
    return;
  }
  return balance;
}

export default useNativeTokenBalance;
import { useState } from 'react';
import { ethers } from 'ethers';

function useNativeTokenBalance(account, provider, roundedDigits) {
  const [balance, setBalance] = useState(null);
  
  const getBalance = async () => {
    const balance = await provider.getBalance(account);
    const formattedBalance = ethers.utils.formatEther(balance);
    // const roundedBalance = Number(formattedBalance).toLocaleString(undefined, { maximumFractionDigits: roundedDigits });
    setBalance(formattedBalance);
  }

  getBalance();

  if (balance === null) {
    return;
  }
  return balance;
}

export default useNativeTokenBalance;
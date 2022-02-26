import { useState } from 'react';
import { ethers } from 'ethers';
import ERC20 from './ERC20.json';

function useERC20Balance(account, provider, token, erc20Address) {
  const [balance, setBalance] = useState(null);
  
  const getBalance = async () => {
    const erc20 = new ethers.Contract(erc20Address, ERC20, provider);
    const balance = await erc20.balanceOf(account);
    const formattedBalance = ethers.utils.formatUnits(balance, token.decimals);
    // const roundedBalance = parseFloat(formattedBalance).toLocaleString(undefined, { maximumFractionDigits: roundedDigits })
    setBalance(formattedBalance);
  }

  getBalance();

  if (balance === null) {
    return;
  }
  return balance;
}

export default useERC20Balance;
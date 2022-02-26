import { useState } from 'react';
import { ethers } from 'ethers';
import ERC20 from './ERC20.json';

function useERC20Balance(account, provider, roundedDigits, token, erc20Address) {
  const [balance, setBalance] = useState(null);
  
  const getRoundedBalance = async () => {
    const erc20 = new ethers.Contract(erc20Address, ERC20, provider);
    const balance = await erc20.balanceOf('0x00290ffc9e9D19bdA7b25c6e44d8ADF55DFBf2dD');
    const formattedBalance = ethers.utils.formatUnits(balance, token.decimals);
    const roundedBalance = parseFloat(formattedBalance).toFixed(roundedDigits);
    setBalance(roundedBalance);
  }

  getRoundedBalance();

  if (balance === null) {
    return;
  }
  return balance;
}

export default useERC20Balance;
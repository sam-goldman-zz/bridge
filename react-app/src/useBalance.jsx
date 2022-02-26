import { useState } from 'react';
import { ethers } from 'ethers';
import ERC20 from './ERC20.json';

function useBalance(account, provider, roundedDigits, token, tokenAddress) {
  const [balance, setBalance] = useState(null);
  
  const getRoundedTokenBalance = async () => {
    let balance, formattedBalance;
    if (token) {
      const erc20 = new ethers.Contract(tokenAddress, ERC20, provider);
      balance = await erc20.balanceOf('0x00290ffc9e9D19bdA7b25c6e44d8ADF55DFBf2dD');
      console.log(balance)
      formattedBalance = ethers.utils.formatUnits(balance, token.decimals);
    }
    else {
      balance = await provider.getBalance(account);
      formattedBalance = ethers.utils.formatEther(balance);
    }
    const roundedBalance = parseFloat(formattedBalance).toFixed(roundedDigits);
    setBalance(roundedBalance);
  }

  getRoundedTokenBalance();

  if (balance === null) {
    return;
  }
  return balance;
}

export default useBalance;
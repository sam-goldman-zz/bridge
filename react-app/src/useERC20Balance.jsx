import { useState } from 'react';
import { ethers } from 'ethers';
import ERC20 from './ERC20.json';

function useERC20Balance(account, provider, roundedDigits, token, erc20Address) {
  const [balance, setBalance] = useState(null);
  
  const getRoundedBalance = async () => {
    const erc20 = new ethers.Contract(erc20Address, ERC20, provider);
    const balance = await erc20.balanceOf('0x489ee077994b6658eafa855c308275ead8097c4a');
    const formattedBalance = ethers.utils.formatUnits(balance, token.decimals);
    const roundedBalance = parseFloat(formattedBalance).toLocaleString(undefined, { maximumFractionDigits: roundedDigits })
    setBalance(roundedBalance);
  }

  getRoundedBalance();

  if (balance === null) {
    return;
  }
  return balance;
}

export default useERC20Balance;
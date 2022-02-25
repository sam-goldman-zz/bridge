import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

function AccountButton(props) {
  const { account } = props;

  const getDisplayAccount = (account) => {
    const checksumAccount = ethers.utils.getAddress(account); // converts account from lowercase to camelcase
    const firstHalf = checksumAccount.slice(0, 6);
    const secondHalf = checksumAccount.slice(-4);
    return `${firstHalf}...${secondHalf}`;
  }

  return (
    <button>
      {getDisplayAccount(account)}
    </button>
  );
}

export default AccountButton;
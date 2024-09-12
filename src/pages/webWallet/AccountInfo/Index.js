import * as ethers from 'ethers';
import { useEffect, useState } from 'react';
import useWallet, { provider } from '../../../util/walletUtils';
import AccountList from './AccountList';
import 'dotenv/config';
// const { API_KEY } = process.env;
import useStore from '../../../store';

function AccountInfo() {
  const { currentAccount } = useStore();

  return (
    <div className="text-xl text-white">
      <AccountList />
      <p>address:{currentAccount.address}</p>
      <p>balance:{currentAccount.balance} ETH</p>
    </div>
  );
}

export default AccountInfo;

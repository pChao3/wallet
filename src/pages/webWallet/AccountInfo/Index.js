import * as ethers from 'ethers';
import { useEffect, useState } from 'react';
import useWallet, { provider } from '../../../util/walletUtils';
import AccountList from './AccountList';
import 'dotenv/config';
// const { API_KEY } = process.env;

function AccountInfo() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState();

  const setCurrentInfo = i => {
    setAddress(i.address);
    setBalance(i.balance);
  };
  return (
    <div className="text-xl">
      <AccountList setCurrentAccount={info => setCurrentInfo(info)} />
      <p>address:{address}</p>
      <p>balance:{balance} ETH</p>
    </div>
  );
}

export default AccountInfo;

import * as ethers from 'ethers';
import { useEffect, useState } from 'react';
import useWallet, { provider } from '../../util/walletUtils';
import 'dotenv/config';
// const { API_KEY } = process.env;

function AccountInfo() {
  const [balance, setBalance] = useState(0);
  const { wallet, address } = useWallet();
  useEffect(() => {
    init();
  }, [wallet]);

  const init = async () => {
    if (!wallet) return;
    const balance = await provider.getBalance(wallet.address);
    setBalance(ethers.formatEther(balance));
    console.log(balance, wallet);
  };
  return (
    <div className="text-xl">
      <p>address:{address}</p>
      <p>balance:{balance} ETH</p>
    </div>
  );
}

export default AccountInfo;

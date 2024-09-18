import { ethers } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import useStore, { usePassword } from '../store';

const API_KEY = '3fc6c894f35a4458839f899be37925af';
// console.log(process.env);
export const provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${API_KEY}`);

export const getBalance = async address => {
  const balance = await provider.getBalance(address);
  return ethers.formatEther(balance);
};

function useWallet() {
  const { password } = usePassword();
  const [wallet, setWallet] = useState();
  const [address, setAddress] = useState(0);
  const { currentAccount, setCurrentAccount } = useStore();
  useEffect(() => {
    if (!password) return;

    const keyFile = currentAccount.jsonStore;
    console.log(keyFile);
    ethers.Wallet.fromEncryptedJson(keyFile, password).then(res => {
      setWallet(res);
      setAddress(res.wallet);
    });
  }, [password, currentAccount]);

  const refreshCurrentState = useCallback(async () => {
    provider.getBalance(currentAccount.address).then(res => {
      setCurrentAccount({
        ...currentAccount,
        balance: ethers.formatEther(res),
      });
    });
  }, [currentAccount]);

  return { wallet, address, refreshCurrentState };
}
export default useWallet;

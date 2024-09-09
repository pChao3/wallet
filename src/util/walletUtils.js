import { ethers } from 'ethers';
import { usePassword } from '../Context';
import { useEffect, useState } from 'react';

const API_KEY = '3fc6c894f35a4458839f899be37925af';
// console.log(process.env);
export const provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${API_KEY}`);

export const getBalance = async address => {
  const balance = await provider.getBalance(address);
  return ethers.formatEther(balance);
};

function useWallet(index) {
  const { password } = usePassword();
  const [wallet, setWallet] = useState();
  const [address, setAddress] = useState(0);
  useEffect(() => {
    if (!password) return;
    const keyFile = JSON.parse(localStorage.getItem('keyFiles'))[index || 0];
    console.log(keyFile);
    const loadWallet = async () => {
      const wallet = await ethers.Wallet.fromEncryptedJson(keyFile.jsonStore, password);
      setWallet(wallet);
      setAddress(wallet.address);
    };
    loadWallet();
  }, [password]);

  return { wallet, address };
}
export default useWallet;
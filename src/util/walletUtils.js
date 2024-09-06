import { ethers } from 'ethers';
import { usePassword } from '../Context';
import { useEffect, useState } from 'react';

const API_KEY = '3fc6c894f35a4458839f899be37925af';
// console.log(process.env);
export const provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${API_KEY}`);

function useWallet() {
  const { password } = usePassword();
  const [wallet, setWallet] = useState();
  const [address, setAddress] = useState(0);
  useEffect(() => {
    const keyFile = localStorage.getItem('keyFile');
    const loadWallet = async () => {
      const wallet = await ethers.Wallet.fromEncryptedJson(keyFile, password);
      const signer = await wallet.connect(provider);
      console.log(wallet, 'lll', signer);
      setWallet(wallet);
      setAddress(wallet.address);
    };
    loadWallet();
  }, []);

  return { wallet, address };
}
export default useWallet;

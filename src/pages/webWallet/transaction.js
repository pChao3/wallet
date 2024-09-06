import { Input, Form, Button, message } from 'antd';
import { useState } from 'react';
import { ethers } from 'ethers';
import useWallet, { provider } from '../../util/walletUtils';

function TransModule() {
  const [toAddress, setToAddress] = useState();
  const [amount, setAmount] = useState('');
  const { wallet } = useWallet();
  const transfer = async () => {
    const signer = await wallet.connect(provider);
    try {
      const tx = await signer.sendTransaction({
        to: toAddress,
        value: ethers.parseUnits(amount),
      });
      console.log('tx', tx);
      const receipt = await tx.wait();
      console.log(signer, receipt);
      message.success('transfer success!');
    } catch (error) {
      message.error(error);
    }
  };
  return (
    <div className="container">
      <div className="flex ">
        <span className="w-1/4 text-right mr-1">ToAddress </span>
        <Input
          className="w-2/3"
          value={toAddress}
          onChange={e => setToAddress(e.target.value)}
          placeholder="输入公钥(0x)"
        />
      </div>
      <div className="flex">
        <span className="w-1/4 text-right mr-1">Amount </span>
        <Input
          className="w-2/3"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="数量"
          suffix="ETH"
        />
      </div>
      <Button onClick={transfer}>Transfer</Button>
    </div>
  );
}

export default TransModule;

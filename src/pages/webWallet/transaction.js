import { Input, Form, Button, message } from 'antd';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import useWallet, { provider } from '../../util/walletUtils';
import useStore from '../../store';

function TransModule() {
  const [toAddress, setToAddress] = useState('0x624FB60F2b3406Db42E164fEBc928a553B0D9eD4');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const { setCurrentAccount, currentAccount } = useStore();
  const { wallet } = useWallet();

  const transfer = async () => {
    setLoading(true);
    const signer = await wallet.connect(provider);
    try {
      const tx = await signer.sendTransaction({
        to: toAddress,
        value: ethers.parseUnits(amount),
      });
      console.log('tx', tx);
      const receipt = await tx.wait();
      console.log(signer, receipt);
      message.success('转账成功！');
      setLoading(false);

      const balance = await provider.getBalance(wallet.address);
      setCurrentAccount({
        ...currentAccount,
        balance: ethers.formatEther(balance),
      });
    } catch (error) {
      console.error('交易错误:', error);
      if (error.code === 'INSUFFICIENT_FUNDS') {
        message.error('资金不足');
      } else {
        message.error(`交易失败: ${error.message}`);
      }
    } finally {
      setLoading(false);
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
      <Button onClick={transfer} loading={loading}>
        Transfer
      </Button>
    </div>
  );
}

export default TransModule;

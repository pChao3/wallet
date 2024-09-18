import { Button, message } from 'antd';
import { useState } from 'react';
import { ethers } from 'ethers';
import useWallet, { provider } from '../../util/walletUtils';

function TransModule() {
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const { wallet, refreshCurrentState } = useWallet();

  const transfer = async () => {
    if (!toAddress || !amount) {
      message.error('请填写完整的转账信息');
      return;
    }
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

      refreshCurrentState();
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
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-white text-center mb-6">转账</h2>
      <div className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label htmlFor="toAddress" className="text-sm font-medium text-gray-300">
            接收地址
          </label>
          <input
            id="toAddress"
            value={toAddress}
            onChange={e => setToAddress(e.target.value)}
            placeholder="输入公钥(0x)"
            className="w-full bg-gray-700 text-white border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md px-3 py-2"
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="amount" className="text-sm font-medium text-gray-300">
            转账金额
          </label>
          <div className="relative">
            <input
              id="amount"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="数量"
              className="w-full bg-gray-700 text-white border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md px-3 py-2 pr-12"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              ETH
            </span>
          </div>
        </div>
        <Button
          onClick={transfer}
          loading={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white border-none h-12 text-lg font-semibold rounded-lg transition duration-300 mt-4"
        >
          确认转账
        </Button>
      </div>
    </div>
  );
}

export default TransModule;

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { provider } from '../../util/walletUtils';
import { Modal, Spin } from 'antd';

function TransactionSignModal({ transaction, onConfirm, onCancel, wallet, open }) {
  const [gasPrice, setGasPrice] = useState('');
  const [estimatedGas, setEstimatedGas] = useState('');
  const [totalCost, setTotalCost] = useState('');
  const [error, setError] = useState('');

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchGasInfo() {
      setLoading(true);
      try {
        const currentGasPrice = (await provider.getFeeData()).gasPrice;
        console.log('cirrent', currentGasPrice);
        const estimatedGas = await provider.estimateGas(transaction);

        setGasPrice(ethers.formatUnits(currentGasPrice, 'gwei'));
        setEstimatedGas(estimatedGas.toString());

        const totalCost = currentGasPrice * estimatedGas + transaction.value;
        setTotalCost(ethers.formatEther(totalCost));
      } catch (err) {
        console.log('err', err);
        setError('获取gas信息失败: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchGasInfo();
  }, [transaction, open]);

  const handleConfirm = async () => {
    try {
      const signedTx = await wallet.signTransaction(transaction);
      onConfirm(signedTx);
    } catch (err) {
      setError('签名交易失败: ' + err.message);
    }
  };

  return (
    <Modal
      open={open}
      title="签署交易"
      cancelText="取消"
      okText="确认并签署"
      onOk={handleConfirm}
      onCancel={onCancel}
      className="p-4" // 添加 Tailwind CSS 类
    >
      <Spin spinning={loading}>
        {error && <p className="text-red-500">{error}</p>}
        <div className="transaction-details space-y-2">
          {' '}
          <p className="text-gray-700">发送地址: {transaction.from}</p>
          <p className="text-gray-700">接收地址: {transaction.to}</p>
          <p className="text-gray-700">金额: {ethers.formatEther(transaction.value)} ETH</p>
          <p className="text-gray-700">Gas 价格: {gasPrice} Gwei</p>
          <p className="text-gray-700">估算 Gas 用量: {estimatedGas}</p>
          <p className="text-gray-700">总成本: {totalCost} ETH</p>
        </div>
      </Spin>
    </Modal>
  );
}

export default TransactionSignModal;

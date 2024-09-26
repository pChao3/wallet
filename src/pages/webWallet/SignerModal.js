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
    >
      <Spin spinning={loading}>
        {error && <p className="error">{error}</p>}
        <div className="transaction-details">
          <p>发送地址: {transaction.from}</p>
          <p>接收地址: {transaction.to}</p>
          <p>金额: {ethers.formatEther(transaction.value)} ETH</p>
          <p>Gas 价格: {gasPrice} Gwei</p>
          <p>估算 Gas 用量: {estimatedGas}</p>
          <p>总成本: {totalCost} ETH</p>
        </div>
        {/* <div className="button-group">
        <button onClick={handleConfirm} disabled={!!error}>
          确认并签署
        </button>
        <button onClick={onCancel}>取消</button>
      </div> */}
      </Spin>
    </Modal>
  );
}

export default TransactionSignModal;

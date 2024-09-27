import { Button, message } from 'antd';
import TransactionSignModal from './SignerModal';
import Notification from './Notification';
import { useCallback, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { provider } from '../../util/walletUtils';
import useStore, { usePassword } from '../../store';
function TransModule() {
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [btnLoading, setBtnLoading] = useState(false);

  const [showSignModal, setShowSignModal] = useState(false);
  const [transaction, setTransaction] = useState(null);
  const [wallet, setWallet] = useState();

  const { currentAccount, setCurrentAccount } = useStore();
  const { password } = usePassword();

  const [hashLoading, setHashLoading] = useState(false);
  const [txHash, setTxHash] = useState('');

  const transfer = async () => {
    if (!toAddress || !amount) {
      message.error('请填写完整的转账信息');
      return;
    }
    setBtnLoading(true);

    try {
      const wallet = await ethers.Wallet.fromEncryptedJson(currentAccount.jsonStore, password);
      const signer = await wallet.connect(provider);
      const nonce = await provider.getTransactionCount(currentAccount.address);
      console.log(nonce);
      setWallet(signer);
      const netWork = await provider.getNetwork();
      const chainId = netWork.chainId;

      const currentGasPrice = (await provider.getFeeData()).gasPrice;
      const params = {
        from: currentAccount.address,
        to: toAddress,
        gasLimit: 21000,
        gasPrice: currentGasPrice,
        // gasPrice: ethers.parseUnits('500', 'gwei'),
        value: ethers.parseUnits(amount),
        chainId,
        nonce: nonce,
      };
      console.log('ended', params, chainId);

      setTransaction(params);
      setShowSignModal(true);
    } catch (error) {
      console.error('交易错误:', error);
      if (error.code === 'INSUFFICIENT_FUNDS') {
        message.error('资金不足');
      } else {
        message.error(`交易失败: ${error.message}`);
      }
    } finally {
      setBtnLoading(false);
    }
  };

  const handleConfirmTransaction = async signedTx => {
    try {
      console.log('signTx', signedTx);
      // provider.sendTransaction()
      // provider.broadcastTransaction
      const tx = await provider.broadcastTransaction(signedTx);
      setShowSignModal(false);
      setTxHash(tx.hash);

      setHashLoading(true);

      console.log('交易已发送:', tx.hash);
      const receipt = await tx.wait();
      setHashLoading(false);

      refreshCurrentState();

      console.log('receipt', receipt);
    } catch (error) {
      console.error('发送交易失败:', error);
    }
  };

  const refreshCurrentState = async () => {
    const balance = await provider.getBalance(currentAccount.address);
    setCurrentAccount({
      ...currentAccount,
      balance: ethers.formatEther(balance),
    });
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      {txHash && <Notification loading={hashLoading} txHash={txHash} close={() => setTxHash()} />}
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
          loading={btnLoading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white border-none h-12 text-lg font-semibold rounded-lg transition duration-300 mt-4"
        >
          确认转账
        </Button>
      </div>

      {showSignModal && (
        <TransactionSignModal
          open={showSignModal}
          transaction={transaction}
          onConfirm={handleConfirmTransaction}
          onCancel={() => setShowSignModal(false)}
          wallet={wallet}
        />
      )}
    </div>
  );
}

export default TransModule;

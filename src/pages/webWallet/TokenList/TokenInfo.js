import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Modal, Input, Button, message, Spin } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import useWallet, { provider } from '../../../util/walletUtils';
import useStore from '../../../store';

function TokenInfo({ open, tokenInfo, onClose }) {
  const [address, setAddress] = useState();
  const [decimals, setDecimals] = useState();
  const [balance, setBalance] = useState();
  const [symbol, setSymbol] = useState();
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [transferAmount, setTransferAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const { currentAccount } = useStore();

  const { wallet, refreshCurrentState } = useWallet();

  const init = async () => {
    try {
      setLoading(true);
      const { address, abi } = tokenInfo;
      const contract = await new ethers.Contract(address, abi, provider);
      const balance = await contract.balanceOf(currentAccount.address);
      const decimals = await contract.decimals();
      const symbol = await contract.symbol();
      setAddress(address);
      setBalance(Number(balance));
      setDecimals(Number(decimals));
      setSymbol(symbol);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    init();
  }, [tokenInfo]);

  const handleTransfer = async () => {
    setBtnLoading(true);
    try {
      const { address, abi } = tokenInfo;
      const signer = await wallet.connect(provider);
      const contract = await new ethers.Contract(address, abi, signer);

      const amount = ethers.parseUnits(transferAmount, decimals);
      console.log(amount, wallet);
      const tx = await contract.transfer(recipientAddress, amount);
      console.log('wx', tx);
      await tx.wait();
      message.success('转账成功');

      refreshCurrentState();
      init(); // 刷新余额
    } catch (error) {
      console.error('转账失败:', error);
      message.error('转账失败，请检查输入并重试');
    } finally {
      setBtnLoading(false);
    }
  };

  const copyToClipboard = async text => {
    try {
      await navigator.clipboard.writeText(text);
      message.success('地址已复制到剪贴板');
    } catch (err) {
      console.error('复制失败:', err);
      message.error('复制失败，请手动复制');
    }
  };

  const close = () => {
    onClose();
    setTransferAmount();
    setRecipientAddress();
  };
  return (
    <Modal
      title={<h2 className="text-2xl font-bold text-gray-800">代币信息</h2>}
      open={open}
      onCancel={close}
      footer={null}
      className="font-sans"
      width={440}
    >
      <Spin spinning={loading}>
        <div className="space-y-6 py-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">您的余额</h3>
            <p className="text-3xl font-bold text-green-600">
              {balance ? `${(balance / 10 ** decimals).toFixed(6)} $${symbol || ''}` : '0'}
            </p>
          </div>
          <div className="flex justify-between">
            <div className="w-1/2 pr-2">
              <h3 className="text-lg font-semibold text-gray-700 mb-1">小数位数</h3>
              <p className="text-xl text-gray-600">{decimals || '-'}</p>
            </div>
            <div className="w-1/2 pl-2">
              <h3 className="text-lg font-semibold text-gray-700 mb-1">合约地址</h3>
              <p className="text-sm text-gray-500 break-all ">
                {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '-'}
                <span
                  className="ml-2 cursor-pointer hover:text-blue-500"
                  onClick={() => address && copyToClipboard(address)}
                  title="点击复制地址"
                >
                  <CopyOutlined />
                </span>
              </p>
            </div>
          </div>

          <div className="mt-8 border-t pt-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">转账</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">转账金额</label>
                <Input
                  placeholder={`输入${symbol || '代币'}数量`}
                  value={transferAmount}
                  onChange={e => setTransferAmount(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">接收地址</label>
                <Input
                  placeholder="输入接收地址"
                  value={recipientAddress}
                  onChange={e => setRecipientAddress(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button
                type="primary"
                loading={btnLoading}
                onClick={handleTransfer}
                className="w-full bg-blue-500 hover:bg-blue-600"
                disabled={!transferAmount || !recipientAddress}
              >
                转账
              </Button>
            </div>
          </div>
        </div>
      </Spin>
    </Modal>
  );
}

export default TokenInfo;

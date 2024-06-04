import { useState } from 'react';
import './index.css';
import { Input, Button, message } from 'antd';

import { useSendTransaction, useAccount } from 'wagmi';
import { parseEther } from 'viem';

function Wallet() {
  const [amount, setAmount] = useState(0);
  const [address, setAddress] = useState(0);

  const { isConnected } = useAccount();
  const { data, sendTransaction } = useSendTransaction();

  const su = () => {
    message.success('转账成功！');
  };
  const error = () => {
    message.success('转账失败！');
  };
  const transfer = () => {
    if (!isConnected) {
      message.error('请连接钱包再进行操作！');
      return;
    }
    // transfer
    sendTransaction(
      {
        to: address,
        value: parseEther(amount),
      },
      {
        onSuccess: su,
        onError: error,
      }
    );
  };

  return (
    <div className="wallet-wrap">
      <div className="content">
        <div className="input-wrap">
          <div>
            <span>Amount:{}</span>
            <Input onChange={e => setAmount(e.target.value)} />
            <span>Address:{}</span>
            <Input onChange={e => setAddress(e.target.value)} />
            <Button type="primary" block onClick={() => transfer()}>
              Transfer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Wallet;

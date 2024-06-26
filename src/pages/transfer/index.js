import { useEffect, useState } from 'react';
import './index.css';
import { Input, Button, message } from 'antd';

import {
  useSendTransaction,
  useAccount,
  useWriteContract,
  useReadContract,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { parseEther } from 'viem';
import AirTokenAbi from '../../contract/Token.json';
import { AirToken } from '../addressConfig';

function Wallet() {
  const [amount, setAmount] = useState(0);
  const [toAddress, setAddress] = useState(0);

  const { isConnected, address } = useAccount();
  const { writeContractAsync, data: hash } = useWriteContract();

  const { data, refetch } = useReadContract({
    abi: AirTokenAbi.abi,
    address: AirToken,
    functionName: 'balanceOf',
    args: [address],
  });

  const transfer = () => {
    if (!isConnected) {
      message.error('请连接钱包再进行操作！');
      return;
    }
    // transfer
    writeContractAsync({
      abi: AirTokenAbi.abi,
      address: AirToken,
      functionName: 'transfer',
      args: [toAddress, amount * 10 ** 18],
    });
  };

  const { isSuccess } = useWaitForTransactionReceipt({ hash });
  if (isSuccess) {
    message.success('转账成功！');
    refetch();
  }

  return (
    <div className="wallet-wrap">
      <div className="content">
        <div className="input-wrap">
          <p>$Air</p>
          <div>
            <p style={{ textAlign: 'center' }}>your Air balance:{data?.toString()} Air</p>
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

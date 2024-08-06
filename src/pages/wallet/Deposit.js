import { useState } from 'react';
import { Input, Button, message } from 'antd';

import {
  useBalance,
  useAccount,
  useReadContract,
  useWriteContract,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { parseEther } from 'viem';
import walletJson from '../../contract/wallet.json';
import { walletAddress } from '../addressConfig';

function Deposit() {
  const [depositValue, setDepositValie] = useState();
  const [loading, setLoading] = useState(false);
  const { address } = useAccount();
  const { writeContractAsync, data: hash } = useWriteContract();

  // address balance
  const { data, refetch } = useBalance({
    address: address,
  });

  const deposit = () => {
    setLoading(true);
    writeContractAsync({
      abi: walletJson.abi,
      address: walletAddress,
      functionName: 'deposit',
      value: parseEther(depositValue),
    }).catch(err => {
      console.log(err);
      message.error(err.name);
      setLoading(false);
    });
  };

  const { isSuccess } = useWaitForTransactionReceipt({ hash });
  if (isSuccess) {
    loading && setLoading(false);
    refetch();
    message.success('deposit success!');
  }

  return (
    <div>
      <span>
        your balance: {data && data.formatted}
        {data && data.symbol}
      </span>
      <Input onChange={e => setDepositValie(e.target.value)} key="deposit" />
      <Button type="primary" block onClick={deposit} loading={loading}>
        Deposit
      </Button>
    </div>
  );
}

export default Deposit;

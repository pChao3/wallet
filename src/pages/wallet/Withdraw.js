import { useState } from 'react';
import { Input, Button, message } from 'antd';

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import walletJson from '../../contract/wallet.json';
import { walletAddress } from '../addressConfig';

function Withdraw() {
  const [withDrawValue, setWithDrawValue] = useState();
  const [loading, setLoading] = useState(false);
  const { address } = useAccount();
  const { writeContractAsync, data: hash } = useWriteContract();
  const withDraw = async () => {
    setLoading(true);
    await writeContractAsync({
      abi: walletJson.abi,
      address: walletAddress,
      functionName: 'withDraw',
      args: [withDrawValue],
    });
  };

  // wallet balance
  const { data, refetch } = useReadContract({
    abi: walletJson.abi,
    address: walletAddress,
    account: address,
    functionName: 'showBalance',
  });
  const { isSuccess } = useWaitForTransactionReceipt({ hash });

  if (isSuccess && loading) {
    setLoading(false);
    refetch();
    message.success('withDraw success!');
  }
  return (
    <div>
      <span>your wallet balance:{data?.toString()} wei</span>
      <Input onChange={e => setWithDrawValue(e.target.value)} key="withdraw" />
      <Button type="primary" block onClick={() => withDraw()} loading={loading}>
        WithDraw
      </Button>
    </div>
  );
}

export default Withdraw;

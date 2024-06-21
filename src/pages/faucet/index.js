import { useState } from 'react';
import { message, Input, Button } from 'antd';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import './index.css';
import { faucetAddress } from '../addressConfig';
import faucetAbi from '../../contract/faucet.json';

function Faucet() {
  const [targetAddress, setTargetAddress] = useState('');
  const { isConnected, address } = useAccount();

  const { data, refetch } = useReadContract({
    abi: faucetAbi.abi,
    address: faucetAddress,
    functionName: 'showBalance',
  });

  const { writeContractAsync, data: hash } = useWriteContract();

  const getToken = async () => {
    if (!isConnected) {
      message.error('请连接您的钱包！');
      return;
    }
    writeContractAsync({
      abi: faucetAbi.abi,
      address: faucetAddress,
      functionName: 'getToken',
      args: [targetAddress],
    }).catch(error => {
      message.info('您当天已经领取过AirToken了,请24小时之后再进行尝试!');
      console.log('error', error);
    });
  };

  const { isSuccess } = useWaitForTransactionReceipt({ hash });
  if (isSuccess) {
    message.success('you has received $10000 Air token!');
    refetch();
  }

  return (
    <div className="faucet-wrap">
      <div>
        <p>$Air faucet </p>
        <p>balance:{data && data.toString()}</p>
        <Input addonBefore="address" onChange={e => setTargetAddress(e.target.value)} />
        <Button type="primary" onClick={() => getToken()}>
          get $Air token
        </Button>
      </div>
    </div>
  );
}

export default Faucet;

import { useState } from 'react';
import { message, Input, Button } from 'antd';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import './index.css';
import { fdTokenAddress } from '../addressConfig';
import { faucetAddress } from '../addressConfig';
import faucetAbi from '../../contract/faucet.json';

function Faucet() {
  const [targetAddress, setTargetAddress] = useState('');
  const { isConnected, address } = useAccount();

  //   const res = useReadContract({
  //     abi: faucetAbi.abi,
  //     address: faucetAddress,
  //     functionName: 'showBalance',
  //   });

  const { writeContractAsync, data: hash } = useWriteContract();

  const getToken = async () => {
    if (!isConnected) {
      message.error('请连接您的钱包！');
      return;
    }

    await writeContractAsync({
      abi: faucetAbi.abi,
      address: faucetAddress,
      account: address,
      functionName: 'getToken',
      args: [targetAddress],
    });
  };

  const { isSuccess } = useWaitForTransactionReceipt({ hash });
  if (isSuccess) {
    message.success('has received $10000 fd token!');
  }

  return (
    <div className="faucet-wrap">
      <div>
        <p>$fd faucet</p>
        <Input addonBefore="address" onChange={e => setTargetAddress(e.target.value)} />
        <Button type="primary" onClick={() => getToken()}>
          get $fd token
        </Button>
      </div>
    </div>
  );
}

export default Faucet;

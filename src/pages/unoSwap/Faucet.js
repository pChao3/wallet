import { Input, message, Button } from 'antd';
import { useEffect, useState } from 'react';
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import faucetAbi from '../../contract/faucet.json';
import { WaterfaucetAddr } from '../addressConfig';
function Faucet(props) {
  const { address } = useAccount();

  const { writeContractAsync, data: hash } = useWriteContract();
  const get = () => {
    writeContractAsync({
      abi: faucetAbi.abi,
      address: WaterfaucetAddr,
      functionName: 'getToken',
      args: [address],
    }).catch(() => {
      message.info('you already got the token,plesae try next day!');
    });
  };

  const getRecipient = useWaitForTransactionReceipt({ hash });
  useEffect(() => {
    if (getRecipient.isSuccess) {
      props.updateBalance();
      message.success('you have claimed $Water tokens');
    }
  }, [getRecipient.isSuccess]);

  return (
    <div>
      <Button onClick={get}>get $Water Token</Button>
    </div>
  );
}

export default Faucet;

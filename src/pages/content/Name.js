import { message } from 'antd';
import NameJson from '../../contract/name.json';
import { useState, useEffect, useCallback } from 'react';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import './Name.css';
import { NameAddress } from '../addressConfig';
function Name() {
  const [value, setValue] = useState('');
  const { data, refetch } = useReadContract({
    abi: NameJson.abi,
    address: NameAddress,
    functionName: 'getName',
  });

  const { isConnected, address } = useAccount();

  const { writeContractAsync, data: hash } = useWriteContract();

  const handleChange = useCallback(() => {
    if (!isConnected) {
      message.info('请连接钱包进行尝试!');
      return;
    }
    if (!value) {
      return;
    }
    writeContractAsync({
      abi: NameJson.abi,
      address: NameAddress,
      functionName: 'changeName',
      args: [value],
    }).then(() => {
      setValue('');
    });
  }, [value, isConnected]);

  const res = useWaitForTransactionReceipt({ hash });
  if (res.isSuccess) {
    refetch();
  }
  return (
    <div className="text-center">
      {address && <p>address:{address}</p>}
      <div className="mt-4">
        <p className="text-4xl">what's your name ?</p>
        <span>name:{data === '' ? '暂无数据' : data}</span>
        <div>
          <input
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="write your name"
            className="bg-transparent border"
          />
          <button onClick={handleChange}>修改</button>
        </div>
      </div>
    </div>
  );
}

export default Name;

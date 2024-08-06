import { message, Button } from 'antd';
import NameJson from '../../contract/name.json';
import { useState, useEffect, useCallback } from 'react';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import './Name.css';
import { NameAddress } from '../addressConfig';
function Name() {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    writeContractAsync({
      abi: NameJson.abi,
      address: NameAddress,
      functionName: 'changeName',
      args: [value],
    })
      .then(() => {
        setValue('');
      })
      .catch(error => {
        console.log('error', error);
        setLoading(false);
      });
  }, [value, isConnected]);

  const res = useWaitForTransactionReceipt({ hash });
  if (res.isSuccess) {
    loading && setLoading(false);
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
          <Button
            onClick={handleChange}
            loading={loading}
            size="small"
            type="primary"
            className="ml-2"
          >
            修改
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Name;

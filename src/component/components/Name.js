import { message } from 'antd';
import contractJson from '../../contract/contract.json';
import { useState, useEffect, useCallback } from 'react';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import './Name.css';
const contractAddress = '0x0836Cb07da51a8d3383275BBD2C9B6F02dA019B0';
function Name() {
  const [value, setValue] = useState();
  const { data, refetch } = useReadContract({
    abi: contractJson.abi,
    address: contractAddress,
    functionName: 'getName',
  });

  const t = useReadContract({
    abi: contractJson.abi,
    address: contractAddress,
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
      abi: contractJson.abi,
      address: contractAddress,
      functionName: 'changeName',
      args: [value],
    });
  }, [value, isConnected]);

  const res = useWaitForTransactionReceipt({ hash });
  if (res.isSuccess) {
    refetch();
  }
  return (
    <div>
      {address && <p>address:{address}</p>}
      <div className="input-box">
        <span>name:{data === '' ? '暂无数据' : data}</span>
        <div>
          <input onChange={e => setValue(e.target.value)} placeholder="write your name" />
          <button onClick={handleChange}>修改</button>
        </div>
      </div>
    </div>
  );
}

export default Name;

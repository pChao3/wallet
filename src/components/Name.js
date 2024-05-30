import contractJson from './contract.json';
import { useState, useEffect, useCallback } from 'react';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
const contractAddress = '0x0836Cb07da51a8d3383275BBD2C9B6F02dA019B0';
function Name() {
  const [value, setValue] = useState();
  const { data, refetch } = useReadContract({
    abi: contractJson.abi,
    address: contractAddress,
    functionName: 'getName',
  });
  const { isConnected } = useAccount();

  const { writeContractAsync, data: hash } = useWriteContract();

  const handleChange = useCallback(() => {
    if (!isConnected) {
      alert('请连接钱包进行尝试！');
      return;
    }
    writeContractAsync({
      abi: contractJson.abi,
      address: contractAddress,
      functionName: 'changeName',
      args: [value],
    }).then(res => {
      console.log('data hash', res);
    });
  }, [value, isConnected]);

  const res = useWaitForTransactionReceipt({ hash });
  if (res.isSuccess) {
    refetch();
  }
  return (
    <div style={{ height: 200 }}>
      <span>name:{data === '' ? '暂无数据' : data}</span>
      <div>
        <input onChange={e => setValue(e.target.value)} />
        <button onClick={handleChange}>修改</button>
      </div>
    </div>
  );
}

export default Name;

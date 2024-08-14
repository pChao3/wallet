import { Button, Input, message, Select } from 'antd';
import { memo, useEffect, useMemo, useState } from 'react';
import {
  useAccount,
  useBalance,
  useReadContract,
  useReadContracts,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import FaucetButton from './Faucet.js';
import { swapAbi } from '../../contract/ABI.js';
import tokenAbi from '../../contract/Token.json';

import { AirToken, WaterToken, SwapAddress } from '../addressConfig.js';

const pairArr = [
  {
    value: AirToken,
    label: '$Air',
  },
  {
    value: WaterToken,
    label: '$Water',
  },
];
function Test() {
  const [avalue, setAvalue] = useState(100);
  const [bvalue, setBvalue] = useState(100);

  const [inValue, setInValue] = useState(100);
  const [selectValue, setSelectValue] = useState(AirToken);

  const { writeContractAsync, data: addHash } = useWriteContract();
  const { address } = useAccount();

  // 获取当前余额
  const { data: a, refetch: refetcha } = useReadContract({
    abi: tokenAbi.abi,
    address: AirToken,
    functionName: 'balances',
    args: [address],
  });
  const { data: b, refetch: refetchb } = useReadContract({
    abi: tokenAbi.abi,
    address: WaterToken,
    functionName: 'balances',
    args: [address],
  });

  const updateBalance = () => {
    refetcha();
    refetchb();
  };
  const { writeContractAsync: getApproveFuna, data: hasha } = useWriteContract();
  const { writeContractAsync: getApproveFunb, data: hashb } = useWriteContract();
  // 授权
  const getApprove = async () => {
    await getApproveFuna({
      abi: tokenAbi.abi,
      address: AirToken,
      functionName: 'approve',
      args: [SwapAddress, 10000],
    });
    await getApproveFunb({
      abi: tokenAbi.abi,
      address: WaterToken,
      functionName: 'approve',
      args: [SwapAddress, 10000],
    });
  };

  // 查看获得的流动性奖励
  const { data: per, refetch: rewardRefetch } = useReadContract({
    address: SwapAddress,
    abi: swapAbi,
    functionName: 'balanceOf',
    args: [address],
  });

  const { data, refetch: refreshContractBalance } = useReadContracts({
    contracts: [
      {
        address: SwapAddress,
        abi: swapAbi,
        functionName: 'reserve0',
      },
      {
        address: SwapAddress,
        abi: swapAbi,
        functionName: 'reserve1',
      },
    ],
  });

  // 添加流动性
  const addLiqu = () => {
    writeContractAsync({
      address: SwapAddress,
      abi: swapAbi,
      functionName: 'addLiquidity',
      args: [avalue, bvalue],
    });
  };
  const addRecipient = useWaitForTransactionReceipt({ hash: addHash });

  useEffect(() => {
    if (addRecipient.isSuccess) {
      refetcha();
      refetchb();
      rewardRefetch();
      refreshContractBalance();
      message.success('addLiquidity success!');
    }
  }, [addRecipient.isSuccess]);

  // 移除流动性
  const { writeContractAsync: removeFun, data: removeHash } = useWriteContract();
  const removeLiqu = () => {
    removeFun({
      address: SwapAddress,
      abi: swapAbi,
      functionName: 'removeLiquidity',
      args: [per],
    });
  };
  const removeRecipient = useWaitForTransactionReceipt({ hash: removeHash });

  useEffect(() => {
    if (removeRecipient.isSuccess) {
      message.success('removeLiquidity success!');
      refetcha();
      refetchb();
      rewardRefetch();
      refreshContractBalance();
    }
  }, [removeRecipient.isSuccess]);
  const m = useMemo(() => {
    if (!data) {
      return [];
    }
    if (selectValue !== AirToken) {
      return [data[1].result, data[0].result];
    } else {
      return [data[0].result, data[1].result];
    }
  }, [selectValue, data]);
  console.log('m', m);
  const calcData = useReadContract({
    abi: swapAbi,
    address: SwapAddress,
    functionName: 'getAmountOut',
    args: [inValue, ...m],
  });
  console.log('vcalcData', calcData);

  const selectChange = e => {
    setSelectValue(e);
  };

  const { writeContractAsync: swapFun, data: hash } = useWriteContract();
  const SwapToken = () => {
    swapFun({
      address: SwapAddress,
      abi: swapAbi,
      functionName: 'swap',
      args: [inValue, selectValue, Number(calcData?.data) - 1],
    });
  };
  const swapRecipient = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (swapRecipient.isSuccess) {
      refetcha();
      refetchb();
      refreshContractBalance();
      message.success('swap success!');
    }
  }, [swapRecipient.isSuccess]);
  return (
    <div className="text-white w-1/4 mt-24 text-center">
      <FaucetButton updateBalance={updateBalance} />
      <p>You have</p>
      <p>$Air balance :{a?.toString()}</p>
      <p>$Water balance :{b?.toString()}</p>
      <Button onClick={getApprove}>授权</Button>
      <hr className="m-4" />
      <div className="flex m-4">
        <label className="w-20">$Air: </label>
        <Input value={avalue} onChange={e => setAvalue(e.target.value)} />
      </div>
      <div className="flex m-4">
        <label className="w-20">$Water: </label>
        <Input value={bvalue} onChange={e => setBvalue(e.target.value)} />
      </div>

      <p className="ml-4">liquidity rewards: {per?.toString()}</p>
      <Button onClick={addLiqu} className="mr-2">
        addLiquidity
      </Button>
      <Button onClick={removeLiqu}>removeLiquidity</Button>
      <hr className="m-4" />
      <div className="m-4">
        <p className="text-center">
          SwapBalance($Air/$Water) : {data ? data[0].result.toString() : 0}/
          {data ? data[1].result.toString() : 0}
        </p>
        <Select
          value={selectValue}
          style={{
            width: 120,
          }}
          onChange={selectChange}
          options={pairArr}
        />
        <Input className="mt-2" value={inValue} onChange={e => setInValue(e.target.value)} />
        <h1>
          you can swap ${calcData?.data?.toString()}{' '}
          {pairArr.find(i => i.value !== selectValue).label}
        </h1>
        <Button onClick={SwapToken}>Swap</Button>
      </div>
    </div>
  );
}

export default memo(Test);

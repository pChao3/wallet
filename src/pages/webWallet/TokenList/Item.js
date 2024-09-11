import { useCallback, useEffect, useState } from 'react';
import { provider } from '../../../util/walletUtils';
import { ethers } from 'ethers';
import useStore from '../../../store';
import { Spin } from 'antd';

function ListItem({ info }) {
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [balance, setBalance] = useState(0);
  const { currentAccount } = useStore();

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getInfo();
    console.log('did');
  }, [currentAccount]);

  const getInfo = useCallback(async () => {
    console.log(info);
    if (!info) return;
    setLoading(true);
    try {
      const contract = await new ethers.Contract(info.address, info.abi, provider);
      const balance = await contract.balanceOf(currentAccount.address);
      const name = await contract.name();
      const symbol = await contract.symbol();
      setBalance(ethers.formatEther(balance));
      setName(name);
      setSymbol(symbol);
      console.log('balance', ethers.formatEther(balance));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [currentAccount]);
  return (
    <div className="rounded-lg p-6 hover:bg-gray-200 cursor-pointer transition duration-300 mb-4">
      <Spin spinning={loading}>
        <div className="flex justify-between items-center space-x-4">
          <div className="flex-1 space-y-2">
            <h3 className="text-xl font-semibold text-white">{name}</h3>
            <p className="text-sm text-gray-100">{symbol}</p>
          </div>
          <div className="text-right space-y-1">
            <p className="text-2xl font-bold text-blue-600">{balance}</p>
            <p className="text-sm text-gray-100">{symbol}</p>
          </div>
        </div>
      </Spin>
    </div>
  );
}

export default ListItem;

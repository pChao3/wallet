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
  }, [currentAccount, info]);

  useEffect(() => {
    getInfo();
  }, [currentAccount]);

  return (
    <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 cursor-pointer transition duration-300">
      <Spin spinning={loading}>
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-white mb-1">{name}</h3>
            <p className="text-sm text-gray-400">{symbol}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-400 mb-1">{balance}</p>
            <p className="text-sm text-gray-400">{symbol}</p>
          </div>
        </div>
      </Spin>
    </div>
  );
}

export default ListItem;

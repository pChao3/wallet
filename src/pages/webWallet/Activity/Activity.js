import { useState, useEffect, useCallback } from 'react';
import { getActiveList } from '../utils';
import useStore from '../../../store';
import dayjs from 'dayjs';
import { ethers } from 'ethers';
// import utils from 'ethers-utils'
import { provider } from '../../../util/walletUtils';
import { message } from 'antd';

// ERC20 Transfer 事件的 ABI
const erc20TransferAbi = [
  'event Transfer(address indexed from, address indexed to, uint256 value)',
];

const abi = ['function symbol() view returns(string)'];

function Activity() {
  const [page, setPage] = useState(1);
  const [offset, setOffset] = useState(10);
  const [list, setList] = useState([]);
  const { currentAccount } = useStore();
  const [symbols, setSymbols] = useState({});
  const [transferAmounts, setTransferAmounts] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    init();
  }, [currentAccount.address]);

  const init = async () => {
    try {
      const res = await getActiveList(currentAccount.address, page, offset);
      if (res.status === '1') {
        console.log('res', res.result);

        setList(res.result);
      }
    } catch (error) {
      console.log('someting wrong!');
    }
  };

  const getName = info => {
    if (info.value !== '0' && info.gas === '21000') {
      if (info.from.toLowerCase() === currentAccount.address.toLowerCase()) {
        return 'Send';
      } else {
        return 'Received';
      }
    }
    if (info.functionName.includes('transfer')) {
      return 'Transfer';
    }
  };

  const getUint = info => {
    if (info.from.toLowerCase() === currentAccount.address.toLowerCase()) {
      return '-';
    } else {
      return '+';
    }
  };

  const getSymbol = async info => {
    if (symbols[info.to]) {
      return;
    }
    if (info.value !== '0') {
      setSymbols(prev => ({ ...prev, [info.to]: 'ETH' }));
      return;
    }
    try {
      const contract = new ethers.Contract(info.to, abi, provider);
      const symbol = await contract.symbol();
      setSymbols(prev => ({ ...prev, [info.to]: symbol }));
    } catch (error) {
      console.error('获取代币符号时出错:', error);
    }
  };

  const getTransferAmount = async info => {
    try {
      const uint = getUint(info);

      if (info.value !== '0') {
        return uint + ethers.formatEther(info.value);
      }
      const receipt = await provider.getTransactionReceipt(info.hash);
      if (!receipt) return null;
      const iface = new ethers.Interface(erc20TransferAbi);

      for (const log of receipt.logs) {
        try {
          const parsedLog = iface.parseLog(log);
          if (parsedLog.name === 'Transfer') {
            return uint + ethers.formatUnits(parsedLog.args[2], 18); // 假设代币精度为18，如果不���，需要相应调整
          }
        } catch (error) {
          // 如果解析失败，可能不是 Transfer 事件，继续下一个日志
          continue;
        }
      }
      return null; // 如果没有找到 Transfer 事件
    } catch (error) {
      console.error('获取转账数量时出错:', error);
      return null;
    }
  };
  const fn = useCallback(() => {
    console.log('amount');

    list.forEach(async (item, i) => {
      await getSymbol(item);
      const amount = await getTransferAmount(item);
      console.log(amount, 'llll', i);
      if (amount) {
        setTransferAmounts(prev => ({ ...prev, [item.hash]: amount }));
      }
    });
  }, [list.length]);

  useEffect(() => {
    if (!list.length) return;
    fn();
  }, [list.length]);

  const loadMore = async () => {
    setLoading(true);
    try {
      const nextPage = page + 1;
      const res = await getActiveList(currentAccount.address, nextPage, offset);
      if (!res.result.length) {
        message.info('暂无更多数据！');
        return;
      }
      if (res.status === '1') {
        setList(prevList => [...prevList, ...res.result]);
        setPage(nextPage);
      }
    } catch (error) {
      console.log('加载更多数据时出错:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 h-[calc(100vh-500px)] flex flex-col">
      <div className="overflow-y-auto flex-grow">
        <ul className="space-y-4">
          {list.map(i => (
            <li
              key={i.hash}
              onClick={() => window.open(`https://sepolia.etherscan.io/tx/${i.hash}`)}
              className="bg-gray-900 shadow rounded-lg p-4 flex justify-between items-center cursor-pointer"
            >
              <div>
                <p className=" font-semibold text-blue-100 text-lg">{getName(i)}</p>
                <p className="text-sm text-gray-500">
                  {dayjs(i.timeStamp * 1000).format('YYYY-MM-DD HH:mm:ss')}
                </p>
              </div>
              <div className="text-right">
                <p
                  className={`font-medium ${
                    getUint(i) === '+' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {transferAmounts[i.hash]
                    ? `${transferAmounts[i.hash]} ${symbols[i.to] || ''}`
                    : '加载中...'}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4 text-center">
        <button
          onClick={loadMore}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? '加载中...' : '加载更多'}
        </button>
      </div>
    </div>
  );
}

export default Activity;

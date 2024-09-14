import AccountList from './AccountList';
import { Tooltip } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import 'dotenv/config';
// const { API_KEY } = process.env;
import useStore from '../../../store';

function AccountInfo() {
  const { currentAccount } = useStore();
  const exportKeyStore = async () => {
    const keyJson = currentAccount.jsonStore;
    const blob = new Blob([keyJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'keyStore.json';
    a.click();
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className=" flex items-center justify-between text-white">
        <div className="flex-1">
          <div className="text-2xl font-bold mb-2 flex justify-center ">
            <p>{currentAccount.name}</p>
            <AccountList />
          </div>
          <p className="text-sm text-gray-400">
            地址: <span className="font-mono text-gray-300">{currentAccount.address}</span>
          </p>
          <p className="text-sm text-gray-400 mt-1">
            余额: <span className="font-semibold text-green-400">{currentAccount.balance} ETH</span>
          </p>
        </div>

        <Tooltip placement="top" title="导出密钥文件" color="blue">
          <button
            onClick={exportKeyStore}
            className="p-2 bg-blue-500 rounded-full hover:bg-blue-600 transition duration-300"
          >
            <DownloadOutlined className="text-xl" />
          </button>
        </Tooltip>
      </div>
    </div>
  );
}

export default AccountInfo;

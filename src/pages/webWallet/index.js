import { Button, Tabs } from 'antd';
import { useState } from 'react';
import AccountInfo from './AccountInfo/Index';
import TransModule from './transaction';
import TokenList from './TokenList';

const items = [
  {
    key: '1',
    label: '代币',
    children: <TokenList />,
  },
  {
    key: '2',
    label: '交易',
    children: <div>222</div>,
  },
];

function WebWallet() {
  const [showInfo, setShowInfo] = useState(true);

  const onChange = key => {
    console.log(key);
  };

  return (
    <div className="w-1/3 mx-auto p-6 bg-gray-900 rounded-xl shadow-2xl text-white text-center">
      <div className="space-y-6">
        <AccountInfo />
        {showInfo ? (
          <div className="space-y-6">
            <Button
              type="primary"
              className="w-full bg-blue-500 hover:bg-blue-600 border-none py-3 text-lg font-semibold rounded-lg transition duration-300"
              onClick={() => setShowInfo(false)}
            >
              转账
            </Button>
            <Tabs
              defaultActiveKey="1"
              items={items}
              onChange={onChange}
              centered
              className="bg-gray-800 p-4 rounded-lg"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <TransModule />
            <Button
              onClick={() => setShowInfo(true)}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white border-none py-2 rounded-lg transition duration-300"
            >
              返回
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default WebWallet;

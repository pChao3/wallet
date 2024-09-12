import { Button, Input, Tabs } from 'antd';
import { useState } from 'react';
import GenerateWallet from './gengrateWallet';
import ExportFile from './exportFile';
import ImportFile from './importFile';

import AccountInfo from './AccountInfo/Index';
import TransModule from './transaction';

import TokenList from './TokenList';

// 1.生成钱包
// 2.导出keyStore文件
// 3.导入keyStore文件
const items = [
  {
    key: '1',
    label: '代币',
    children: <TokenList />,
  },
  {
    key: '2',
    label: '交易',
    children: <di>222</di>,
  },
];

function WebWallet() {
  const [page, setPage] = useState(1);
  const [showInfo, setShowInfo] = useState(true);

  const onChange = key => {
    console.log(key);
  };

  const addToken = () => {};
  return (
    <div className="text-black text-2xl w-1/2 text-center bg-black bg-opacity-50 p-4 border-white border ">
      {page === 1 && (
        <div>
          <GenerateWallet onNext={setPage} />
          <hr className="mt-4 mb-4" />
          <ImportFile onNext={setPage} />
          <hr className="mt-4 mb-4" />
          <ExportFile />
        </div>
      )}
      {page === 2 && (
        <div>
          <AccountInfo />
          <Button type="primary" className="w-1/2" onClick={() => setShowInfo(false)}>
            转账
          </Button>
          {showInfo ? (
            <Tabs defaultActiveKey="1" items={items} onChange={onChange} centered />
          ) : (
            <div>
              <TransModule />
              <Button onClick={() => setShowInfo(true)}>返回</Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default WebWallet;

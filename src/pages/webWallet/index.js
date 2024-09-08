import { Button, Input } from 'antd';
import { useState } from 'react';
import GenerateWallet from './gengrateWallet';
import ExportFile from './exportFile';
import ImportFile from './importFile';

import AccountInfo from './AccountInfo/Index';
import TransModule from './transaction';

// 1.生成钱包
// 2.导出keyStore文件
// 3.导入keyStore文件

function WebWallet() {
  const [page, setPage] = useState(1);
  return (
    <div className="text-black text-2xl w-1/2 text-center bg-white p-4">
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
          <TransModule />
          <Button onClick={() => setPage(1)}>返回</Button>
        </div>
      )}
    </div>
  );
}

export default WebWallet;

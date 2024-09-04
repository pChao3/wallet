import { Button, Input } from 'antd';
import { useState } from 'react';
import GenerateWallet from './gengrateWallet';
import ExportFile from './exportFile';
import ImportFile from './importFile';

// 1.生成钱包
// 2.导出keyStore文件
// 3.导入keyStore文件

function WebWallet() {
  return (
    <div className="text-black text-2xl w-1/3 text-center bg-white p-4">
      <GenerateWallet />
      <hr className="mt-4 mb-4" />
      <ExportFile />
      <hr className="mt-4 mb-4" />
      <ImportFile />
    </div>
  );
}

export default WebWallet;

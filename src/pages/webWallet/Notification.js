import { Spin } from 'antd';
const sepoliaUrl = 'https://sepolia.etherscan.io/tx/';

function Notification({ loading, txHash, close }) {
  return (
    <div className="fixed top-8 right-4 w-1/4 bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="flex justify-between mb-4">
        <span className="text-white font-semibold">结果</span>
        <span onClick={close} className="cursor-pointer text-gray-400 hover:text-blue-400">
          X
        </span>
      </div>
      <div className="flex justify-between items-center">
        <div className="text-white">
          <p className="font-medium">状态</p>
          <p>{loading ? '处理中' : '成功'}</p>
        </div>
        {loading && <Spin spinning={true} className="text-blue-500" />}
        <div>
          <a
            className="text-blue-400 cursor-pointer hover:underline"
            onClick={() => window.open(sepoliaUrl + txHash)}
          >
            去区块浏览器查看
          </a>
        </div>
      </div>
    </div>
  );
}

export default Notification;

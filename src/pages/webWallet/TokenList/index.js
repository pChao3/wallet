import { useEffect, useState } from 'react';
import { Button, Modal, Input, message } from 'antd';
import { AirToken, WaterToken } from '../../addressConfig';
import tokenABI from '../../../contract/Token.json';
import Item from './Item';
import useStore from '../../../store';
const tokenlist = [
  {
    address: AirToken,
    abi: tokenABI.abi,
  },
  {
    address: WaterToken,
    abi: tokenABI.abi,
  },
];
const api_key = 'CCABDVGYXV5GT1RHWH9IKR2XF18Z5GV3A7';
function Index() {
  const [contractAddress, setContractAddress] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addTokenInfo, tokensInfo } = useStore();

  useEffect(() => {
    addTokenInfo(tokenlist);
  }, [addTokenInfo]);

  const addAddress = async () => {
    console.log(contractAddress);
    if (tokensInfo.some(i => i.address === contractAddress)) {
      message.info('该代币合约已经导入了！');
      return;
    }
    setLoading(true);
    try {
      const apiUrl = 'https://api-sepolia.etherscan.io/api';
      const res = await fetch(
        `${apiUrl}/?module=contract&action=getabi&address=${contractAddress}&apikey=${api_key}`
      ).then(res => res.json());
      if (res.status === '0') {
        message.error('请检查导入合约地址！');
        return;
      }
      addTokenInfo({ address: contractAddress, abi: JSON.parse(res.result) });
    } catch (error) {
      message.error(error.code);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
      <ul className="space-y-4 mb-6">
        {tokensInfo.map(i => (
          <Item info={i} key={i.address} />
        ))}
      </ul>
      <div className="text-center">
        <Button
          type="primary"
          onClick={() => setModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white border-none px-6 py-2 rounded-full transition duration-300"
        >
          添加代币
        </Button>
      </div>
      <Modal
        title="添加代币"
        open={isModalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        className="text-center"
      >
        <div className="flex items-center mb-4">
          <span className="w-1/5 text-right mr-4">代币地址：</span>
          <Input
            value={contractAddress}
            onChange={e => setContractAddress(e.target.value)}
            className="flex-1"
          />
        </div>
        <Button
          onClick={addAddress}
          loading={loading}
          className="bg-green-500 text-white px-6 py-2 rounded-full transition duration-300"
        >
          导入
        </Button>
      </Modal>
    </div>
  );
}

export default Index;

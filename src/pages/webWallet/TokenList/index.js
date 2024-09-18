import { useEffect, useState } from 'react';
import { Button, Modal, Input, message } from 'antd';
import Item from './Item';
import TokenInfo from './TokenInfo';
import useStore from '../../../store';
import { getAbiFromAddress } from '../utils';
import useWallet from '../../../util/walletUtils';
import { provider } from '../../../util/walletUtils';

function Index() {
  const [contractAddress, setContractAddress] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectToken, setSelectToken] = useState();
  const [open, setTokenOpen] = useState(false);
  const { addTokenInfo, tokensInfo } = useStore();
  // const { refreshCurrentState } = useWallet();

  const addAddress = async () => {
    console.log(contractAddress);
    if (tokensInfo.some(i => i.address === contractAddress)) {
      message.info('该代币合约已经导入了！');
      return;
    }
    setLoading(true);
    try {
      const res = await getAbiFromAddress(contractAddress);
      if (res.status === '0') {
        message.error('请检查导入合约地址！');
        return;
      }
      addTokenInfo({ address: contractAddress, abi: JSON.parse(res.result) });
      setModalOpen(false);
    } catch (error) {
      message.error(error.code);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isModalOpen) {
      setContractAddress('');
    }
  }, [isModalOpen]);

  const clickToken = i => {
    setSelectToken(i);
    setTokenOpen(true);
  };
  const closeFresh = async () => {
    setTokenOpen(false);
    // 更新当前余额
    // refreshCurrentState();
  };
  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
      <ul className="space-y-4 mb-6">
        {tokensInfo.map(i => (
          <div onClick={() => clickToken(i)}>
            <Item info={i} key={i.address} />
          </div>
        ))}
      </ul>
      <TokenInfo open={open} tokenInfo={selectToken} onClose={closeFresh} />
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

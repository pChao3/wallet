import { useState } from 'react';
import { Button, Modal, Input, message } from 'antd';
import { AirToken, WaterToken } from '../../addressConfig';

import { ethers } from 'ethers';
import { provider } from '../../../util/walletUtils';
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

  const addAddress = async () => {
    console.log(contractAddress);
    if (tokenlist.some(i => i.address === contractAddress)) {
      message.info('该代币合约已经导入了！');
      return;
    }
    const apiUrl = 'https://api-sepolia.etherscan.io/api';
    const res = await fetch(
      `${apiUrl}/?module=contract&action=getabi&address=${contractAddress}&apikey=${api_key}`
    ).then(res => res.json());
    if (res.status === '0') {
      message.error('请检查导入合约地址！');
      return;
    }
    tokenlist.push({ address: contractAddress, abi: JSON.parse(res.result) });
    // const contract = new ethers.Contract(contractAddress, JSON.parse(res.result), provider);
    // const balance = await contract.balanceOf(currentAccount.address);
    // console.log(balance);
  };
  return (
    <div>
      <ul>
        {tokenlist.map(i => {
          return <Item info={i} key={i.address} />;
        })}
      </ul>
      <p>
        <Button type="primary" onClick={() => setModalOpen(true)}>
          添加代币
        </Button>
      </p>
      <Modal
        className="text-center"
        title="添加代币！"
        open={isModalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
      >
        <div className="flex items-center mb-2">
          <span className="w-1/4">代币地址：</span>
          <Input value={contractAddress} onChange={e => setContractAddress(e.target.value)} />
        </div>
        <Button onClick={addAddress}>导入</Button>
      </Modal>
    </div>
  );
}

export default Index;

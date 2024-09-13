import { ethers } from 'ethers';
import { getBalance, provider } from '../../../util/walletUtils';
import { useState } from 'react';
import { Modal, Button, Spin } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import { decryptData } from '../../../util/securityUtils';
import { hdkey } from 'ethereumjs-wallet';
import useStore, { usePassword, useSeed } from '../../../store';

import ImportJsonFile from './importFile';

function AccountList() {
  const { password } = usePassword();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openJSONModal, setOpenJSONModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListloading] = useState(false);

  const {
    setCurrentAccount,
    currentIndex,
    increaseCurrentIndex,
    accountList,
    addAccountList,
    setAccountList,
  } = useStore();
  const { encryptSeed } = useSeed();

  const selectAccount = i => {
    setCurrentAccount(i);
    setIsModalOpen(false);
  };

  const addAccount = async () => {
    setLoading(true);
    setListloading(true);
    try {
      const seed = decryptData(encryptSeed, password);
      const hdWallet = hdkey
        .fromMasterSeed(Buffer.from(seed, 'hex'))
        .derivePath(`m/44'/60'/0'/0/${currentIndex}`);

      const wallet = new ethers.Wallet(hdWallet._hdkey.privateKey.toString('hex'));
      const jsonStore = await wallet.encrypt(password);

      const balance = await getBalance(wallet.address);
      const account = {
        address: wallet.address,
        balance: balance,
        name: `Account${currentIndex + 1}`,
        jsonStore: jsonStore,
      };
      increaseCurrentIndex();
      addAccountList(account);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setListloading(false);
    }
  };

  const openModal = async () => {
    setIsModalOpen(true);
    setListloading(true);

    for (let i = 0; i < accountList.length; i++) {
      const item = accountList[i];
      const balance = await provider.getBalance(item.address);
      accountList[i].balance = ethers.formatEther(balance);
    }
    console.log(accountList);
    setAccountList(accountList);
    setListloading(false);
  };
  return (
    <div>
      <Modal
        className="text-center"
        title="请选择账户"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Spin tip="加载中..." spinning={listLoading}>
          <ul className="space-y-4 mb-6">
            {accountList.length &&
              accountList.map(i => (
                <li
                  key={i.address}
                  onClick={() => selectAccount(i)}
                  className="p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-300 cursor-pointer"
                >
                  <div className="text-left">
                    <p className="text-sm text-gray-600">
                      地址: <span className="font-mono text-gray-800">{i.address}</span>
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      余额: <span className="font-semibold text-gray-800">{i.balance} ETH</span>
                    </p>
                  </div>
                </li>
              ))}
          </ul>
        </Spin>
        <div className="flex justify-center space-x-4">
          <Button
            onClick={() => setOpenJSONModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            导入密钥文件
          </Button>
          <Button
            onClick={addAccount}
            loading={loading}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            创建新账户
          </Button>
        </div>
      </Modal>
      <ImportJsonFile onClose={() => setOpenJSONModal(false)} open={openJSONModal} />
      <a
        className="cursor-pointer text-blue-500 hover:text-blue-600 transition duration-300 ml-2"
        onClick={openModal}
      >
        <SwapOutlined className="text-xl" />
      </a>
    </div>
  );
}

export default AccountList;

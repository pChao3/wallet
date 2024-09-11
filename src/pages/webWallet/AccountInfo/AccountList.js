import { ethers } from 'ethers';
import { getBalance, provider } from '../../../util/walletUtils';
import { useEffect, useState } from 'react';
import { Modal, Button, Spin } from 'antd';
import { decryptData } from '../../../util/securityUtils';
import { hdkey } from 'ethereumjs-wallet';
import useStore, { usePassword, useSeed } from '../../../store';

import ImportJsonFile from '../importFile';

function AccountList() {
  const { password } = usePassword();
  const [accountList, setAccountList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openJSONModal, setOpenJSONModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListloading] = useState(false);

  const { setCurrentAccount, currentIndex, increaseCurrentIndex } = useStore();
  const { encryptSeed } = useSeed();

  const getAccountsInfo = async () => {
    const infos = JSON.parse(localStorage.getItem('keyFiles'));
    setAccountList(infos);
  };
  useEffect(() => {
    getAccountsInfo();
  }, []);

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

      const accountList = JSON.parse(localStorage.getItem('keyFiles'));
      const balance = await getBalance(wallet.address);
      accountList.push({
        address: wallet.address,
        balance: balance,
        name: `Account${currentIndex}`,
        jsonStore: jsonStore,
      });
      increaseCurrentIndex();
      localStorage.setItem('keyFiles', JSON.stringify(accountList));
      setAccountList(accountList);
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

    const accountsList = JSON.parse(localStorage.getItem('keyFiles'));
    for (let i = 0; i < accountsList.length; i++) {
      const item = accountsList[i];
      const balance = await provider.getBalance(item.address);
      accountsList[i].balance = ethers.formatEther(balance);
    }
    console.log(accountsList);
    setAccountList(accountsList);
    setListloading(false);
    localStorage.setItem('keyFiles', JSON.stringify(accountsList));
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
        <Spin tip="loading..." spinning={listLoading}>
          <ul>
            {accountList.length &&
              accountList.map(i => (
                <li key={i.address} onClick={() => selectAccount(i)} className="mt-4">
                  <a>
                    <p> address: {i.address} </p>
                    <p>balance :{i.balance}</p>
                  </a>
                </li>
              ))}
          </ul>
        </Spin>
        <Button onClick={() => setOpenJSONModal(true)}>导入密钥文件</Button>
        <Button onClick={addAccount} loading={loading}>
          创建新账户
        </Button>
      </Modal>
      <Modal
        className="text-center"
        title="导入JSON文件"
        open={openJSONModal}
        onCancel={() => setOpenJSONModal(false)}
        footer={null}
      >
        <ImportJsonFile onClose={() => setOpenJSONModal(false)} />
      </Modal>
      <a className="cursor-pointer text-blue-500" onClick={openModal}>
        +
      </a>
    </div>
  );
}

export default AccountList;

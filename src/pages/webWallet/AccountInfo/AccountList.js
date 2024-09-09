import { ethers } from 'ethers';
import { usePassword } from '../../../Context';
import { getBalance } from '../../../util/walletUtils';
import { useEffect, useState } from 'react';
import { Modal, Button } from 'antd';
import { decryptData } from '../../../util/securityUtils';
import { hdkey } from 'ethereumjs-wallet';

function AccountList(props) {
  const { password } = usePassword();
  const [accountList, setAccountList] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const getAccountsInfo = async () => {
    const infos = JSON.parse(localStorage.getItem('keyFiles'));
    props.setCurrentAccount(infos[0]);
    setAccountList(infos);
  };
  useEffect(() => {
    getAccountsInfo();
  }, []);

  const selectAccount = i => {
    props.setCurrentAccount(i);
    setIsModalOpen(false);
  };

  const addAccount = async () => {
    let currentIndex = localStorage.getItem('currentIndex');

    const encrySeed = localStorage.getItem('encryptSeed');
    const seed = decryptData(encrySeed, password);
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
    currentIndex++;
    localStorage.setItem('currentIndex', currentIndex);
    localStorage.setItem('keyFiles', JSON.stringify(accountList));
    setAccountList(accountList);
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
        <Button onClick={addAccount}>添加新账户</Button>
      </Modal>
      <a className="cursor-pointer text-blue-500" onClick={() => setIsModalOpen(true)}>
        +
      </a>
    </div>
  );
}

export default AccountList;

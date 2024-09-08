import { ethers } from 'ethers';
import { usePassword } from '../../../Context';
import { provider } from '../../../util/walletUtils';
import { useEffect, useState } from 'react';
import { Modal, Button } from 'antd';

function AccountList(props) {
  const { password } = usePassword();
  const [accountList, setAccountList] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const getAccountsInfo = async () => {
    const allAccount = JSON.parse(localStorage.getItem('keyFiles'));
    const infos = [];
    for (let i = 0; i < allAccount.length; i++) {
      const wallet = await ethers.Wallet.fromEncryptedJson(allAccount[i], password);
      const balance = await provider.getBalance(wallet.address);
      infos.push({
        address: wallet.address,
        balance: ethers.formatEther(balance),
        name: `Account ${i + 1}`,
      });
    }
    props.setCurrentAccount(infos[0]);
    setAccountList(infos);
    console.log(infos);
  };
  useEffect(() => {
    getAccountsInfo();
  }, []);

  const selectAccount = i => {
    props.setCurrentAccount(i);
    setIsModalOpen(false);
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
      </Modal>
      <a className="cursor-pointer text-blue-500" onClick={() => setIsModalOpen(true)}>
        +
      </a>
    </div>
  );
}

export default AccountList;

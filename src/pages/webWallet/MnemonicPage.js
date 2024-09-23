import { message } from 'antd';
import React, { useState } from 'react';
import { hdkey } from 'ethereumjs-wallet';
import { ethers } from 'ethers';
import { encryptData } from '../../util/securityUtils';
import { provider } from '../../util/walletUtils';
import useStore, { usePassword, useSeed } from '../../store';
import { useNavigate } from 'react-router-dom';

const bip39 = require('bip39');

function MnemonicPage() {
  const [mnemonic, setMnemonic] = useState('');
  const [password, setPassword] = useState('');
  const { setCurrentAccount, increaseCurrentIndex, initStoreState, addAccountList } = useStore();
  const { setEncryptSeed } = useSeed();
  const passwordStore = usePassword();
  const navigate = useNavigate();

  const handleMnemonicChange = e => {
    setMnemonic(e.target.value);
  };

  const handlePasswordChange = e => {
    setPassword(e.target.value);
  };
  const handleSubmit = async () => {
    if (mnemonic.trim().split(' ').length !== 12) {
      message.info('请输入12个助记词');
      return;
    }

    if (!password) {
      message.info('请输入密码');
      return;
    }
    initStoreState();

    const seed = await bip39.mnemonicToSeed(mnemonic, password);
    const hdWallet = hdkey.fromMasterSeed(seed).derivePath(`m/44'/60'/0'/0/0`);
    const privateKey = hdWallet._hdkey.privateKey.toString('hex');

    const account = new ethers.Wallet(privateKey);
    const keyFile = await account.encrypt(password);
    const balance = await provider.getBalance(account.address);
    const accountInfo = {
      address: account.address,
      balance: ethers.formatEther(balance),
      name: `Account1`,
      jsonStore: keyFile,
    };
    setCurrentAccount(accountInfo);
    addAccountList(accountInfo);
    setEncryptSeed(encryptData(seed.toString('hex'), password));
    passwordStore.setPassword(password);
    increaseCurrentIndex();

    navigate('/wallet/info');
    message.success('login success!');

    // 这里添加验证助记词、密码和登录逻辑
    console.log('登录成功:', mnemonic, password);
    // 登录成功后的操作,比如跳转到钱包主页
  };

  return (
    <div className="max-w-md w-full space-y-8 bg-gray-800 p-10 rounded-xl shadow-2xl">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">助记词登录</h2>
      </div>
      <form className="mt-8 space-y-6" onSubmit={e => e.preventDefault()}>
        <div>
          <label htmlFor="mnemonic" className="block text-sm font-medium text-gray-300">
            助记词
          </label>
          <div className="mt-1">
            <textarea
              id="mnemonic"
              name="mnemonic"
              rows="4"
              className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 bg-gray-700 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="请输入您的12个助记词,用空格分隔"
              value={mnemonic}
              onChange={handleMnemonicChange}
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300">
            密码
          </label>
          <div className="mt-1">
            <input
              id="password"
              name="password"
              type="password"
              className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 bg-gray-700 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="请输入您的密码"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={handleSubmit}
          >
            登录
          </button>
        </div>
      </form>
    </div>
  );
}

export default MnemonicPage;

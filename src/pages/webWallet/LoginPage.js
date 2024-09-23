import { Button, Input, message, Spin } from 'antd';
import { useState } from 'react';
import * as ethers from 'ethers';
import { encryptData } from '../../util/securityUtils';
import { provider } from '../../util/walletUtils';
import useStore, { usePassword, useSeed } from '../../store';
import { useNavigate } from 'react-router-dom';

const bip39 = require('bip39');
const { hdkey } = require('ethereumjs-wallet');

function Generate() {
  const [show, setShow] = useState(false);
  const [value, setValue] = useState('');
  const [mnemonic, setMnemonic] = useState();
  const [loading, setLoading] = useState(false);
  const { setCurrentAccount, increaseCurrentIndex, initStoreState, accountList, addAccountList } =
    useStore();
  const { setEncryptSeed } = useSeed();
  const { setPassword } = usePassword();
  const navigate = useNavigate();
  const generate = async () => {
    initStoreState();
    setLoading(true);
    try {
      // 生成助记词 ((128 + 4) / 11 => 助记词)
      const mnemonic = bip39.generateMnemonic();
      setMnemonic(mnemonic);
      // console.log('mnemonic', mnemonic);
      // 生成种子 (助记词和盐+密码 => 进行KDF拉伸(HMAC-SHA512) 2048次 => 512位的值 seed)
      const seed = await bip39.mnemonicToSeed(mnemonic, value);

      // 生成钱包 (seed传入HMAC-SHA512函数 => {左边256位为主私钥(主公钥可以通过主私钥生成)，右边256位为主链码} => （主私钥/主公钥 主链码 索引) 传入HMAC-SHA512 => 生成子私钥，子链码 )
      const HDKeyWallet = hdkey.fromMasterSeed(seed).derivePath(`m/44'/60'/0'/0/0`);
      console.log('what is HDKeyWallet', HDKeyWallet);
      const privateKey = HDKeyWallet._hdkey.privateKey.toString('hex');
      console.log('privateKey', privateKey);
      const account = new ethers.Wallet(privateKey);
      const keyFile = await account.encrypt(value);
      const balance = await provider.getBalance(account.address);
      const accountInfo = {
        address: account.address,
        balance: ethers.formatEther(balance),
        name: `Account1`,
        jsonStore: keyFile,
      };
      setCurrentAccount(accountInfo);
      addAccountList(accountInfo);
      setEncryptSeed(encryptData(seed.toString('hex'), value));
      setPassword(value);
      increaseCurrentIndex();

      message.success('generate wallet success!');
      // onNext(2);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  // 登陆
  const login = async () => {
    const keyFile = accountList[0];
    try {
      await ethers.Wallet.fromEncryptedJson(keyFile.jsonStore, value);
      setPassword(value);
      // onNext(2);
      navigate('/wallet/info');
    } catch (error) {
      console.log(error);
      message.error('密码错误!');
    }
  };

  const loginWithMnenoic = async () => {
    navigate('/wallet/loginWithMnemonic');
  };
  return (
    <div className="w-1/3 mx-auto p-6 bg-gray-900 rounded-xl shadow-2xl text-white text-center">
      <Input.Password
        placeholder="请输入密码"
        className="mt-4"
        value={value}
        onChange={e => setValue(e.target.value)}
        visibilityToggle={{
          visible: show,
          onVisibleChange: setShow,
        }}
      />
      {accountList.length ? (
        !mnemonic && (
          <Button className="mt-4" onClick={login}>
            登陆
          </Button>
        )
      ) : (
        <Button className="mt-4" onClick={generate} disabled={loading}>
          {loading ? <Spin /> : '生成钱包账户'}
        </Button>
      )}
      {mnemonic && (
        <div>
          <h3>请牢记您的助记词和密码（请安全保存，不要分享给他人）：</h3>
          <p>{mnemonic}</p>
          <Button
            onClick={() => {
              setMnemonic('');
              navigate('/wallet/info');
            }}
          >
            我已安全保存助记词
          </Button>
        </div>
      )}
      {!mnemonic && (
        <p className="mt-4">
          <span
            className="text-gray-400 cursor-pointer hover:text-gray-100 underline"
            onClick={loginWithMnenoic}
          >
            助记词登陆
          </span>
        </p>
      )}
    </div>
  );
}

export default Generate;

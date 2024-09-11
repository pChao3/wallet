import { Button, Input, message, Spin } from 'antd';
import { useState } from 'react';
import * as ethers from 'ethers';
import { encryptData } from '../../util/securityUtils';
import { provider } from '../../util/walletUtils';
import useStore, { usePassword, useSeed } from '../../store';

const bip39 = require('bip39');
const { hdkey } = require('ethereumjs-wallet');

function Generate({ onNext }) {
  const [show, setShow] = useState(false);
  const [value, setValue] = useState('');
  const [mnemonic, setMnemonic] = useState();
  const [loading, setLoading] = useState(false);
  const { setCurrentAccount, increaseCurrentIndex, initStoreState } = useStore();
  const { setEncryptSeed } = useSeed();
  const { setPassword } = usePassword();
  const generate = async () => {
    initStoreState();
    setLoading(true);
    try {
      // 生成助记词 (128 + 4 / 11 => 助记词)
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
        name: `Account0`,
        jsonStore: keyFile,
      };
      setCurrentAccount(accountInfo);
      localStorage.setItem('keyFiles', JSON.stringify([accountInfo]));

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
    const keyFile = getAccounts()[0];
    try {
      await ethers.Wallet.fromEncryptedJson(keyFile.jsonStore, value);
      setPassword(value);
      onNext(2);
    } catch (error) {
      console.log(error);
      message.error('密码错误!');
    }
  };

  const getAccounts = () => {
    return JSON.parse(localStorage.getItem('keyFiles'));
  };
  return (
    <div className="w-1/2 m-auto">
      <Input.Password
        placeholder="请输入密码"
        value={value}
        onChange={e => setValue(e.target.value)}
        visibilityToggle={{
          visible: show,
          onVisibleChange: setShow,
        }}
      />
      {getAccounts()?.length ? (
        <Button onClick={login}>登陆</Button>
      ) : (
        <Button onClick={generate} disabled={loading}>
          {loading ? <Spin /> : '生成钱包账户'}
        </Button>
      )}
      {mnemonic && (
        <div>
          <h3>您的助记词（请安全保存，不要分享给他人）：</h3>
          <p>{mnemonic}</p>
          <Button
            onClick={() => {
              setMnemonic('');
              onNext(2);
            }}
          >
            我已安全保存助记词
          </Button>
        </div>
      )}
    </div>
  );
}

export default Generate;

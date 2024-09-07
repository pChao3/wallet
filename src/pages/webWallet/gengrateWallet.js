import { Button, Input, message } from 'antd';
import { useState } from 'react';
import * as ethers from 'ethers';
import { usePassword } from '../../Context';
const bip39 = require('bip39');
const { hdkey } = require('ethereumjs-wallet');

const path = "m/44'/60'/0'/0/0";
function Generate({ onNext }) {
  const [show, setShow] = useState(false);
  const [value, setValue] = useState();
  const { setPassword } = usePassword();
  const generate = async () => {
    // 生成助记词 (128 + 4 / 11 => 助记词)
    const mnemonic = bip39.generateMnemonic();
    // 生成种子 (助记词和盐+密码 => 进行KDF拉伸(HMAC-SHA512) 2048次 => 512位的值 seed)
    const seed = await bip39.mnemonicToSeed(mnemonic, value);
    // 生成钱包 (seed传入HMAC-SHA512函数 => {左边256位为主私钥(主公钥可以通过主私钥生成)，右边256位为主链码} => （主私钥/主公钥 主链码 索引) 传入HMAC-SHA512 => 生成子私钥，子链码 )
    const HDKeyWallet = hdkey.fromMasterSeed(seed).derivePath(path);
    console.log('what is HDKeyWallet', HDKeyWallet);
    const privateKey = HDKeyWallet._hdkey.privateKey.toString('hex');
    console.log('privateKey', privateKey);
    const account = new ethers.Wallet(privateKey);
    const keyFile = await account.encrypt(value);

    localStorage.setItem('keyFile', keyFile);
    setPassword(value);
    message.success('generate wallet success!');
    onNext(2);
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
      <Button onClick={generate}>生成钱包账户</Button>
    </div>
  );
}

export default Generate;

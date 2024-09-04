import { Button, Input } from 'antd';
import { useState } from 'react';
import * as ethers from 'ethers';
const bip39 = require('bip39');
const { hdkey } = require('ethereumjs-wallet');

const path = "m/44'/60'/0'/0/0";
function Generate() {
  const [show, setShow] = useState(false);
  const [value, setValue] = useState();
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
    console.log('account', account);
    window.account = account;
  };

  return (
    <div className="w-1/2 m-auto">
      <Input.Password
        placeholder="login password"
        value={value}
        onChange={e => setValue(e.target.value)}
        visibilityToggle={{
          visible: show,
          onVisibleChange: setShow,
        }}
      />
      <Button onClick={generate}>Generate HDKeyWallet Account</Button>
    </div>
  );
}

export default Generate;

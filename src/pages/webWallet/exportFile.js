import { Button, Input } from 'antd';
import { ethers } from 'ethers';
import { useState } from 'react';
import { usePassword } from '../../Context';
function Generate() {
  const [show, setShow] = useState(false);
  const [value, setValue] = useState('');
  const { password } = usePassword();

  const exportKeyStore = async () => {
    const keyfile = localStorage.getItem('keyFile');
    const wallet = await ethers.Wallet.fromEncryptedJson(keyfile, password);

    const keyJson = await wallet.encrypt(value);
    const blob = new Blob([keyJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'keyStore.json';
    a.click();
    console.log(keyJson);
  };
  return (
    <div className="w-1/2 m-auto">
      <Input.Password
        placeholder="file password"
        value={value}
        onChange={e => setValue(e.target.value)}
        visibilityToggle={{
          visible: show,
          onVisibleChange: setShow,
        }}
      />
      <Button onClick={exportKeyStore}>export keyStore file</Button>
    </div>
  );
}

export default Generate;

import { Button, Input } from 'antd';
import { useState } from 'react';
function Generate() {
  const [show, setShow] = useState(false);
  const [value, setValue] = useState();

  const exportKeyStore = async () => {
    const keyJson = await window.account.encrypt('aaa');
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

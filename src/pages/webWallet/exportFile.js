import { Button } from 'antd';

function Generate() {
  const exportKeyStore = async () => {
    const keyJson = localStorage.getItem('keyFile');
    const blob = new Blob([keyJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'keyStore.json';
    a.click();
  };
  return (
    <div className="w-1/2 m-auto">
      <Button onClick={exportKeyStore}>export keyStore file</Button>
    </div>
  );
}

export default Generate;

import { Button, Input, message, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import * as ethers from 'ethers';
import useStore, { usePassword } from '../../store';
import { provider } from '../../util/walletUtils';
function ImportJsonFile({ onClose }) {
  const [value, setValue] = useState('');
  const [fileList, setFileList] = useState();

  const { password } = usePassword();
  const { currentIndex, increaseCurrentIndex } = useStore();

  const [loading, setLoading] = useState(false);

  const fileChange = ({ fileList }) => {
    setFileList(fileList);
  };
  const uploadBefore = file => {
    return false;
  };

  const importJson = async () => {
    setLoading(true);
    const reader = new FileReader();
    reader.onload = async function (e) {
      try {
        const wallet = await ethers.Wallet.fromEncryptedJson(e.target.result, value);
        const keyFile = await wallet.encrypt(password);
        const balance = await provider.getBalance(wallet.address);
        const accounts = JSON.parse(localStorage.getItem('keyFiles'));
        const accountInfo = {
          address: wallet.address,
          balance: ethers.formatEther(balance),
          jsonStore: keyFile,
          name: `Account${currentIndex}`,
          tag: 'imported',
        };
        increaseCurrentIndex();
        accounts.push(accountInfo);
        localStorage.setItem('keyFiles', JSON.stringify(accounts));
        message.success('导入成功！');
        setLoading(false);
        onClose(2);

        // todo: router or other things!
      } catch (error) {
        if (error instanceof TypeError && error.message.includes('incorrect password')) {
          message.error('文件密码错误!');
          // 在这里可以处理密码错误的情况，例如提示用户重新输入密码
        } else {
          console.error('其他错误:', error);
          // 处理其他类型的错误
        }
        setLoading(false);
      }
    };
    reader.onerror = function () {
      console.error('文件读取失败:', reader.error);
    };
    reader.readAsText(fileList[0].originFileObj); // 读取文件内容为文本
  };
  return (
    <div className="text-center m-auto">
      <Upload
        action={''}
        accept=".json"
        maxCount={1}
        onChange={fileChange}
        fileList={fileList}
        beforeUpload={uploadBefore}
        className="flex justify-center"
      >
        <Button icon={<PlusOutlined />}>导入keyStore文件</Button>
      </Upload>
      <Input
        placeholder="验证密码"
        className="w-1/3"
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      <Button onClick={importJson} loading={loading}>
        导入
      </Button>
    </div>
  );
}

export default ImportJsonFile;

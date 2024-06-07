import { useState } from 'react';
import { Segmented } from 'antd';
import Deposit from './Deposit';
import Withdraw from './Withdraw';
import './index.css';

const options = [
  {
    label: 'deposit',
    value: 1,
  },
  {
    label: 'withDraw',
    value: 2,
  },
];
function Wallet() {
  const [radio, setRadio] = useState(1);
  return (
    <div className="wallet-wrap">
      <div className="content">
        <Segmented options={options} onChange={value => setRadio(value)} />
        <div className="input-wrap">{radio === 1 ? <Deposit /> : <Withdraw />}</div>
      </div>
    </div>
  );
}

export default Wallet;

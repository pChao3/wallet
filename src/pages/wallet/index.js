import { useState } from 'react';
import './index.css';
import { Input, Segmented, Button } from 'antd';
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
  const [depositValue, setDepositValie] = useState(0);
  const [withDrawValue, setWithDrawValue] = useState(0);

  const deposit = () => {
    console.log(depositValue);

    // transfer
  };

  const withDraw = () => {
    console.log(withDrawValue);

    // transfer
  };

  return (
    <div className="wallet-wrap">
      <div className="content">
        <Segmented options={options} onChange={value => setRadio(value)} />
        <div className="input-wrap">
          {radio === 1 ? (
            <div>
              <span>Amount:{}</span>
              <Input onChange={e => setDepositValie(e.target.value)} />
              <Button type="primary" block onClick={deposit}>
                Deposit
              </Button>
            </div>
          ) : (
            <div>
              <span>Amount:{}</span>
              <Input onChange={e => setWithDrawValue(e.target.value)} />
              <Button type="primary" block onClick={withDraw}>
                WithDraw
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Wallet;

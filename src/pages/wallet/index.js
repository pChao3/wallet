import { useState } from 'react';
import './index.css';
import { Radio, Input, Tabs, Segmented, Button } from 'antd';
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
  const radioChange = ({ target: { value } }) => {
    setRadio(value);
  };
  return (
    <div className="wallet-wrap">
      <div className="content">
        {/* <Radio.Group
          options={options}
          onChange={radioChange}
          value={radio}
          optionType="button"
          buttonStyle="solid"
        />
        <Input placeholder="Basic usage" /> */}
        <Segmented options={options} onChange={value => setRadio(value)} />
        <div className="input-wrap">
          {radio === 1 ? (
            <div>
              <Input />
              <Button type="primary" block>
                Deposit
              </Button>
            </div>
          ) : (
            <div>
              <Input />
              <Button type="primary" block>
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

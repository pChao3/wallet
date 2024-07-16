import { useState } from 'react';
import { Radio } from 'antd';
import './index.css';

import Market from './market.js';
import Personal from './personal.js';
const options = [
  {
    label: '个人中心',
    value: 1,
  },
  {
    label: 'NFT-市场',
    value: 2,
  },
];

function Index() {
  const [value, setValue] = useState(1);
  return (
    <div className="text-center">
      <Radio.Group
        options={options}
        onChange={k => setValue(k.target.value)}
        value={value}
        optionType="button"
        buttonStyle="solid"
      />
      <div>{value === 1 ? <Personal /> : <Market />}</div>
    </div>
  );
}

export default Index;

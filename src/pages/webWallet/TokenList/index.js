import { AirToken, WaterToken } from '../../addressConfig';
import tokenABI from '../../../contract/Token.json';
import Item from './Item';
const tokenlist = [
  {
    address: AirToken,
    abi: tokenABI.abi,
  },
  {
    address: WaterToken,
    abi: tokenABI.abi,
  },
];

function Index() {
  return (
    <div>
      <ul>
        {tokenlist.map(i => {
          return <Item info={i} key={i.address} />;
        })}
      </ul>
    </div>
  );
}

export default Index;

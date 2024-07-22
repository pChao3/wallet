import { NFTAddress, MarketAddress, AirToken } from '../addressConfig';

import NFTABI from '../../contract/NFT_ABI.json';
import MARKETABI from '../../contract/Market_ABI.json';
import AIRABI from '../../contract/Token.json';

export const nftContract = {
  abi: NFTABI.abi,
  address: NFTAddress,
};
export const marketContract = {
  abi: MARKETABI.abi,
  address: MarketAddress,
};
export const AirContract = {
  abi: AIRABI.abi,
  address: AirToken,
};

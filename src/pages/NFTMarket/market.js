import { useEffect, useCallback, useState } from 'react';

import {
  useWriteContract,
  useReadContracts,
  useReadContract,
  useAccount,
  useWaitForTransactionReceipt,
} from 'wagmi';
import MarketItem from './MarketItem';

import { NFTAddress, MarketAddress, AirToken } from '../addressConfig';
import { nftContract, marketContract, AirContract } from './config';

function Index() {
  const { address } = useAccount();
  // 当前有多少ERC20代币
  const { data, refetch } = useReadContract({
    ...AirContract,
    functionName: 'balanceOf',
    args: [address],
  });

  // 市场合约信息
  const { data: nftCount, refetch: refetchNFT } = useReadContracts({
    contracts: [
      {
        ...nftContract,
        functionName: 'balanceOf',
        args: [MarketAddress],
      },
      {
        ...nftContract,
        functionName: 'getMyTokenIds',
        args: [MarketAddress],
      },
      {
        ...nftContract,
        functionName: 'name',
      },
      {
        ...nftContract,
        functionName: 'symbol',
      },
    ],
  });

  const refetchStatus = () => {
    console.log('did');
    refetchNFT();
  };
  return (
    <div className="container mx-auto p-6 bg-gray-300 rounded-2xl">
      <p>you have {data?.toString()} $Air</p>
      <p>NFT-Market already have {nftCount && nftCount[0]?.result?.toString()} NFTs </p>
      {nftCount && nftCount[1]?.result?.length ? (
        <div className="grid grid-cols-3 gap-4">
          {nftCount[1].result.map(i => {
            return <MarketItem tokenId={Number(i)} refetchNFT={refetchStatus} key={i} />;
          })}
        </div>
      ) : (
        <h1>'暂无实据'</h1>
      )}
    </div>
  );
}

export default Index;

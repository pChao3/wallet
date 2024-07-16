import { useEffect, useCallback, useState } from 'react';

import {
  useWriteContract,
  useReadContracts,
  useReadContract,
  useAccount,
  useWaitForTransactionReceipt,
} from 'wagmi';

import { NFTAddress, MarketAddress, AirToken } from '../addressConfig';
import NFTABI from '../../contract/NFT_ABI.json';
import MARKETABI from '../../contract/Market_ABI.json';
import AIRABI from '../../contract/Token.json';

const nftContract = {
  abi: NFTABI.abi,
  address: NFTAddress,
};
const marketContract = {
  abi: MARKETABI.abi,
  address: MarketAddress,
};
const AirContract = {
  abi: AIRABI.abi,
  address: AirToken,
};

function Index() {
  const [tokenId, setTokenId] = useState('');
  const [price, setPrice] = useState('');
  const { writeContractAsync: buyNFTFunc, data: buyNFTTxHash } = useWriteContract();
  const { writeContractAsync: downNFT, data: downNFTTxHash } = useWriteContract();

  const { writeContractAsync: approveERC20Token, data: approveTxHash } = useWriteContract();

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
        functionName: 'name',
      },
      {
        ...nftContract,
        functionName: 'symbol',
      },
    ],
  });
  const buyNFTReceipt = useWaitForTransactionReceipt({ hash: buyNFTTxHash }); //购买
  if (buyNFTReceipt.isSuccess) {
    refetchNFT();
    refetch();
  }

  // 购买
  // 先授权ERC20代币给市场合约
  const buyNFT = (price = 1000) => {
    approveERC20Token({
      ...AirContract,
      functionName: 'approve',
      args: [MarketAddress, price],
    });
  };

  const approveReceipt = useWaitForTransactionReceipt({ hash: approveTxHash });
  useEffect(() => {
    if (approveReceipt.isSuccess) {
      buyNFTFunc({
        ...marketContract,
        functionName: 'buy',
        args: [NFTAddress, tokenId, AirToken],
      });
    }
  }, [approveReceipt.isSuccess]);

  // 下架
  const down = () => {
    downNFT({
      ...marketContract,
      functionName: 'down',
      args: [NFTAddress, tokenId],
    })
      .then(res => {
        console.log('res', res);
      })
      .catch(error => {
        console.log('error', error);
      });
  };

  const downNFTReceipt = useWaitForTransactionReceipt({ hash: downNFTTxHash }); //上架
  if (downNFTReceipt.isSuccess) {
    refetch();
  }

  return (
    <div className="container mx-auto p-6 bg-gray-300">
      <p>you have {data?.toString()} $Air</p>
      <p>NFT-Market already have {nftCount && nftCount[0]?.result?.toString()} NFTs </p>
      <div className="grid grid-cols-4 gap-4">
        <div className="w-full h-48 text-center bg-sky-200 ">
          <div className="sm:col-span-3">
            <label htmlFor="tokenId" className=" text-sm font-medium leading-6 text-gray-900">
              tokenId
            </label>
            <input
              type="text"
              name="tokenId"
              id="tokenId"
              value={tokenId}
              onChange={e => setTokenId(e.target.value)}
              className=" rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
          <div className="sm:col-span-3">
            <label htmlFor="price" className=" text-sm font-medium leading-6 text-gray-900">
              price
            </label>
            <input
              type="text"
              name="price"
              id="price"
              value={price}
              onChange={e => setPrice(e.target.value)}
              className="  rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
          <button
            onClick={() => down()}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            下架
          </button>
          <button
            onClick={() => buyNFT()}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            购买
          </button>
        </div>
        <div className="w-full h-48 text-center bg-sky-200 "></div>
        {/* <div className="w-full h-48 text-center bg-sky-200 ">1</div>
        <div className="w-full h-48 text-center bg-sky-200 ">1</div>
        <div className="w-full h-48 text-center bg-sky-200 ">1</div>
        <div className="w-full h-48 text-center bg-sky-200 ">1</div>
        <div className="w-full h-48 text-center bg-sky-200 ">1</div>
        <div className="w-full h-48 text-center bg-sky-200 ">1</div>
        <div className="w-full h-48 text-center bg-sky-200 ">1</div> */}
      </div>
    </div>
  );
}

export default Index;

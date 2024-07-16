import { useEffect, useCallback, useState } from 'react';

import {
  useWriteContract,
  useReadContracts,
  useReadContract,
  useAccount,
  useWaitForTransactionReceipt,
} from 'wagmi';

import { NFTAddress, MarketAddress } from '../addressConfig';
import NFTABI from '../../contract/NFT_ABI.json';
import MARKETABI from '../../contract/Market_ABI.json';

const nftContract = {
  abi: NFTABI.abi,
  address: NFTAddress,
};
const marketContract = {
  abi: MARKETABI.abi,
  address: MarketAddress,
};
function Index() {
  const [tokenId, setTokenId] = useState('');
  const [price, setPrice] = useState('');
  const { writeContractAsync: mint, data: mintTxHash } = useWriteContract();
  const { writeContractAsync: listNFT, data: listNFTTxHash } = useWriteContract();
  const { writeContractAsync: approveNFT, data: approveTxHash } = useWriteContract();

  const { address } = useAccount();

  const { data, refetch } = useReadContracts({
    contracts: [
      {
        ...nftContract,
        functionName: 'balanceOf',
        args: [address],
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

  // mint NFT
  const mintNFT = () => {
    mint({
      ...nftContract,
      functionName: 'createNFT',
    })
      .then(hash => {
        console.log('hash', hash);
      })
      .catch(error => {
        console.log(error);
      });
  };

  // 上架 市场合约
  // 先授权
  const list = async () => {
    approveNFT({
      ...nftContract,
      functionName: 'approve',
      args: [MarketAddress, tokenId],
    });
  };

  const approveReceipt = useWaitForTransactionReceipt({ hash: approveTxHash });
  useEffect(() => {
    if (approveReceipt.isSuccess) {
      listNFT({
        ...marketContract,
        functionName: 'list',
        args: [NFTAddress, tokenId, price],
      });
    }
  }, [approveReceipt.isSuccess]);

  const mintReceipt = useWaitForTransactionReceipt({ hash: mintTxHash }); // 铸造
  const listNFTReceipt = useWaitForTransactionReceipt({ hash: listNFTTxHash }); //上架

  if (mintReceipt.isSuccess || listNFTReceipt.isSuccess) {
    refetch();
  }

  return (
    <div className="container mx-auto p-6 bg-gray-300">
      <div className="text-center mb-5 bg-sky-300">
        <button className="flex-1 border" onClick={() => mintNFT()}>
          mint NFT
        </button>
        <p className="flex-1">您已拥有{data && data[0]?.result?.toString()}个该系列的NFT</p>
      </div>
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
            onClick={list}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            上架
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

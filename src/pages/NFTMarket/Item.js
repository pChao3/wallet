import { useEffect, useCallback, useState } from 'react';

import { useWriteContract, useAccount, useWaitForTransactionReceipt } from 'wagmi';

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

function Item({ tokenId, refetchStatus }) {
  const [price, setPrice] = useState('');

  const { address } = useAccount();
  const { writeContractAsync: listNFT, data: listNFTTxHash } = useWriteContract();
  const { writeContractAsync: approveNFT, data: approveTxHash } = useWriteContract();

  const { writeContractAsync: transferNFT, data: transferTxHash } = useWriteContract();

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
      }).then(() => {
        transferNFT({
          ...NFTAddress,
          functionName: 'transfer',
          args: [address, NFTAddress, tokenId],
        });
      });
    }
  }, [approveReceipt.isSuccess]);

  const transferNFTReceipt = useWaitForTransactionReceipt({ hash: transferTxHash }); //上架

  if (transferNFTReceipt.isSuccess) {
    refetchStatus();
  }
  return (
    <div>
      <div className="w-full h-48 text-center flex flex-col bg-sky-200 p-4">
        <div className="flex-1 mb-2">tokenId:{Number(tokenId)}</div>
        <div className="grid grid-cols-3">
          <div className="col-span-2">
            <label>price:</label>
            <input value={price} onChange={e => setPrice(e.target.value)} />
          </div>
          <button onClick={list}>上架</button>
        </div>
      </div>
    </div>
  );
}

export default Item;

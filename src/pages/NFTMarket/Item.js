import { useEffect, useCallback, useState } from 'react';

import { useWriteContract, useAccount, useWaitForTransactionReceipt } from 'wagmi';

import { NFTAddress, MarketAddress } from '../addressConfig';
import { nftContract, marketContract } from './config';
function Item({ tokenId, refetchStatus }) {
  const [price, setPrice] = useState('');

  const { address } = useAccount();
  const { writeContractAsync: listNFT, data: listNFTTxHash } = useWriteContract();
  const { writeContractAsync: approveNFT, data: approveTxHash } = useWriteContract();

  const { writeContractAsync: transferNFT, data: transferTxHash } = useWriteContract();

  // 上架流程1.2.3
  // 1.先授权
  const list = async () => {
    approveNFT({
      ...nftContract,
      functionName: 'approve',
      args: [MarketAddress, tokenId],
    });
  };
  // 2.上架NFT
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

  // 3.更新状态
  const listNFTReceipt = useWaitForTransactionReceipt({ hash: listNFTTxHash });
  useEffect(() => {
    if (listNFTReceipt.isSuccess) {
      transferNFT({
        ...nftContract,
        functionName: 'transfer1',
        args: [address, MarketAddress, tokenId],
      });
    }
  }, [listNFTReceipt.isSuccess]);

  const transferNFTReceipt = useWaitForTransactionReceipt({ hash: transferTxHash });

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

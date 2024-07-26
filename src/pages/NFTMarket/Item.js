import { useEffect, useCallback, useState } from 'react';

import { useWriteContract, useAccount, useWaitForTransactionReceipt, useReadContract } from 'wagmi';

import { NFTAddress, MarketAddress } from '../addressConfig';
import { nftContract, marketContract } from './config';
function Item({ tokenId, refetchStatus }) {
  const [price, setPrice] = useState('');
  const [imageURL, setImageIRL] = useState('');

  const { address } = useAccount();
  const { writeContractAsync: listNFT, data: listNFTTxHash } = useWriteContract();
  const { writeContractAsync: approveNFT, data: approveTxHash } = useWriteContract();

  const { writeContractAsync: transferNFT, data: transferTxHash } = useWriteContract();

  // 获取uri
  const uriInfo = useReadContract({
    ...nftContract,
    functionName: 'tokenURI',
    args: [tokenId],
  });
  useEffect(() => {
    if (uriInfo.data) {
      fetch(uriInfo.data)
        .then(response => {
          return response.json();
        })
        .then(res => {
          const hash = res.image.split('//')[1];
          setImageIRL(`https://ipfs.io/ipfs/${hash}`);
        });
    }
  }, [uriInfo.data]);

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
      <div className="card group">
        <img src={imageURL} className="w-full h-full"></img>
        <div className="absolute">#{Number(tokenId)}</div>

        <div className="bottom-input grid ">
          <label className="col-span-1 ">price: </label>
          <input
            className="rounded-md col-span-2 indent-1.5"
            value={price}
            onChange={e => setPrice(e.target.value)}
          />
          <button onClick={list} className="col-span-1 ">
            上架
          </button>
        </div>
      </div>
    </div>
  );
}

export default Item;

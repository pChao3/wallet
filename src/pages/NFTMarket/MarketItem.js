import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { marketContract, nftContract, AirContract } from './config';
import { NFTAddress, MarketAddress, AirToken } from '../addressConfig';
import { useEffect, useMemo } from 'react';

function MarketItem({ tokenId, refetchNFT }) {
  const {} = useReadContract({});
  const { address } = useAccount();

  const { writeContractAsync: downNFTAsync, data: downNFTTxHash } = useWriteContract();
  const { writeContractAsync: buyNFTFunc, data: buyNFTTxHash } = useWriteContract();
  const { writeContractAsync: approveERC20Token, data: approveTxHash } = useWriteContract();
  const { writeContractAsync: transferNFT, data: transferNFTTxHash } = useWriteContract();
  const { data } = useReadContract({
    ...marketContract,
    functionName: 'nftList',
    args: [NFTAddress, tokenId],
  });

  const downNFT = async () => {
    await downNFTAsync({
      ...marketContract,
      functionName: 'down',
      args: [NFTAddress, tokenId],
    });
  };

  const { isSuccess } = useWaitForTransactionReceipt({ hash: downNFTTxHash });
  useEffect(() => {
    if (isSuccess) {
      console.log('success!!!');
      transferNFT({
        ...nftContract,
        functionName: 'transfer1',
        args: [MarketAddress, address, tokenId],
      });
    }
  }, [isSuccess]);

  const transferNFTReceipt = useWaitForTransactionReceipt({ hash: transferNFTTxHash });
  if (transferNFTReceipt.isSuccess) {
    refetchNFT();
  }

  // 购买流程 1.2.3
  //1.erc20授权
  const buyNFT = () => {
    approveERC20Token({
      ...AirContract,
      functionName: 'approve',
      args: [MarketAddress, data[0]],
    });
  };

  //2.购买
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

  // 2.更新合约状态
  const buyNFTReceipt = useWaitForTransactionReceipt({ hash: buyNFTTxHash });
  useEffect(() => {
    if (buyNFTReceipt.isSuccess) {
      transferNFT({
        ...nftContract,
        functionName: 'transfer1',
        args: [MarketAddress, address, tokenId],
      });
    }
  }, [buyNFTReceipt.isSuccess]);

  const isOwner = useMemo(() => {
    if (data && data[1]) {
      return address == data[1];
    }
  }, [address, data]);

  return (
    <div className="w-full h-48 text-center bg-sky-200 " key={tokenId}>
      <h1>seller: {data && data[1]}</h1>
      <h1>tokenId: {Number(tokenId)}</h1>
      <h1>price: {data && Number(data[0])}</h1>

      {isOwner ? (
        <button
          onClick={() => downNFT()}
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          下架
        </button>
      ) : (
        <button
          onClick={() => buyNFT(tokenId)}
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          购买
        </button>
      )}
    </div>
  );
}

export default MarketItem;

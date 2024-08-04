import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { marketContract, nftContract, AirContract } from './config';
import { NFTAddress, MarketAddress, AirToken } from '../addressConfig';
import { useEffect, useMemo, useState } from 'react';

function MarketItem({ tokenId, refetchNFT }) {
  const [imageURL, setImageURL] = useState('');
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

  // 获取NFT图像
  const uriInfo = useReadContract({
    ...nftContract,
    functionName: 'tokenURI',
    args: [tokenId],
  });

  useEffect(() => {
    if (uriInfo.data) {
      fetch(uriInfo.data)
        .then(response => response.json())
        .then(res => {
          const hash = res.image.split('//')[1];
          setImageURL(`https://ipfs.io/ipfs/${hash}`);
        });
    }
  }, [uriInfo.data]);

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
    <div className="card" key={tokenId}>
      <img src={imageURL} className="w-full h-full scale-95 hover:scale-100 duration-300" />
      <h1>seller: {data && data[1]}</h1>
      <h1>price: {data && Number(data[0])} $Air</h1>
      <h1># {Number(tokenId)}</h1>

      {isOwner ? (
        <button onClick={() => downNFT()} className="btn">
          下架
        </button>
      ) : (
        <button onClick={() => buyNFT(tokenId)} className="btn">
          购买
        </button>
      )}
    </div>
  );
}

export default MarketItem;

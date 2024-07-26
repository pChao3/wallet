import {
  useWriteContract,
  useReadContracts,
  useAccount,
  useWaitForTransactionReceipt,
} from 'wagmi';

import { nftContract } from './config';
import Item from './Item';

function Index() {
  const { writeContractAsync: mint, data: mintTxHash } = useWriteContract();

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
        functionName: 'getMyTokenIds',
        args: [address],
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

  const refetchStatus = () => {
    console.log('did');
    refetch();
  };

  const mintReceipt = useWaitForTransactionReceipt({ hash: mintTxHash }); // 铸造

  if (mintReceipt.isSuccess) {
    refetch();
  }

  return (
    <div className="container mx-auto p-6 bg-gray-300  rounded-xl">
      <div className="text-center mb-5 bg-sky-300 rounded-md">
        <button className="flex-1  btn" onClick={() => mintNFT()}>
          click to mint
        </button>
        <p className="flex-1">您已拥有{data && data[0]?.result?.toString()}个该系列的NFT</p>
      </div>
      {data && data[1]?.result?.length ? (
        <div className="grid grid-cols-4 gap-4 h-96 overflow-y-scroll">
          {data[1].result.map(i => {
            return <Item tokenId={i} refetchStatus={refetchStatus} key={i} />;
          })}
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default Index;

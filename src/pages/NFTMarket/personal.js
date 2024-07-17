import {
  useWriteContract,
  useReadContracts,
  useAccount,
  useWaitForTransactionReceipt,
} from 'wagmi';

import { NFTAddress } from '../addressConfig';
import NFTABI from '../../contract/NFT_ABI.json';
import Item from './Item';

const nftContract = {
  abi: NFTABI.abi,
  address: NFTAddress,
};

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
  console.log(data);
  return (
    <div className="container mx-auto p-6 bg-gray-300">
      <div className="text-center mb-5 bg-sky-300">
        <button className="flex-1 border" onClick={() => mintNFT()}>
          mint NFT
        </button>
        <p className="flex-1">您已拥有{data && data[0]?.result?.toString()}个该系列的NFT</p>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {data &&
          data[1].result?.length &&
          data[1].result.map(i => {
            return <Item tokenId={i} refetchStatus={refetchStatus} key={i} />;
          })}
      </div>
    </div>
  );
}

export default Index;

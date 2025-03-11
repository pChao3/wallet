import { http, createConfig } from 'wagmi';
import { sepolia, localhost, hardhat } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';
export const config = createConfig({
  chains: [localhost, sepolia, hardhat],
  connectors: [
    injected({
      target: 'metamask',
    }),
  ],
  transports: {
    [sepolia.id]: http('https://sepolia.infura.io/v3/3fc6c894f35a4458839f899be37925af'),
    [hardhat.id]: http('http://127.0.0.1:8545/'),
  },
});

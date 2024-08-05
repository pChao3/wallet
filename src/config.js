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
    [sepolia.id]: http(),
    [hardhat.id]: http('http://127.0.0.1:8545/'),
  },
});

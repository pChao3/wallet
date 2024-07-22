import { http, createConfig } from 'wagmi';
import { sepolia, localhost } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';
export const config = createConfig({
  chains: [localhost, sepolia],
  connectors: [
    injected({
      target: 'metamask',
    }),
  ],
  transports: {
    [sepolia.id]: http(),
    [localhost.id]: http('http://127.0.0.1:8545/'),
  },
});

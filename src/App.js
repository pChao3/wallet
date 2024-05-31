import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { config } from './config.js';
import './App.css';
import WallctComp from './component/components/WalletComp.js';
import Name from './component/components/Name.js';
import Wrap from './Layout.js';
const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {/* <div className="wrap">
          <WallctComp />
          <Name />
        </div> */}
        <Wrap />
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;

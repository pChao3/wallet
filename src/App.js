import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { config } from './config.js';
import './App.css';
import WallctComp from './components/walletComp';
import Name from './components/Name.js';
const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div style={{ margin: 'auto', width: '600px', marginTop: '60px' }}>
          <WallctComp />
          <Name />
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;

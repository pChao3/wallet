import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { config } from './config.js';
import './App.css';

import Header from './component/header/Header';
import { Outlet } from 'react-router-dom';

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Header />
        <div className="layout-content">
          <Outlet />
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;

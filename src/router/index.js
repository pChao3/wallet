import App from '../App'; //正常加载方式
import { Suspense, useEffect } from 'react';
import { createBrowserRouter, useLocation, useNavigate } from 'react-router-dom';
import ContentLayout from '../pages/content/Content'; //name
import LoginPage from '../pages/webWallet/LoginPage';
import MnemonicPage from '../pages/webWallet/MnemonicPage';
import WebWallet from '../pages/webWallet';
import Faucet from '../pages/faucet';
import Transfer from '../pages/transfer'; // transfer
// import Wallet from '../pages/wallet'; // wallet
import NFTMarket from '../pages/NFTMarket/index';

import UnoSwap from '../pages/unoSwap/index';
import { usePassword } from '../store';

export const RouterBeforeEach = ({ children }) => {
  const location = useLocation();
  const navigator = useNavigate();
  const { password } = usePassword();
  useEffect(() => {
    if (!password && location.pathname === '/wallet/info') {
      navigator('/wallet');
    }
  }, [location.pathname, password]);
  return children;
};
const routes = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        name: 'Name',
        element: <ContentLayout />,
      },
      {
        path: 'faucet',
        name: 'Faucet',
        element: <Faucet />,
      },
      {
        path: 'wallet',
        name: 'ETH-Wallet',
        children: [
          { index: true, element: <LoginPage /> },
          {
            path: 'info',
            element: (
              <RouterBeforeEach>
                <WebWallet />
              </RouterBeforeEach>
            ),
          },
          { path: 'loginWithMnemonic', element: <MnemonicPage /> },
        ],
      },

      {
        path: 'transfer',
        name: 'ERC20-Transfer',
        element: <Transfer />,
      },
      {
        path: 'NFTMarket',
        name: 'NFT-Market',
        element: <NFTMarket />,
      },
      {
        path: 'UnoSwap',
        name: 'UnoSwap',
        element: <UnoSwap />,
      },
      //   {
      //     path: 'navigate',
      //     element: <Navigate to="/contacts/123" />, //实现路由重定向，要引入Navigate组件
      //   },
      //   {
      //     path: '*', //当所有路由都不匹配的时候，就会匹配该路径
      //     element: <NoMatch />,
      //   },
    ],
  },
];

export default routes;

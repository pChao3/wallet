import App from '../App'; //正常加载方式
import ContentLayout from '../pages/content/Content'; //name
import Faucet from '../pages/faucet';
import Transfer from '../pages/transfer'; // transfer
import Wallet from '../pages/wallet'; // wallet
import NFTMarket from '../pages/NFTMarket/index';

export default [
  {
    path: '/',
    element: <App />,

    children: [
      {
        index: true,
        element: <ContentLayout />,
      },
      {
        path: 'faucet',
        element: <Faucet />,
      },
      {
        path: 'wallet',
        element: <Wallet />,
      },
      {
        path: 'transfer',
        element: <Transfer />,
      },
      {
        path: 'NFTMarket',
        element: <NFTMarket />,
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

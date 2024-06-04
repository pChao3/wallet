import App from '../App'; //正常加载方式
import ContentLayout from '../pages/content/Content'; //name
import Transfer from '../pages/transfer'; // transfer
import Wallet from '../pages/wallet'; // wallet

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
        path: 'wallet',
        element: <Wallet />,
      },
      {
        path: 'transfer',
        element: <Transfer />,
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

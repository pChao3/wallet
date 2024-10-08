import React, { useEffect, useState } from 'react';
import Connect from '../components/Connect';
import { useAccount, useDisconnect } from 'wagmi';

import './Header.css';
import { Button, Modal } from 'antd';
import { NavLink } from 'react-router-dom';

const navs = [
  {
    name: 'Name',
    url: '/',
  },
  {
    name: 'Faucet',
    url: '/faucet',
  },
  {
    name: 'ERC20-transfer',
    url: '/transfer',
  },
  {
    name: 'ETH-wallet',
    url: '/wallet',
  },
  {
    name: 'NFT-Market',
    url: '/NFTMarket',
  },
  {
    name: 'UnoSwap',
    url: '/UnoSwap',
  },
];

function Header() {
  const [openModal, setOpenModal] = useState(false);
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    if (isConnected) {
      setOpenModal(false);
    }
  }, [isConnected]);

  return (
    <div className="header-wrap">
      <div className="header-logo">web3 Utils</div>
      <Modal
        title="请选择钱包进行连接！"
        open={openModal}
        onCancel={() => setOpenModal(false)}
        footer={null}
      >
        <Connect />
      </Modal>
      <div className="nav-wrap">
        {navs.map(i => {
          return (
            <NavLink
              to={i.url}
              key={i.url}
              className={({ isActive }) => (isActive ? 'activeClassName' : 'normal')}
            >
              {i.name}
            </NavLink>
          );
        })}
      </div>
      <div className="connect-wrap">
        {isConnected ? (
          <Button onClick={disconnect}>disconnect</Button>
        ) : (
          <Button onClick={() => setOpenModal(true)}>connect</Button>
        )}
      </div>
    </div>
  );
}

export default Header;

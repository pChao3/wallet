import React, { useEffect, useState } from 'react';
import WalletComp from '../components/WalletComp';
import { useAccount, useDisconnect } from 'wagmi';

import './Header.css';
import { Button, Modal } from 'antd';
import { NavLink } from 'react-router-dom';

const navs = [
  {
    name: 'name',
    url: '/',
  },
  {
    name: 'transfer',
    url: '/transfer',
  },
  {
    name: 'wallet',
    url: '/wallet',
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
      <Modal
        title="请选择钱包进行连接！"
        open={openModal}
        onCancel={() => setOpenModal(false)}
        footer={null}
      >
        <WalletComp />
      </Modal>
      <div className="nav-wrap">
        {navs.map(i => {
          return (
            <NavLink
              to={i.url}
              key={i.url}
              className={({ isActive }) => (isActive ? 'activeClassName' : '')}
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

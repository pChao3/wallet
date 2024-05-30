import { useState, useEffect } from 'react';
import { useConnect } from 'wagmi';
import '../css/walletItem.css';

function WalletItem(props) {
  const { connector } = props;
  const { connect } = useConnect();
  const handleConnect = () => {
    connect({ connector });
  };

  return (
    <div onClick={handleConnect} className="connect-item-wrap">
      <img src={connector.icon} />
      <span>{connector.name}</span>
    </div>
  );
}

export default WalletItem;

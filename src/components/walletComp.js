import React, { useMemo } from 'react';
import { useConnectors, useAccount, useDisconnect } from 'wagmi';
import WalletItem from './walletItem';
export default () => {
  const connectors = useConnectors();
  const { disconnect } = useDisconnect();
  const account = useAccount();

  const customWallet = useMemo(() => {
    return connectors.filter(i => !i.icon);
  }, [connectors]);

  const userWallet = useMemo(() => {
    return connectors.filter(i => i.icon);
  }, [connectors]);

  const walletList = useMemo(() => {
    return userWallet.length ? userWallet : customWallet;
  }, [customWallet, userWallet]);

  if (account.isConnected) {
    return <button onClick={disconnect}>disconnect</button>;
  }
  return (
    <div>
      {walletList.map(i => {
        return <WalletItem connector={i} key={i.uid} />;
      })}
    </div>
  );
};

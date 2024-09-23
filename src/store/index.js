import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AirToken, WaterToken } from '../pages/addressConfig';
import tokenABI from '../contract/Token.json';
const tokenlist = [
  {
    address: AirToken,
    abi: tokenABI.abi,
  },
  {
    address: WaterToken,
    abi: tokenABI.abi,
  },
];
const useStore = create(
  persist(
    set => ({
      currentIndex: 0,
      currentAccount: {},
      accountList: [],
      tokensInfo: tokenlist,
      setCurrentAccount: currentAccount => set(() => ({ currentAccount: currentAccount })),
      increaseCurrentIndex: () => set(state => ({ currentIndex: state.currentIndex + 1 })),
      addAccountList: account => set(state => ({ accountList: state.accountList.concat(account) })),
      setAccountList: accountList => set(() => ({ accountList: accountList })),
      addTokenInfo: token => set(state => ({ tokensInfo: state.tokensInfo.concat(token) })),
      deleteAccount: address =>
        set(state => {
          return state.accountList.filter(i => i.address !== address);
        }),
      initStoreState: () => set(() => ({ currentIndex: 0, currentAccount: {}, accountList: [] })),
    }),
    {
      name: 'currentAccountInfo',
    }
  )
);

export const useSeed = create(
  persist(
    set => ({
      encryptSeed: '',
      setEncryptSeed: encryptSeed => set(() => ({ encryptSeed: encryptSeed })),
    }),
    {
      name: 'encryptSeed',
    }
  )
);

export const usePassword = create(set => ({
  password: '',
  setPassword: password => set(() => ({ password: password })),
}));

export default useStore;

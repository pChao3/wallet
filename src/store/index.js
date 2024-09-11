import { create } from 'zustand';
import { persist } from 'zustand/middleware';
const useStore = create(
  persist(
    set => ({
      currentIndex: 0,
      currentAccount: {},
      setCurrentAccount: currentAccount => set(() => ({ currentAccount: currentAccount })),
      increaseCurrentIndex: () => set(state => ({ currentIndex: state.currentIndex + 1 })),
      initStoreState: () => set(() => ({ currentIndex: 0, currentAccount: {} })),
    }),
    {
      name: 'currentAccountInfo',
    }
  )
);

export const useSeed = create(set => ({
  encryptSeed: '',
  setEncryptSeed: encryptSeed => set(() => ({ encryptSeed: encryptSeed })),
}));

export const usePassword = create(set => ({
  password: '',
  setPassword: password => set(() => ({ password: password })),
}));

export default useStore;

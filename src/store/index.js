import { create } from 'zustand';
import { persist } from 'zustand/middleware';
const useStore = create(
  persist(
    set => ({
      count: 0,
      currentAccount: {},
      setCurrentAccount: currentAccount => set(state => ({ currentAccount: currentAccount })),
      increase: () => set(state => ({ count: state.count + 1 })),
      reset: () => set({ count: 0 }),
    }),
    {
      name: 'currentAccountInfo',
    }
  )
);
export default useStore;

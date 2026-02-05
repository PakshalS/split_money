import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { createGroupsSlice } from './slices/groupsSlice';
import { createFriendsSlice } from './slices/friendsSlice';

/**
 * Main Zustand Store
 * Combines all slices into a single store
 */
const useStore = create(
  devtools(
    (set, get) => ({
      // Groups slice
      ...createGroupsSlice(set, get),
      
      // Friends slice
      ...createFriendsSlice(set, get),
      
      // Future slices will be added here:
      // ...createUISlice(set, get),
    }),
    {
      name: 'SplitMoneyStore', // Name for Redux DevTools
      enabled: process.env.NODE_ENV === 'development', // Enable only in development
    }
  )
);

export default useStore;

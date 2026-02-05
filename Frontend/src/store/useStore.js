import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { createGroupsSlice } from './slices/groupsSlice';
import { createFriendsSlice } from './slices/friendsSlice';

/**
 * Main Zustand Store
 * Combines all slices into a single store with persistence
 */
const useStore = create(
  devtools(
    persist(
      (set, get) => ({
        // Groups slice
        ...createGroupsSlice(set, get),
        
        // Friends slice
        ...createFriendsSlice(set, get),
        
        // Future slices will be added here:
        // ...createUISlice(set, get),
      }),
      {
        name: 'split-money-storage', // LocalStorage key
        partialize: (state) => ({
          // Store only the data, not loading/error states
          groups: state.groups,
          groupDetails: state.groupDetails,
          friends: state.friends,
          requests: state.requests,
        }),
        // Version for migration support if schema changes
        version: 1,
      }
    ),
    {
      name: 'SplitMoneyStore', // Name for Redux DevTools
      enabled: process.env.NODE_ENV === 'development', // Enable only in development
    }
  )
);

export default useStore;

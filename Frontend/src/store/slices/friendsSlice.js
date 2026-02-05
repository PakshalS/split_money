import axios from "axios";
import Cookies from "js-cookie";
import { API_ENDPOINTS } from "../../config/api";

export const createFriendsSlice = (set, get) => ({
  // State
  friends: [],
  requests: [],
  isLoadingFriends: false,
  isLoadingRequests: false,
  friendsError: null,
  requestsError: null,

  // Actions
  fetchFriends: async () => {
    set({ isLoadingFriends: true, friendsError: null });
    try {
      const token = Cookies.get("authToken");
      const response = await axios.get(API_ENDPOINTS.FRIENDS.GET_FRIENDS, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ friends: response.data, isLoadingFriends: false });
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      set({ friendsError: errorMsg, isLoadingFriends: false, friends: [] });
      throw error;
    }
  },

  fetchRequests: async () => {
    set({ isLoadingRequests: true, requestsError: null });
    try {
      const token = Cookies.get("authToken");
      const response = await axios.get(API_ENDPOINTS.FRIENDS.GET_REQUESTS, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ requests: response.data, isLoadingRequests: false });
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      set({ requestsError: errorMsg, isLoadingRequests: false, requests: [] });
      throw error;
    }
  },

  fetchAllFriendsData: async () => {
    const state = get();
    try {
      await Promise.all([
        state.fetchFriends(),
        state.fetchRequests(),
      ]);
    } catch (error) {
      console.error("Error fetching friends data:", error);
    }
  },

  addFriend: (friend) => {
    set((state) => ({
      friends: [...state.friends, friend],
    }));
  },

  removeFriend: (friendId) => {
    set((state) => ({
      friends: state.friends.filter((f) => f._id !== friendId),
    }));
  },

  removeFriendAsync: async (friendId) => {
    const originalFriends = get().friends;
    
    // Optimistic update
    set((state) => ({
      friends: state.friends.filter((f) => f._id !== friendId),
    }));

    try {
      await axios.delete(API_ENDPOINTS.FRIENDS.REMOVE(friendId), {
        headers: {
          Authorization: `Bearer ${Cookies.get("authToken")}`,
        },
      });
      return true;
    } catch (error) {
      // Rollback on error
      set({ friends: originalFriends });
      const errorMsg = error.response?.data?.message || error.message;
      set({ friendsError: errorMsg });
      throw error;
    }
  },

  respondToRequestAsync: async (requesterId, action) => {
    const originalRequests = get().requests;
    
    // Optimistic update
    set((state) => ({
      requests: state.requests.filter((r) => r.requester._id !== requesterId),
    }));

    try {
      await axios.post(
        API_ENDPOINTS.FRIENDS.RESPOND,
        { requesterId, action },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("authToken")}`,
          },
        }
      );
      
      // If accepted, also refresh friends list
      if (action === "accepted") {
        const updatedFriends = await get().fetchFriends();
      }
      
      return true;
    } catch (error) {
      // Rollback on error
      set({ requests: originalRequests });
      const errorMsg = error.response?.data?.message || error.message;
      set({ requestsError: errorMsg });
      throw error;
    }
  },

  sendFriendRequestAsync: async (email) => {
    try {
      await axios.post(
        API_ENDPOINTS.FRIENDS.SEND_REQUEST,
        { email },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("authToken")}`,
          },
        }
      );
      
      return true;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      set({ friendsError: errorMsg });
      throw error;
    }
  },

  addRequest: (request) => {
    set((state) => ({
      requests: [...state.requests, request],
    }));
  },

  removeRequest: (requestId) => {
    set((state) => ({
      requests: state.requests.filter((r) => r._id !== requestId),
    }));
  },

  clearFriendsData: () => {
    set({
      friends: [],
      requests: [],
      isLoadingFriends: false,
      isLoadingRequests: false,
      friendsError: null,
      requestsError: null,
    });
  },
});

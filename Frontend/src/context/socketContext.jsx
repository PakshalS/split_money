import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import Cookies from 'js-cookie';
import API_BASE_URL from '../config/api';

const SocketContext = createContext(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(null);

  useEffect(() => {
    // Only connect if user is authenticated
    const token = Cookies.get('authToken');
    if (!token) {
      console.log('No auth token found, skipping socket connection');
      return;
    }

    // Get backend URL from environment or use default
    const SOCKET_URL = API_BASE_URL;

    console.log('Initializing socket connection to:', SOCKET_URL);
    const socketInstance = io(SOCKET_URL, {
      auth: {
        token,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketInstance.on('connect', () => {
      setIsConnected(true);
      
      // Rejoin current group if was viewing one
      if (currentGroup) {
        console.log('Rejoining group after reconnect:', currentGroup);
        socketInstance.emit('join-group', currentGroup);
      }
    });

    socketInstance.on('disconnect', () => {
      console.log('❌ Socket disconnected');
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
      setIsConnected(false);
    });

    // Listen for group updates
    socketInstance.on('group-updated', (data) => {
    });

    setSocket(socketInstance);

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, []); // Keep empty array to avoid reconnecting on every render

  // Join a specific group room
  const joinGroup = useCallback((groupId) => {
    if (socket && isConnected && groupId) {
      socket.emit('join-group', groupId);
      setCurrentGroup(groupId);
    } else {
      console.warn('Cannot join group - socket not ready:', { socket: !!socket, isConnected, groupId });
    }
  }, [socket, isConnected]);

  // Leave a group room
  const leaveGroup = useCallback((groupId) => {
    if (socket && groupId) {
      socket.emit('leave-group', groupId);
      if (currentGroup === groupId) {
        setCurrentGroup(null);
      }
    }
  }, [socket, currentGroup]);

  // Subscribe to group updates
  const onGroupUpdate = useCallback((callback) => {
    if (socket) {
      socket.on('group-updated', callback);
      
      // Return cleanup function
      return () => {
        socket.off('group-updated', callback);
      };
    } else {
      console.warn('Cannot subscribe to group updates - socket not ready');
    }
  }, [socket]);

  const value = {
    socket,
    isConnected,
    currentGroup,
    joinGroup,
    leaveGroup,
    onGroupUpdate,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

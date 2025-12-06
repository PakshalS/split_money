// context/authcontext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 
import Cookies from 'js-cookie';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('authToken');
    if (token) {
      console.log('Token found');
      try {
        const decodedToken = jwtDecode(token);
        setAuthData(decodedToken);
      } catch (error) {
        console.error('Invalid token:', error);
        Cookies.remove('authToken');
      }
    }
    setLoading(false); // Done checking token
  }, []);

  const login = (token) => {
    console.log('Logging in with token:', token);
    Cookies.set('authToken', token, { expires: 2 });
    const decodedToken = jwtDecode(token);
    setAuthData(decodedToken);
  };

  const logout = () => {
    console.log('Logging out');
    Cookies.remove('authToken');
    setAuthData(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ authData, login, logout, setAuthData, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
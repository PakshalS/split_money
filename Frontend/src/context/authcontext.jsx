import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decodedToken = jwtDecode(token);
      setAuthData(decodedToken);
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('authToken', token);
    const decodedToken = jwtDecode(token);
    setAuthData(decodedToken);
    navigate('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setAuthData(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ authData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };

import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/authcontext';

const ProtectedRoute = ({ children }) => {
  const { authData } = useContext(AuthContext);
  return authData ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;

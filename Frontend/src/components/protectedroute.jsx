// components/protectedroute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/authcontext';

const ProtectedRoute = ({ children }) => {
  const { authData, loading } = useContext(AuthContext);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // After loading, if no authData, redirect to login
  if (!authData) {
    return <Navigate to="/login" replace />;
  }

  // User is authenticated, render the protected component
  return children;
};

export default ProtectedRoute;
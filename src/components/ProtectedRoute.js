import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#141414'
      }}>
        <div className="loading"></div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;

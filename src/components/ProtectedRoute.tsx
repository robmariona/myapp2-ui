import React from 'react'; // Ensure React is imported
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode; 
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>; // Wrapping in a fragment is a safe practice
};

export default ProtectedRoute;
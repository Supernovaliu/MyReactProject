import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

interface ProtectedRouteProps {
  element: React.ComponentType;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element: Component }) => {
  const token = useSelector((state: any) => state.auth.token);  
  

  if (!token) {
    console.log('No token found, redirecting to signin');
    return <Navigate to="/signin" replace />;
  }

  return <Component />;
};

export default ProtectedRoute;
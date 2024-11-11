import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.authentication.isAuthenticated);

  console.log("protected route component")
  console.log("isAuthenticated:", isAuthenticated)

  // If not authenticated, redirect to the landing page
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  // If authenticated, render the child component (protected page)
  return children;
};

export default ProtectedRoute;


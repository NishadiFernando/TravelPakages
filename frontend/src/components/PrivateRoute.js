import React from 'react';
import { Navigate } from 'react-router-dom';
import AdminViewPackages from './AdminViewPackages';


const PrivateRoute = ({ element }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const role = localStorage.getItem('role'); // Assuming you store user roles in localStorage

  if (!isLoggedIn) {
    return <Navigate to="/" />; // Redirect to login if not logged in
  }

  // Example for role-based access
  if (element.type === AdminViewPackages && role !== 'admin') {
    return <Navigate to="/view" />; // Redirect non-admin users
  }

  return element; // Allow access to the route
};

export default PrivateRoute;

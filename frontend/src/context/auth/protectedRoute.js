import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from './auth';

const ProtectedElement = ({ children }) => {
    const location = useLocation();
    if (!isAuthenticated()) {
        return <Navigate to="/auth" replace state={{ from: location }} />;
    }
    return children; 
};

const ProtectedRoute = ({ element: Component, ...props }) => (
    <ProtectedElement>
        <Component {...props} />
    </ProtectedElement>
);

export default ProtectedRoute;
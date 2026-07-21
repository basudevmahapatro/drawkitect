import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../store/AuthProvider.jsx';
import LoadingDialog from './LoadingDialog.jsx';

export const ProtectedRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <LoadingDialog />;
    }

    return user ? <Outlet /> : <Navigate to="/login" replace />;
};
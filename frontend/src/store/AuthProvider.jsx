import axios from "axios";
import React, { useContext, useState, useEffect } from 'react';
import AuthContext from "./authContext.js"

export const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    withCredentials: true,
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (accessToken) {
            api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        } else {
            delete api.defaults.headers.common['Authorization'];
        }
    }, [accessToken]);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const response = await api.post('/auth/refreshToken');
                const { accessToken: newAccessToken } = response.data;

                const userResponse = await axios.get(`${api.defaults.baseURL}/auth/getMe`, {
                    headers: { Authorization: `Bearer ${newAccessToken}` }
                });

                setAccessToken(newAccessToken);
                setUser(userResponse.data.user);
            } catch (error) {
                console.log("No active session found.");
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const login = (token, userData) => {
        setAccessToken(token);
        setUser(userData);
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (err) {
            console.error("Logout failed on server", err);
        } finally {
            setAccessToken(null);
            setUser(null);
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
    };

    return (
        <AuthContext.Provider value={{ user, accessToken, loading, login, logout, setAccessToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
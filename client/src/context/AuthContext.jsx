import { useState } from 'react';
import api from '../services/api';
import AuthContext from './auth-context';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const rawUser = localStorage.getItem('user');
        return rawUser ? JSON.parse(rawUser) : null;
    });

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
        return data;
    };

    const register = async (name, email, password) => {
        const { data } = await api.post('/auth/register', { name, email, password });
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
        return data;
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    const value = {
        user,
        login,
        register,
        logout,
        loading: false,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

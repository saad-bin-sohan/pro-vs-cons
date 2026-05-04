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

        // data = { _id, name, email, theme }
        // There is NO 'token' field in the response anymore.
        // The server set an httpOnly cookie containing the JWT.
        // We store only the profile data for UI purposes.
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
        return data;
    };

    const register = async (name, email, password) => {
        const { data } = await api.post('/auth/register', { name, email, password });

        // Same as login — profile data only, no token in response.
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
        return data;
    };

    const logout = () => {
        // Clear client state immediately — synchronous, instant UX.
        // Layout.jsx calls logout() then navigate('/login') immediately
        // after. The client side logs out before the server responds.
        localStorage.removeItem('user');
        setUser(null);

        // Fire server call to clear the httpOnly cookie in the background.
        // We do NOT await this — the user is already logged out on the
        // client. If the network call fails, the cookie will eventually
        // expire on its own (30 days). Errors are silently swallowed
        // because there is nothing meaningful to do if logout fails —
        // the client state is already cleared.
        api.post('/auth/logout').catch(() => {});
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

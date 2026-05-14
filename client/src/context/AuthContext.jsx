import { useState, useEffect } from 'react';
import api from '../services/api';
import AuthContext from './auth-context';

// How long before expiry we consider the token "expiring soon"
// and trigger a background re-validation. Set to 1 hour.
const REVALIDATE_BEFORE_EXPIRY_MS = 60 * 60 * 1000;

export const AuthProvider = ({ children }) => {
    const [user, setUser]       = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser  = localStorage.getItem('user');
        const expiresAt   = Number(localStorage.getItem('userExpiresAt') || 0);
        const now         = Date.now();
        const tokenIsFresh = expiresAt - now > REVALIDATE_BEFORE_EXPIRY_MS;

        if (!storedUser) {
            // No stored session — definitely not logged in.
            // Skip all network calls.
            setLoading(false);
            return;
        }

        if (tokenIsFresh) {
            // Token exists and is not expiring soon.
            // Trust localStorage — no network call needed.
            // This is the hot path for 99% of page loads/refreshes.
            setUser(JSON.parse(storedUser));
            setLoading(false);
            return;
        }

        // Token is expiring within the next hour (or expiresAt is 0 from
        // an old session before this change). Re-validate with the server.
        api.get('/auth/profile')
            .then(({ data }) => {
                setUser(data);
                localStorage.setItem('user', JSON.stringify(data));
                // Reset expiry for another 30 days
                localStorage.setItem(
                    'userExpiresAt',
                    String(Date.now() + 30 * 24 * 60 * 60 * 1000)
                );
            })
            .catch(() => {
                // Cookie is gone or invalid — clear all local state
                localStorage.removeItem('user');
                localStorage.removeItem('userExpiresAt');
                setUser(null);
            })
            .finally(() => setLoading(false));
    }, []);

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        // Store user profile and token expiry (30 days from now)
        localStorage.setItem('user', JSON.stringify(data));
        localStorage.setItem(
            'userExpiresAt',
            String(Date.now() + 30 * 24 * 60 * 60 * 1000)
        );
        setUser(data);
        return data;
    };

    const register = async (name, email, password) => {
        const { data } = await api.post('/auth/register', { name, email, password });
        localStorage.setItem('user', JSON.stringify(data));
        localStorage.setItem(
            'userExpiresAt',
            String(Date.now() + 30 * 24 * 60 * 60 * 1000)
        );
        setUser(data);
        return data;
    };

    const logout = () => {
        // Clear all client-side state immediately — synchronous, instant UX.
        localStorage.removeItem('user');
        localStorage.removeItem('userExpiresAt');
        setUser(null);

        // Clear the httpOnly cookie on the server in the background.
        // We do NOT await this — the client is already logged out.
        api.post('/auth/logout').catch(() => {});
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

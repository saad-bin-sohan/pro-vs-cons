import { useState, useEffect } from 'react';
import api from '../services/api';
import AuthContext from './auth-context';

// How long before expiry we consider the token "expiring soon"
// and trigger a background re-validation. Set to 1 hour.
const REVALIDATE_BEFORE_EXPIRY_MS = 60 * 60 * 1000;

// Pure, synchronous reads of the cached session. These run during
// render (as lazy useState initializers) rather than inside an
// effect, so the correct user/loading values are present on the
// very first render for the two fast-path cases below — no extra
// render, no flash of a loading state.
const readStoredUser = () => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return null;
    try {
        return JSON.parse(storedUser);
    } catch {
        return null;
    }
};

const isTokenFresh = () => {
    const expiresAt = Number(localStorage.getItem('userExpiresAt') || 0);
    return expiresAt - Date.now() > REVALIDATE_BEFORE_EXPIRY_MS;
};

export const AuthProvider = ({ children }) => {
    // Trust localStorage immediately only when the token is fresh —
    // otherwise mirror the pre-revalidation state (user: null) until
    // the effect below confirms it. Same three-way branching as
    // before, just evaluated during render instead of after mount.
    const [user, setUser]       = useState(() => (isTokenFresh() ? readStoredUser() : null));
    const [loading, setLoading] = useState(() => Boolean(localStorage.getItem('user')) && !isTokenFresh());

    useEffect(() => {
        if (!localStorage.getItem('user') || isTokenFresh()) {
            // No stored session, or the token isn't expiring soon —
            // both cases are already reflected in the initial state
            // above. Nothing to do.
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

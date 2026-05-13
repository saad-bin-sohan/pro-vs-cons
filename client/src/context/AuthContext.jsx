import { useState, useEffect } from 'react';
import api from '../services/api';
import AuthContext from './auth-context';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // On every mount (including page refresh), check whether the
        // server-side cookie is still alive by hitting /auth/profile.
        // This is the single source of truth — localStorage alone is
        // not enough because the httpOnly cookie could be expired/cleared
        // without us knowing.
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            // No localStorage entry → definitely not logged in.
            // Skip the network call entirely.
            setLoading(false);
            return;
        }
        // localStorage says we were logged in — verify the cookie still works.
        api.get('/auth/profile')
            .then(({ data }) => {
                // Cookie is valid. Update local state with fresh data from server.
                setUser(data);
                localStorage.setItem('user', JSON.stringify(data));
            })
            .catch(() => {
                // Cookie is gone, expired, or invalid. Clean up client state.
                // The 401 interceptor in api.js will NOT redirect here because
                // we are on the initial mount — the ProtectedRoute's loading=true
                // state prevents any protected content from rendering while this
                // check is in flight, so there's nothing to redirect away from yet.
                localStorage.removeItem('user');
                setUser(null);
            })
            .finally(() => setLoading(false));
    }, []); // Empty dependency array — run once on mount only.

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
        api.post('/auth/logout').catch(() => { });
    };

    const value = {
        user,
        login,
        register,
        logout,
        loading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

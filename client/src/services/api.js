import axios from 'axios';

// const instance = axios.create({
//     baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
//     // withCredentials: true is essential for cross-origin cookie support.
//     // It tells the browser to include cookies (and other credentials)
//     // in requests to the backend even though it is on a different domain
//     // (onrender.com vs vercel.app). The backend CORS config already has
//     // credentials: true to allow this. Both sides must opt in.
//     withCredentials: true,
// });

const instance = axios.create({
    baseURL: '/api',  // relative — same origin, no cross-origin issues
    withCredentials: true, // can keep this, harmless for same-origin
});

// ============================================================
// REQUEST INTERCEPTOR — REMOVED
// Previously this read localStorage('user'), parsed it, extracted
// .token, and set Authorization: Bearer <token> on every request.
// This is no longer needed — the browser sends the httpOnly cookie
// automatically. There is no token in localStorage anymore.
// ============================================================

// ============================================================
// RESPONSE INTERCEPTOR — Handles session expiry globally.
// If the server returns 401 (Unauthorized) on any request, it means
// the auth cookie is missing, expired, or invalid. We clear any
// stale client-side state and redirect to /login immediately.
// This covers the case where a user's 30-day cookie expires while
// they have the app open, or if the cookie is cleared server-side.
// ============================================================
instance.interceptors.response.use(
    // Pass through all successful responses untouched
    (response) => response,
    (error) => {
        // Do NOT redirect on 401s that come from login or register.
        // Those 401s mean "wrong password / bad input" — the Login/Register
        // page's own catch block must handle them and show the error message.
        // If the interceptor fires window.location.href here, the page
        // hard-reloads before setError() can run, giving the user a silent
        // blank form with no feedback.
        const isAuthEndpoint =
            error.config?.url?.includes('/auth/login') ||
            error.config?.url?.includes('/auth/register');

        // Also skip if we're already on /login — no point redirecting to
        // where we already are, and it would cause a redundant page reload.
        const alreadyOnLogin = window.location.pathname === '/login';

        if (error.response?.status === 401 && !isAuthEndpoint && !alreadyOnLogin) {
            // Cookie is missing, expired, or invalid on a protected route.
            // Clear stale client state and send user to login.
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default instance;

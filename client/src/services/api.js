import axios from 'axios';

const instance = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
    // withCredentials: true is essential for cross-origin cookie support.
    // It tells the browser to include cookies (and other credentials)
    // in requests to the backend even though it is on a different domain
    // (onrender.com vs vercel.app). The backend CORS config already has
    // credentials: true to allow this. Both sides must opt in.
    withCredentials: true,
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
        if (error.response?.status === 401) {
            // Clear stale client state
            localStorage.removeItem('user');
            // Redirect to login. Using window.location.href instead of
            // React Router navigate() because this interceptor lives
            // outside of React's component tree and has no access to
            // the router context.
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default instance;

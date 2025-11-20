import axios from "axios";

const instance = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
    withCredentials: true, // if backend uses cookies; safe to keep
});

// Attach JWT token from localStorage
instance.interceptors.request.use(
    (config) => {
        const raw = localStorage.getItem("user");
        if (raw) {
            const user = JSON.parse(raw);
            if (user?.token) {
                config.headers.Authorization = `Bearer ${user.token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default instance;

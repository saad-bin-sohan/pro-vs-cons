const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables (CLIENT_URL, MONGO_URI, JWT_SECRET, etc.)
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ================================
// CORS CONFIG — PRODUCTION READY
// ================================

// Local development origin
const localOrigin = 'http://localhost:5173';

// Production frontend origin(s) from Render env vars (comma separated)
const envOrigins = (process.env.CLIENT_URLS || process.env.CLIENT_URL || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

// Known deployed Vercel origin as a safe fallback
const defaultDeployedOrigin = 'https://pro-vs-cons.vercel.app';

// Allow local, fallback deployed, and any env configured origins (deduped)
const allowedOrigins = Array.from(
    new Set([localOrigin, defaultDeployedOrigin, ...envOrigins])
);

// Allow *.vercel.app preview deployments by default (can be extended via env)
const wildcardDomainSuffixes = Array.from(
    new Set(
        [
            'vercel.app',
            ...(process.env.CLIENT_DOMAIN_SUFFIXES || '')
                .split(',')
                .map((suffix) => suffix.trim().replace(/^\./, ''))
                .filter(Boolean),
        ].filter(Boolean)
    )
);

const isAllowedOrigin = (origin) => {
    if (!origin) return true; // Non-CORS tools (curl/Postman)

    if (allowedOrigins.includes(origin)) {
        return true;
    }

    try {
        const { hostname } = new URL(origin);
        return wildcardDomainSuffixes.some((suffix) =>
            hostname === suffix || hostname.endsWith(`.${suffix}`)
        );
    } catch (err) {
        return false;
    }
};

const corsOptions = {
    origin(origin, callback) {
        if (isAllowedOrigin(origin)) {
            return callback(null, true);
        }
        return callback(
            new Error(
                `CORS blocked from origin: ${origin || 'unknown origin'}`
            )
        );
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    optionsSuccessStatus: 204,
};

// CORS middleware
app.use(cors(corsOptions));
// Respond to preflight requests across all routes; Express 5 requires a valid path,
// so use a RegExp catch-all to bypass path-to-regexp string parsing quirks.
app.options(/.*/, cors(corsOptions));

// Parse JSON bodies
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
    res.send('API is running...');
});

// ROUTES
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/lists', require('./routes/listRoutes'));

// ERROR HANDLERS
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
app.use(notFound);
app.use(errorHandler);

// PORT handling (Render provides PORT automatically)
const PORT = process.env.PORT || 5001;

// Start server
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

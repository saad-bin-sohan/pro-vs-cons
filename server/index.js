const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

// Load environment variables first, before anything else
dotenv.config();

// ============================================================
// STARTUP GUARD: Refuse to start if JWT_SECRET is missing,
// too short, or is the known insecure placeholder value.
// The human operator must set a strong secret in Render's
// environment dashboard. This guard makes it impossible to
// accidentally run in production with a weak secret.
// ============================================================
const KNOWN_WEAK_SECRETS = [
    'supersecretkey_change_this_in_production',
    'secret',
    'jwt_secret',
    'your_jwt_secret',
    'changeme',
    '',
];

if (!process.env.JWT_SECRET) {
    console.error('FATAL: JWT_SECRET environment variable is not set.');
    process.exit(1);
}

if (process.env.JWT_SECRET.length < 32) {
    console.error('FATAL: JWT_SECRET is too short. Use a random string of at least 32 characters.');
    if (process.env.NODE_ENV === 'production') process.exit(1);
}

if (KNOWN_WEAK_SECRETS.includes(process.env.JWT_SECRET)) {
    console.error(
        'FATAL: JWT_SECRET is set to a known insecure placeholder. ' +
        'Go to your Render dashboard → Environment → change JWT_SECRET to a ' +
        'cryptographically random string of at least 64 characters before redeploying.'
    );
    process.exit(1);
}

// Connect to MongoDB
connectDB();

const app = express();

// ============================================================
// MIDDLEWARE ORDER — Do not reorder these. Each layer depends
// on the one above it.
// ============================================================

// 1. Security headers — must be first
//    Sets: X-DNS-Prefetch-Control, X-Frame-Options, HSTS,
//    X-Content-Type-Options, Referrer-Policy, X-XSS-Protection, etc.
//    This is a pure API server (no HTML), so all defaults are safe.
app.use(helmet());

// 2. Trust the reverse proxy (Render sits behind one)
//    Required for express-rate-limit to read the real client IP
//    from X-Forwarded-For instead of the proxy IP.
app.set('trust proxy', 1);

// ============================================================
// CORS CONFIG — PRODUCTION READY
// ============================================================

const localOrigin = 'http://localhost:5173';
const envOrigins = (process.env.CLIENT_URLS || process.env.CLIENT_URL || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
const defaultDeployedOrigin = 'https://provscons.vercel.app';

const allowedOrigins = Array.from(
    new Set([localOrigin, defaultDeployedOrigin, ...envOrigins])
);

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
    if (!origin) return true;
    if (allowedOrigins.includes(origin)) return true;
    try {
        const { hostname } = new URL(origin);
        return wildcardDomainSuffixes.some(
            (suffix) => hostname === suffix || hostname.endsWith(`.${suffix}`)
        );
    } catch {
        return false;
    }
};

const corsOptions = {
    origin(origin, callback) {
        if (isAllowedOrigin(origin)) return callback(null, true);
        return callback(new Error(`CORS blocked from origin: ${origin || 'unknown origin'}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    optionsSuccessStatus: 204,
};

// 3. CORS — after helmet, before rate limiting and routes
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

// 4. Gzip/Brotli compression — compresses all JSON API responses.
//    Reduces payload size by 60-80% on typical JSON, which matters
//    especially on slow mobile connections.
app.use(compression());

// 5. Cookie parser — must come before routes so req.cookies is
//    populated when authMiddleware runs. cookie-parser reads the
//    Cookie header and exposes it as req.cookies object.
app.use(cookieParser());

// 6. Body parsing — limit to 1mb to prevent oversized payload attacks
app.use(express.json({ limit: '1mb' }));

// ============================================================
// RATE LIMITING — Applied to auth endpoints only.
// Prevents brute-force attacks on login and register.
// 20 attempts per IP per 15-minute window is generous for
// legitimate users but stops automated attacks cold.
// ============================================================
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15-minute window
    max: 20,                   // max 20 requests per IP per window
    message: {
        message: 'Too many attempts from this IP, please try again after 15 minutes.',
    },
    standardHeaders: true,     // Return rate limit info in RateLimit-* headers
    legacyHeaders: false,      // Disable the X-RateLimit-* legacy headers
});

// Apply rate limiter to auth routes before the router mounts them
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// ============================================================
// HEALTH CHECK ENDPOINT
// This is a lightweight endpoint with zero database calls.
// UptimeRobot (or any monitor) should ping this URL every
// 5 minutes: https://pro-vs-cons.onrender.com/api/health
// This keeps Render's free-tier server warm and prevents the
// 20-30 second cold-start delays.
// ============================================================
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        uptime: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.send('API is running...');
});

// ============================================================
// ROUTES
// ============================================================
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/lists', require('./routes/listRoutes'));

// ============================================================
// ERROR HANDLERS — Must be last
// ============================================================
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
app.use(notFound);
app.use(errorHandler);

// ============================================================
// START SERVER
// ============================================================
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(
        `Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
    );
});

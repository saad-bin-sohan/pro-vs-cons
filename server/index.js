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

// Production frontend origin from Render env vars
const deployedOrigin = process.env.CLIENT_URL;

// Allow both local + deployed frontends
const allowedOrigins = [localOrigin, deployedOrigin];

// CORS middleware
app.use(
    cors({
        origin: function (origin, callback) {
            // Allow non-browser tools (Postman, curl)
            if (!origin) return callback(null, true);

            // Allow requests from our whitelisted origins
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            // Block unknown origins (safe for production)
            return callback(new Error(`CORS blocked from origin: ${origin}`));
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

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

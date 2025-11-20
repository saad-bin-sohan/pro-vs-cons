const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// =======================================================
// CORS FIX (Express 5 compatible)
// =======================================================

const allowedOrigin = 'http://localhost:5173';

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', allowedOrigin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');

    // Handle preflight immediately
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }

    next();
});

// =======================================================

app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is running...');
});

// ROUTES
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/lists', require('./routes/listRoutes'));

const { notFound, errorHandler } = require('./middleware/errorMiddleware');

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

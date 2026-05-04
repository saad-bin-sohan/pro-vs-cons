const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const protect = asyncHandler(async (req, res, next) => {
    let token;

    // PRIMARY: Read token from httpOnly cookie.
    // The browser sends this cookie automatically on every request
    // when axios has withCredentials: true. JavaScript cannot access
    // httpOnly cookies — this is the entire point of the migration.
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }
    // FALLBACK: Authorization header for API clients (e.g. Postman,
    // curl, third-party integrations). Kept for backward compatibility.
    // This does NOT weaken the cookie security — it is an alternative
    // auth path for non-browser clients only.
    else if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // .lean() from Phase 1 — returns plain JS object, not a
            // Mongoose Document. Faster since we never call .save() here.
            req.user = await User.findById(decoded.id)
                .select('-password')
                .lean();

            if (!req.user) {
                res.status(401);
                throw new Error('Not authorized, user not found');
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    } else {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

module.exports = { protect };

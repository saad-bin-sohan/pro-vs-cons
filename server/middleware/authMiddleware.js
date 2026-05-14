const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

/**
 * Authentication middleware — protects private routes.
 *
 * Reads the JWT from the httpOnly cookie (primary) or the
 * Authorization: Bearer header (fallback for API clients).
 *
 * PERFORMANCE: req.user is now built entirely from the verified
 * JWT payload. There is NO database call here. The payload
 * contains id, name, email, and theme — everything protected
 * routes need. This removes one MongoDB round-trip (60–200ms
 * on Atlas M0) from every single protected API request.
 *
 * SECURITY: The payload is cryptographically signed. Tampered
 * tokens fail jwt.verify() and are rejected. The only trade-off
 * is that if a user updates their profile (name/email/theme),
 * the cookie reflects the old values until it expires or is
 * re-issued. We mitigate this by re-issuing the cookie on every
 * profile update (see authController.updateUserProfile when you
 * add that endpoint).
 */
const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    } else if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Build req.user from the verified token payload.
        // No database query needed.
        req.user = {
            _id:   decoded.id,
            name:  decoded.name,
            email: decoded.email,
            theme: decoded.theme || 'light',
        };

        next();
    } catch (error) {
        console.error('Auth token verification failed:', error.message);
        res.status(401);
        throw new Error('Not authorized, token failed');
    }
});

module.exports = { protect };

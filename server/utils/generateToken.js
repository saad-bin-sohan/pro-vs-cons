const jwt = require('jsonwebtoken');

/**
 * Generate a signed JWT containing the user's profile data.
 * Embedding name/email/theme in the payload means authMiddleware
 * can reconstruct req.user from the token alone — no database
 * round-trip needed on every protected request.
 *
 * @param {object} user - Mongoose user document or plain object
 *   with _id, name, email, theme properties.
 * @returns {string} Signed JWT string, expires in 30 days.
 */
const generateToken = (user) => {
    return jwt.sign(
        {
            id:    user._id.toString(),
            name:  user.name,
            email: user.email,
            theme: user.theme || 'light',
        },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );
};

module.exports = generateToken;

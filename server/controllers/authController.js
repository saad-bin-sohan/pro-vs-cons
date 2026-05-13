const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');

// Simple email regex — validates format without being overly strict
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ============================================================
// COOKIE OPTIONS
// In production (Render → Vercel = cross-origin):
//   - secure: true  → HTTPS only (required when sameSite='None')
//   - sameSite: 'None' → allows cross-site requests from Vercel
// In development (localhost = same-site):
//   - secure: false → works without HTTPS
//   - sameSite: 'Lax' → standard protection for same-site
// httpOnly is ALWAYS true — this is what prevents JavaScript
// (including XSS payloads) from ever reading the token.
// maxAge matches the JWT expiry: 30 days in milliseconds.
// ============================================================
const isProduction = process.env.NODE_ENV === 'production';

const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'Lax', // no longer need 'None' — requests are same-origin via the proxy
    maxAge: 30 * 24 * 60 * 60 * 1000,
    path: '/',
};

// ============================================================
// Helper: sets the auth cookie on a response object
// ============================================================
const setAuthCookie = (res, userId) => {
    const token = generateToken(userId);
    res.cookie('token', token, cookieOptions);
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // --- Input validation (carried over from Phase 1) ---
    if (!email || !password) {
        res.status(400);
        throw new Error('Email and password are required');
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!EMAIL_REGEX.test(trimmedEmail)) {
        res.status(400);
        throw new Error('Invalid email format');
    }

    if (typeof password !== 'string' || password.length === 0) {
        res.status(400);
        throw new Error('Password is required');
    }
    // --- End validation ---

    const user = await User.findOne({ email: trimmedEmail });

    if (user && (await user.matchPassword(password))) {
        // Set the JWT in an httpOnly cookie.
        // The token is NO LONGER included in the JSON response body.
        // JavaScript (including any XSS payload) cannot read this cookie.
        setAuthCookie(res, user._id);

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            theme: user.theme,
            // NOTE: 'token' field intentionally omitted from response body.
            // The token lives in the httpOnly cookie only.
        });
    } else {
        // Intentionally vague — do not reveal whether the email exists
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // --- Input validation (carried over from Phase 1) ---
    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Name, email, and password are required');
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (trimmedName.length < 2) {
        res.status(400);
        throw new Error('Name must be at least 2 characters');
    }

    if (trimmedName.length > 100) {
        res.status(400);
        throw new Error('Name must be 100 characters or fewer');
    }

    if (!EMAIL_REGEX.test(trimmedEmail)) {
        res.status(400);
        throw new Error('Invalid email format');
    }

    if (password.length < 8) {
        res.status(400);
        throw new Error('Password must be at least 8 characters');
    }

    if (password.length > 128) {
        res.status(400);
        throw new Error('Password must be 128 characters or fewer');
    }
    // --- End validation ---

    const userExists = await User.findOne({ email: trimmedEmail });

    if (userExists) {
        res.status(400);
        throw new Error('An account with this email already exists');
    }

    const user = await User.create({
        name: trimmedName,
        email: trimmedEmail,
        password,
    });

    if (user) {
        // Set the JWT in an httpOnly cookie — same as login.
        setAuthCookie(res, user._id);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            theme: user.theme,
            // NOTE: 'token' field intentionally omitted from response body.
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    // req.user is already fetched by authMiddleware — no extra DB call.
    // (Unchanged from Phase 1)
    const user = req.user;

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            theme: user.theme,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Logout user — clears the auth cookie
// @route   POST /api/auth/logout
// @access  Public (no token needed — you're logging out)
const logoutUser = asyncHandler(async (req, res) => {
    // Clear the auth cookie by setting the same cookie name with an
    // empty value and an immediately-expired date. The options object
    // MUST match the options used when setting the cookie (same path,
    // same secure/sameSite flags) — otherwise the browser will not
    // recognize it as the same cookie and will not remove it.
    res.cookie('token', '', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'None' : 'Lax',
        expires: new Date(0), // January 1, 1970 — immediately expired
        path: '/',
    });

    res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = { authUser, registerUser, getUserProfile, logoutUser };

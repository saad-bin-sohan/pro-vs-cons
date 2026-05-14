const express = require('express');
const router = express.Router();
const {
    authUser,
    registerUser,
    getUserProfile,
    updateUserProfile,
    logoutUser,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/logout', logoutUser);
router.route('/profile')
    .get(protect, (req, res, next) => {
        // Profile data changes rarely. Allow browser to use cached response
        // for up to 5 minutes, then revalidate. Private = never CDN-cached.
        res.set('Cache-Control', 'private, max-age=300');
        next();
    }, getUserProfile)
    .put(protect, updateUserProfile);

module.exports = router;

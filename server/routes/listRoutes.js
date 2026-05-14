const express = require('express');
const router = express.Router();
const {
    getLists,
    createList,
    getListById,
    updateList,
    deleteList,
    shareList,
    getPublicList,
    duplicateList,
    toggleArchive,
    addComment,
    deleteComment,
    addVote,
    updateSharePermissions,
    setReminder,
    getUpcomingReminders,
    addTimelineEvent,
} = require('../controllers/listController');
const { protect } = require('../middleware/authMiddleware');

// ============================================================
// STATIC ROUTES FIRST — always register before /:id routes.
// These have literal first path segments that cannot be mistaken
// for MongoDB ObjectIds. Placing them first means Express never
// needs to backtrack when matching these paths.
// ============================================================

// GET /api/lists/reminders/upcoming
router.route('/reminders/upcoming').get(protect, getUpcomingReminders);

// GET /api/lists/public/:token
router.route('/public/:token').get(getPublicList);

// ============================================================
// ROOT ROUTE
// ============================================================
router.route('/')
    .get(protect, (req, res, next) => {
        // List data changes on user actions. 30-second cache cuts
        // repeat DB hits on dashboard re-renders and back-navigation.
        res.set('Cache-Control', 'private, max-age=30');
        next();
    }, getLists)
    .post(protect, createList);

// ============================================================
// PARAMETERIZED ROUTES — after static routes
// ============================================================
router
    .route('/:id')
    .get(protect, getListById)
    .put(protect, updateList)
    .delete(protect, deleteList);

router.route('/:id/share').post(protect, shareList);
router.route('/:id/duplicate').post(protect, duplicateList);
router.route('/:id/archive').put(protect, toggleArchive);
router.route('/:id/permissions').put(protect, updateSharePermissions);
router.route('/:id/reminder').put(protect, setReminder);
router.route('/:id/timeline').post(protect, addTimelineEvent);
router.route('/:id/comments').post(addComment);
router.route('/:id/comments/:commentId').delete(protect, deleteComment);
router.route('/:id/vote').post(addVote);

module.exports = router;

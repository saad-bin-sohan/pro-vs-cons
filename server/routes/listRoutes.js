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

router.route('/').get(protect, getLists).post(protect, createList);
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
router.route('/public/:token').get(getPublicList);
router.route('/reminders/upcoming').get(protect, getUpcomingReminders);

module.exports = router;

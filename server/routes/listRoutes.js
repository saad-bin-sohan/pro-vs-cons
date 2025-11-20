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
} = require('../controllers/listController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getLists).post(protect, createList);
router
    .route('/:id')
    .get(protect, getListById)
    .put(protect, updateList)
    .delete(protect, deleteList);

router.route('/:id/share').post(protect, shareList);
router.route('/public/:token').get(getPublicList);

module.exports = router;

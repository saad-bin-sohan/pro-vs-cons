const asyncHandler = require('express-async-handler');
const List = require('../models/listModel');

// @desc    Get all lists for logged in user
// @route   GET /api/lists
// @access  Private
const getLists = asyncHandler(async (req, res) => {
    const lists = await List.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.json(lists);
});

// @desc    Get single list by ID
// @route   GET /api/lists/:id
// @access  Private
const getListById = asyncHandler(async (req, res) => {
    const list = await List.findById(req.params.id);

    if (list) {
        if (list.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to view this list');
        }
        res.json(list);
    } else {
        res.status(404);
        throw new Error('List not found');
    }
});

// @desc    Create a new list
// @route   POST /api/lists
// @access  Private
const createList = asyncHandler(async (req, res) => {
    const { title, description, items } = req.body;

    const list = new List({
        user: req.user._id,
        title,
        description,
        items: items || [],
    });

    const createdList = await list.save();
    res.status(201).json(createdList);
});

// @desc    Update a list
// @route   PUT /api/lists/:id
// @access  Private
const updateList = asyncHandler(async (req, res) => {
    const { title, description, items, status, outcome, outcomeRationale, isPublic } = req.body;

    const list = await List.findById(req.params.id);

    if (list) {
        if (list.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to update this list');
        }

        list.title = title || list.title;
        list.description = description || list.description;
        list.items = items || list.items;
        list.status = status || list.status;
        list.outcome = outcome || list.outcome;
        list.outcomeRationale = outcomeRationale || list.outcomeRationale;
        list.isPublic = isPublic !== undefined ? isPublic : list.isPublic;

        const updatedList = await list.save();
        res.json(updatedList);
    } else {
        res.status(404);
        throw new Error('List not found');
    }
});

// @desc    Delete a list
// @route   DELETE /api/lists/:id
// @access  Private
const deleteList = asyncHandler(async (req, res) => {
    const list = await List.findById(req.params.id);

    if (list) {
        if (list.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to delete this list');
        }

        await list.deleteOne();
        res.json({ message: 'List removed' });
    } else {
        res.status(404);
        throw new Error('List not found');
    }
});

// @desc    Share a list (generate token)
// @route   POST /api/lists/:id/share
// @access  Private
const shareList = asyncHandler(async (req, res) => {
    const list = await List.findById(req.params.id);

    if (list) {
        if (list.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to share this list');
        }

        if (!list.shareToken) {
            list.shareToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            list.isPublic = true;
            await list.save();
        }

        res.json({ shareToken: list.shareToken });
    } else {
        res.status(404);
        throw new Error('List not found');
    }
});

// @desc    Get public list by token
// @route   GET /api/lists/public/:token
// @access  Public
const getPublicList = asyncHandler(async (req, res) => {
    const list = await List.findOne({ shareToken: req.params.token });

    if (list && list.isPublic) {
        res.json(list);
    } else {
        res.status(404);
        throw new Error('List not found or not public');
    }
});

module.exports = {
    getLists,
    getListById,
    createList,
    updateList,
    deleteList,
    shareList,
    getPublicList,
};

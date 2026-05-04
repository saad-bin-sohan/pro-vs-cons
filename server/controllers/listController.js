const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const List = require('../models/listModel');

// @desc    Get all lists for logged in user
// @route   GET /api/lists
// @access  Private
const getLists = asyncHandler(async (req, res) => {
    const includeArchived = req.query.archived === 'true';
    const filter = { user: req.user._id };

    if (!includeArchived) {
        filter.archived = { $ne: true };
    }

    // .lean() returns plain JS objects instead of Mongoose Documents.
    // This is safe because this endpoint is read-only — we never call
    // .save() or any Mongoose method on these results. Lean queries are
    // significantly faster because Mongoose skips document hydration.
    const lists = await List.find(filter).sort({ updatedAt: -1 }).lean();
    res.json(lists);
});

// @desc    Get single list by ID
// @route   GET /api/lists/:id
// @access  Private
const getListById = asyncHandler(async (req, res) => {
    // .lean() — this endpoint is read-only for the ListEditor initial load.
    // Updates go through the separate PUT /api/lists/:id endpoint.
    const list = await List.findById(req.params.id).lean();

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
    const { title, description, items, status, outcome, outcomeRationale, isPublic, notes } = req.body;

    // No .lean() — we need the full Mongoose Document to call .save()
    const list = await List.findById(req.params.id);

    if (list) {
        if (list.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to update this list');
        }

        list.title = title !== undefined ? title : list.title;
        list.description = description !== undefined ? description : list.description;
        list.items = items !== undefined ? items : list.items;
        list.status = status !== undefined ? status : list.status;
        list.outcome = outcome !== undefined ? outcome : list.outcome;
        list.outcomeRationale = outcomeRationale !== undefined ? outcomeRationale : list.outcomeRationale;
        list.isPublic = isPublic !== undefined ? isPublic : list.isPublic;
        list.notes = notes !== undefined ? notes : list.notes;

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

// @desc    Share a list (generate share token)
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
            // SECURITY FIX: Use crypto.randomBytes instead of Math.random().
            // Math.random() is NOT cryptographically secure — it is predictable.
            // crypto.randomBytes(32) produces a 256-bit cryptographically secure
            // random value, making share tokens practically impossible to guess.
            list.shareToken = crypto.randomBytes(32).toString('hex');
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
    // .lean() — this is a public read-only endpoint. No Mongoose methods needed.
    const list = await List.findOne({ shareToken: req.params.token }).lean();

    if (list && list.isPublic) {
        res.json(list);
    } else {
        res.status(404);
        throw new Error('List not found or not public');
    }
});

// @desc    Duplicate a list
// @route   POST /api/lists/:id/duplicate
// @access  Private
const duplicateList = asyncHandler(async (req, res) => {
    // .lean() on the source read — we only read its properties to build
    // a new list. We never call .save() on this source document.
    const list = await List.findById(req.params.id).lean();

    if (list) {
        if (list.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to duplicate this list');
        }

        const duplicatedList = new List({
            user: req.user._id,
            title: `${list.title} (Copy)`,
            description: list.description,
            items: list.items.map((item) => ({
                title: item.title,
                description: item.description,
                weight: item.weight,
                type: item.type,
                tags: item.tags,
            })),
            status: 'draft',
            outcome: 'undecided',
            outcomeRationale: '',
            isPublic: false,
            shareToken: undefined,
        });

        const createdList = await duplicatedList.save();
        res.status(201).json(createdList);
    } else {
        res.status(404);
        throw new Error('List not found');
    }
});

// @desc    Toggle archive status of a list
// @route   PUT /api/lists/:id/archive
// @access  Private
const toggleArchive = asyncHandler(async (req, res) => {
    const list = await List.findById(req.params.id);

    if (list) {
        if (list.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to modify this list');
        }

        list.archived = !list.archived;
        const updatedList = await list.save();
        res.json(updatedList);
    } else {
        res.status(404);
        throw new Error('List not found');
    }
});

// @desc    Add comment to a list
// @route   POST /api/lists/:id/comments
// @access  Public (shared lists) or Private (owner)
const addComment = asyncHandler(async (req, res) => {
    const { text, authorName, shareToken } = req.body;
    let list;

    if (shareToken) {
        list = await List.findOne({ _id: req.params.id, shareToken, isPublic: true });
        if (!list) {
            res.status(404);
            throw new Error('List not found or not public');
        }
        if (!list.sharePermissions.allowComments) {
            res.status(403);
            throw new Error('Comments are disabled for this list');
        }
    } else if (req.user) {
        list = await List.findById(req.params.id);
        if (!list) {
            res.status(404);
            throw new Error('List not found');
        }
    } else {
        res.status(401);
        throw new Error('Not authorized');
    }

    const comment = {
        text,
        authorName: req.user ? req.user.name : (authorName || 'Anonymous'),
        userId: req.user ? req.user._id : null,
        isOwner: req.user && list.user.toString() === req.user._id.toString(),
    };

    list.comments.push(comment);
    await list.save();

    res.status(201).json(list.comments[list.comments.length - 1]);
});

// @desc    Delete comment from a list
// @route   DELETE /api/lists/:id/comments/:commentId
// @access  Private (owner only)
const deleteComment = asyncHandler(async (req, res) => {
    const list = await List.findById(req.params.id);

    if (!list) {
        res.status(404);
        throw new Error('List not found');
    }

    if (list.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to delete comments');
    }

    list.comments = list.comments.filter(
        (comment) => comment._id.toString() !== req.params.commentId
    );

    await list.save();
    res.json({ message: 'Comment removed' });
});

// @desc    Add or update vote on an item
// @route   POST /api/lists/:id/vote
// @access  Public (shared lists) or Private (owner)
const addVote = asyncHandler(async (req, res) => {
    const { itemId, voteType, shareToken } = req.body;
    let list;
    let voterId;

    if (shareToken) {
        list = await List.findOne({ _id: req.params.id, shareToken, isPublic: true });
        if (!list) {
            res.status(404);
            throw new Error('List not found or not public');
        }
        if (!list.sharePermissions.allowVoting) {
            res.status(403);
            throw new Error('Voting is disabled for this list');
        }
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        voterId = crypto.createHash('sha256').update(ip + itemId).digest('hex');
    } else if (req.user) {
        list = await List.findById(req.params.id);
        if (!list) {
            res.status(404);
            throw new Error('List not found');
        }
        voterId = req.user._id.toString();
    } else {
        res.status(401);
        throw new Error('Not authorized');
    }

    list.votes = list.votes.filter(
        (vote) => !(vote.itemId === itemId && vote.voterId === voterId)
    );

    if (voteType) {
        list.votes.push({ itemId, voterId, voteType });
    }

    await list.save();

    const voteCounts = {};
    list.votes.forEach((vote) => {
        if (!voteCounts[vote.itemId]) {
            voteCounts[vote.itemId] = { up: 0, down: 0 };
        }
        voteCounts[vote.itemId][vote.voteType]++;
    });

    res.json({ voteCounts, userVote: voteType });
});

// @desc    Update share permissions
// @route   PUT /api/lists/:id/permissions
// @access  Private
const updateSharePermissions = asyncHandler(async (req, res) => {
    const { allowComments, allowVoting, requireName, showItemNotes } = req.body;
    const list = await List.findById(req.params.id);

    if (!list) {
        res.status(404);
        throw new Error('List not found');
    }

    if (list.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to update permissions');
    }

    if (allowComments !== undefined) list.sharePermissions.allowComments = allowComments;
    if (allowVoting !== undefined) list.sharePermissions.allowVoting = allowVoting;
    if (requireName !== undefined) list.sharePermissions.requireName = requireName;
    if (showItemNotes !== undefined) list.sharePermissions.showItemNotes = showItemNotes;

    await list.save();
    res.json(list);
});

// @desc    Set or update reminder
// @route   PUT /api/lists/:id/reminder
// @access  Private
const setReminder = asyncHandler(async (req, res) => {
    const { enabled, date, note } = req.body;
    const list = await List.findById(req.params.id);

    if (!list) {
        res.status(404);
        throw new Error('List not found');
    }

    if (list.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to update reminder');
    }

    list.reminder = { enabled, date, note };

    if (enabled) {
        list.timeline.push({
            event: 'reminder_set',
            timestamp: new Date(),
            note: `Reminder set for ${new Date(date).toLocaleDateString()}`,
        });
    }

    await list.save();
    res.json(list);
});

// @desc    Get lists with upcoming reminders
// @route   GET /api/lists/reminders/upcoming
// @access  Private
const getUpcomingReminders = asyncHandler(async (req, res) => {
    // .lean() — pure read, no Mongoose methods needed on results
    const lists = await List.find({
        user: req.user._id,
        'reminder.enabled': true,
        'reminder.date': { $gte: new Date() },
    })
        .sort({ 'reminder.date': 1 })
        .lean();

    res.json(lists);
});

// @desc    Add timeline event
// @route   POST /api/lists/:id/timeline
// @access  Private
const addTimelineEvent = asyncHandler(async (req, res) => {
    const { event, note } = req.body;
    const list = await List.findById(req.params.id);

    if (!list) {
        res.status(404);
        throw new Error('List not found');
    }

    if (list.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to update timeline');
    }

    list.timeline.push({
        event,
        timestamp: new Date(),
        note,
    });

    await list.save();
    res.json(list);
});

module.exports = {
    getLists,
    getListById,
    createList,
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
};

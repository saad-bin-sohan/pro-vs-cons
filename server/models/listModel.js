const mongoose = require('mongoose');

const commentSchema = mongoose.Schema(
    {
        authorName: { type: String, required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        text: { type: String, required: true },
        isOwner: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const voteSchema = mongoose.Schema(
    {
        itemId: { type: String, required: true },
        voterId: { type: String, required: true },
        voteType: { type: String, required: true, enum: ['up', 'down'] },
    },
    { timestamps: true }
);

const itemSchema = mongoose.Schema(
    {
        _id: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String },
        weight: { type: Number, required: true, min: 1, max: 10 },
        type: { type: String, required: true, enum: ['pro', 'con'] },
        tags: [{ type: String }],
    },
    { timestamps: true }
);

const listSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        items: [itemSchema],
        status: {
            type: String,
            required: true,
            default: 'draft',
            enum: ['draft', 'finalized'],
        },
        outcome: {
            type: String,
            default: 'undecided',
            enum: ['yes', 'no', 'undecided'],
        },
        outcomeRationale: {
            type: String,
        },
        notes: {
            type: String,
            default: '',
        },
        isPublic: {
            type: Boolean,
            default: false,
        },
        shareToken: {
            type: String,
        },
        archived: {
            type: Boolean,
            default: false,
        },
        comments: [commentSchema],
        votes: [voteSchema],
        sharePermissions: {
            allowComments: { type: Boolean, default: true },
            allowVoting: { type: Boolean, default: true },
            requireName: { type: Boolean, default: false },
            showItemNotes: { type: Boolean, default: true },
        },
        reminder: {
            enabled: { type: Boolean, default: false },
            date: { type: Date },
            note: { type: String },
        },
        timeline: [
            {
                event: { type: String, required: true },
                timestamp: { type: Date, default: Date.now },
                note: { type: String },
            },
        ],
    },
    {
        timestamps: true,
    }
);

// ============================================================
// INDEXES — Critical for query performance.
// Without these, every query does a full collection scan.
// Mongoose will create these indexes in MongoDB on app startup
// if they do not already exist (idempotent operation).
// ============================================================

// Covers: getLists (filter by user + archived)
listSchema.index({ user: 1, archived: 1 });

// Covers: getLists sort (user's documents sorted by most recently updated)
listSchema.index({ user: 1, updatedAt: -1 });

// Covers: getPublicList (lookup by shareToken)
// sparse: true means only documents where shareToken exists are indexed,
// keeping the index small since most lists won't have a shareToken.
listSchema.index({ shareToken: 1 }, { sparse: true });

// Covers: getUpcomingReminders
listSchema.index({ user: 1, 'reminder.enabled': 1, 'reminder.date': 1 });

const List = mongoose.model('List', listSchema);

module.exports = List;

const mongoose = require('mongoose');

const commentSchema = mongoose.Schema(
    {
        authorName: { type: String, required: true }, // Display name (anonymous or user name)
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional - only for authenticated users
        text: { type: String, required: true },
        isOwner: { type: Boolean, default: false }, // Flag to identify list owner's comments
    },
    { timestamps: true }
);

const voteSchema = mongoose.Schema(
    {
        itemId: { type: String, required: true }, // Reference to item._id
        voterId: { type: String, required: true }, // Hash of IP or user ID
        voteType: { type: String, required: true, enum: ['up', 'down'] },
    },
    { timestamps: true }
);

const itemSchema = mongoose.Schema(
    {
        _id: { type: String, required: true }, // <-- Allow string IDs from frontend
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
        },
        reminder: {
            enabled: { type: Boolean, default: false },
            date: { type: Date },
            note: { type: String },
        },
        timeline: [{
            event: { type: String, required: true }, // 'created', 'updated', 'finalized', 'reopened', 'reminder_set'
            timestamp: { type: Date, default: Date.now },
            note: { type: String },
        }],
    },
    {
        timestamps: true,
    }
);

const List = mongoose.model('List', listSchema);

module.exports = List;

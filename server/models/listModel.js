const mongoose = require('mongoose');

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
    },
    {
        timestamps: true,
    }
);

const List = mongoose.model('List', listSchema);

module.exports = List;

const mongoose = require('mongoose');

const itemSchema = mongoose.Schema(
    {
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
            default: 'draft', // draft, finalized
            enum: ['draft', 'finalized'],
        },
        outcome: {
            type: String,
            default: 'undecided', // yes, no, undecided
            enum: ['yes', 'no', 'undecided'],
        },
        outcomeRationale: {
            type: String,
        },
        isPublic: {
            type: Boolean,
            default: false,
        },
        shareToken: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const List = mongoose.model('List', listSchema);

module.exports = List;

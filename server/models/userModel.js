const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            // Normalize at schema level: belt-and-suspenders alongside
            // controller normalization. Prevents case-variant duplicate
            // accounts if any code path bypasses the controller.
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        theme: {
            type: String,
            default: 'light',
        },
    },
    {
        timestamps: true,
    }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
    // Only hash when password field was actually changed.
    // Without this guard, saving any other field (e.g. theme) would
    // re-hash the already-hashed password, making the account
    // impossible to log into.
    if (!this.isModified('password')) {
        return next();
    }

    // Cost factor: 12 in production on paid infrastructure (fast CPU).
    // 10 on free-tier Render (throttled shared CPU — each extra round
    // doubles the compute time; 12 → ~800ms, 10 → ~200ms on 0.1 vCPU).
    // 8 in test/development for fast test runs.
    // Adjust BCRYPT_ROUNDS in Render env vars when you upgrade tiers.
    const rounds = parseInt(process.env.BCRYPT_ROUNDS, 10) ||
        (process.env.NODE_ENV === 'production' ? 10 : 8);

    const salt = await bcrypt.genSalt(rounds);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;

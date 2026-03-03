import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const scoreSchema = new mongoose.Schema({
    category: { type: String, required: true },
    score: { type: Number, required: true },
    total: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
    time: { type: Number, default: 0 },
    difficulty: { type: String, default: '' },
    date: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    scores: [scoreSchema],
    // Cumulative Statistics
    totalQuizzes: { type: Number, default: 0 },
    totalCorrect: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    streak: { type: Number, default: 0 },
    maxStreak: { type: Number, default: 0 },
    totalTimeSpent: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    bestScore: { type: Number, default: 0 },
    achievements: [{
        id: String,
        name: String,
        description: String,
        icon: String,
        unlockedAt: { type: Date, default: Date.now },
        rarity: String
    }]
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;

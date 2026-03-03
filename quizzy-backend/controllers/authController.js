import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register new user
// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please provide all fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    try {
        const user = await User.create({ username, email, password });
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            totalQuizzes: user.totalQuizzes,
            totalCorrect: user.totalCorrect,
            totalQuestions: user.totalQuestions,
            xp: user.xp,
            level: user.level,
            streak: user.streak,
            maxStreak: user.maxStreak,
            totalTimeSpent: user.totalTimeSpent,
            averageScore: user.averageScore,
            bestScore: user.bestScore,
            achievements: user.achievements,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            totalQuizzes: user.totalQuizzes,
            totalCorrect: user.totalCorrect,
            totalQuestions: user.totalQuestions,
            xp: user.xp,
            level: user.level,
            streak: user.streak,
            maxStreak: user.maxStreak,
            totalTimeSpent: user.totalTimeSpent,
            averageScore: user.averageScore,
            bestScore: user.bestScore,
            achievements: user.achievements,
            token: generateToken(user._id)
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

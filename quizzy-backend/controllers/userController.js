import User from '../models/User.js';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Calculate some stats on the fly
        const totalScores = user.scores.length;
        const averageScore = totalScores > 0
            ? (user.scores.reduce((acc, curr) => acc + curr.score, 0) / totalScores).toFixed(2)
            : 0;

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
            scores: user.scores
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

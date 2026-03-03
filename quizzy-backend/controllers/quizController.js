import User from '../models/User.js';

// @desc    Submit quiz score
// @route   POST /api/quiz/submit-score
// @access  Private
export const submitScore = async (req, res) => {
    const { category, score, total, percentage, time, difficulty } = req.body;

    if (!category || score === undefined) {
        return res.status(400).json({ message: 'Category and score are required' });
    }

    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newScore = {
            category,
            score,
            total: total || 0,
            percentage: percentage || 0,
            time: time || 0,
            difficulty: difficulty || ''
        };

        user.scores.push(newScore);

        // Update cumulative statistics
        user.totalQuizzes += 1;
        user.totalCorrect += score;
        user.totalQuestions += (total || 0);

        const xpEarned = score * 10;
        user.xp += xpEarned;
        user.level = Math.floor(user.xp / 1000) + 1;

        if (percentage === 100) {
            user.streak += 1;
        } else {
            user.streak = 0;
        }
        user.maxStreak = Math.max(user.maxStreak, user.streak);

        user.totalTimeSpent += (time || 0);
        user.averageScore = Math.round(((user.averageScore || 0) * (user.totalQuizzes - 1) + (percentage || 0)) / user.totalQuizzes);
        user.bestScore = Math.max(user.bestScore || 0, (percentage || 0));

        // Basic Achievement Logic (can be expanded)
        if (user.totalQuizzes === 1 && !user.achievements.find(a => a.id === 'first-quiz')) {
            user.achievements.push({
                id: 'first-quiz',
                name: 'First Steps',
                description: 'Complete your first quiz',
                icon: '🎯',
                rarity: 'common'
            });
        }
        if (percentage === 100 && !user.achievements.find(a => a.id === 'perfect-score')) {
            user.achievements.push({
                id: 'perfect-score',
                name: 'Perfectionist',
                description: 'Get 100% on any quiz',
                icon: '⭐',
                rarity: 'epic'
            });
        }

        await user.save();

        res.status(200).json({
            message: 'Score submitted and stats updated',
            score: newScore,
            userStats: {
                xp: user.xp,
                level: user.level,
                streak: user.streak,
                totalQuizzes: user.totalQuizzes,
                achievements: user.achievements
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get leaderboard (top 10 scores)
// @route   GET /api/quiz/leaderboard?category=...
// @access  Public
export const getLeaderboard = async (req, res) => {
    const { category } = req.query;

    try {
        const matchStage = category ? { 'scores.category': category } : {};

        const leaderboard = await User.aggregate([
            { $unwind: '$scores' },
            { $match: matchStage },
            { $sort: { 'scores.score': -1 } },
            { $limit: 10 },
            {
                $project: {
                    username: 1,
                    category: '$scores.category',
                    score: '$scores.score',
                    date: '$scores.date'
                }
            }
        ]);

        res.status(200).json(leaderboard);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get current user's scores
// @route   GET /api/quiz/my-scores
// @access  Private
export const getMyScores = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user.scores);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

import express from 'express';
import { body, validationResult } from 'express-validator';
import { submitScore, getLeaderboard, getMyScores } from '../controllers/quizController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

const validateScore = [
    body('category').notEmpty().withMessage('Category is required'),
    body('score').isNumeric().withMessage('Score must be a number'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

router.post('/submit-score', protect, validateScore, submitScore);
router.get('/leaderboard', getLeaderboard);
router.get('/my-scores', protect, getMyScores);

export default router;

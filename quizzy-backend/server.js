import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ================= DATABASE CONNECTION =================
connectDB().catch(err => {
    console.error('CRITICAL: Initial database connection failed:', err.message);
});

// ================= SECURITY & LOGGING =================
app.use(helmet());
app.use(morgan('dev'));

// ================= CORS CONFIG (PRODUCTION READY) =================
const allowedOrigins = [
    process.env.FRONTEND_URL,      // Production (Vercel)
    'http://localhost:5173',       // Local dev
    'http://localhost:5174',
    'http://localhost:5175'
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {

        // Allow requests with no origin (Postman, mobile apps)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        console.log("❌ Blocked by CORS:", origin);
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));

// Handle preflight automatically
app.options('*', cors());

app.use(express.json());

// ================= HEALTH CHECK =================
app.get('/api/test', (req, res) => {
    res.status(200).json({
        message: "Backend working",
        status: "OK",
        timestamp: new Date().toISOString()
    });
});

// ================= RATE LIMITING =================
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});

app.use('/api', limiter);

// ================= ROUTES =================
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/users', userRoutes);

// ================= 404 HANDLER =================
app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
    console.error('Server Internal Error:', err);

    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

// ================= SERVER START =================
const server = app.listen(PORT, () => {
    console.log('--------------------------------------------------');
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode`);
    console.log(`📡 Port: ${PORT}`);
    console.log('--------------------------------------------------');
});

// Handle startup errors
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Error: Port ${PORT} is already in use.`);
    } else {
        console.error('❌ Server startup error:', err.message);
    }
});
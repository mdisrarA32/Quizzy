import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

dotenv.config();

const users = [
    {
        username: 'QuizMaster',
        email: 'master@example.com',
        password: 'password123',
        scores: [
            { category: 'Science', score: 95 },
            { category: 'History', score: 88 }
        ]
    },
    {
        username: 'TriviaExpert',
        email: 'expert@example.com',
        password: 'password123',
        scores: [
            { category: 'Geograpy', score: 92 },
            { category: 'Science', score: 85 }
        ]
    },
    {
        username: 'QuickThinker',
        email: 'quick@example.com',
        password: 'password123',
        scores: [
            { category: 'Sports', score: 98 },
            { category: 'General', score: 90 }
        ]
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await User.deleteMany({});
        console.log('Cleared existing users');

        // Hash passwords and save users
        for (let u of users) {
            const salt = await bcrypt.genSalt(10);
            u.password = await bcrypt.hash(u.password, salt);
            await User.create(u);
        }

        console.log('Database seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDB();

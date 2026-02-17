
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config();

import connectDB from './config/db';
import userRoutes from './routes/userRoutes';
import resourceRoutes from './routes/resourceRoutes';
import { createComment, getComments } from './controllers/commentController';
import { protect } from './middleware/authMiddleware';

// Connect to database
connectDB();

const app = express();

app.use(cors());
app.options(/.*/, cors()); // Enable pre-flight for all routes
app.use(morgan('dev'));
app.use(express.json());

// Debug logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});

// Mount routers
app.use('/api/users', userRoutes);
app.use('/api/resources', resourceRoutes);

app.get('/api/version', (req, res) => res.send('1.1'));

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const PORT = process.env.PORT;

if (!PORT) {
    throw new Error('PORT must be defined in .env');
}

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Routes mounted. Accessing /api/resources should work.`);
});

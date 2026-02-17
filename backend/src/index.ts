
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

// Connect to database
connectDB();

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Mount routers
app.use('/api/users', userRoutes);
app.use('/api/resources', resourceRoutes);

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
});

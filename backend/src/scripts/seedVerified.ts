
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/userModel';

dotenv.config();

const verifyAllUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log('MongoDB Connected');

        const result = await User.updateMany(
            {},
            { $set: { isVerified: true } }
        );

        console.log(`Updated ${result.modifiedCount} users to verified.`);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

verifyAllUsers();

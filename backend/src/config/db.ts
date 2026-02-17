
import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            console.error('❌ MONGO_URI is NOT defined in environment variables.');
            throw new Error('MONGO_URI must be defined');
        }

        console.log(`Resource: Attempting to connect to MongoDB...`);

        // Listen for events
        mongoose.connection.on('connected', () => console.log('✅ MongoDB Event: Connected'));
        mongoose.connection.on('error', (err) => console.error('❌ MongoDB Event: Error', err));
        mongoose.connection.on('disconnected', () => console.log('⚠️ MongoDB Event: Disconnected'));

        const conn = await mongoose.connect(uri);

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        if (error instanceof Error) {
            console.error(`❌ Connection Error: ${error.message}`);
        } else {
            console.error(`❌ Connection Error: ${String(error)}`);
        }
        process.exit(1);
    }
};

export default connectDB;

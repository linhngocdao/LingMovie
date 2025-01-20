import mongoose from 'mongoose';
import 'dotenv/config';

const connectMongo = async (): Promise<void> => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.MONGODB_URI!, {
      maxPoolSize: 100
    });
    console.log('\x1b[1;42m Info \x1b[0m', 'MongoDB:', 'Connected to database');
  } catch (error) {
    console.log('\x1b[1;41m Error \x1b[0m', 'Failed to connect to Mongo');
    process.exit(1);
  }
};

export default connectMongo;

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const dbOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
} as const;

const handleMongoEvents = () => {
  const { connection } = mongoose;

  connection
    .on('connected', () => console.log('✅ MongoDB đã kết nối thành công'))
    .on('error', (err) => console.error('❌ Lỗi MongoDB:', err))
    .on('disconnected', () => console.log('🔌 MongoDB đã ngắt kết nối'));
};

// Hàm kết nối database
const connectDatabase = async (): Promise<void> => {
  try {
    handleMongoEvents();
    await mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://linhdaongoc22:MTZeQIXrJwhFQtuP@ophim.zgutl.mongodb.net/?retryWrites=true&w=majority&appName=Ophim", dbOptions);
  } catch (error) {
    console.error('❌ Lỗi kết nối MongoDB:', error);
    process.exit(1);
  }
};

export default connectDatabase;

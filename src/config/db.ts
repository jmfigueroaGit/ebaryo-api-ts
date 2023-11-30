import mongoose from 'mongoose';
import clc from 'cli-color';

const connectDB = async (): Promise<void> => {
	try {
		const mongoURI: string | undefined = process.env.MONGO_URI;

		if (!mongoURI) {
			throw new Error('MongoDB URI is not provided');
		}

		await mongoose.connect(mongoURI);

		console.log(clc.cyan.underline('MongoDB connected'));
	} catch (error) {
		console.error(clc.red.bold('MongoDB connection error:', error));
		process.exit(1); // Exit with failure
	}
};

export default connectDB;

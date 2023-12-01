import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User, { UserDocument } from '../models/User'; // Update the path accordingly
import { InputError, ValidationError } from './error_handler'; // Update the path accordingly

const generateToken = (id: string): string => {
	const token = jwt.sign({ userId: id }, process.env.JWT_SECRET as string, {
		expiresIn: process.env.JWT_EXPIRE as string,
	});

	return token;
};

const decoded = async (tokenObj: {
	value: string;
}): Promise<UserDocument | null> => {
	try {
		const decodedToken = jwt.verify(
			tokenObj.value,
			process.env.JWT_SECRET as string
		) as { userId: string };

		const user = await User.findById(decodedToken.userId);

		return user;
	} catch (error) {
		// Handle token verification error
		console.error('Token verification error:', error);
		return null;
	}
};

const generateDefaultPassword = (defaultString: string): string => {
	try {
		if (!defaultString || typeof defaultString !== 'string') {
			throw new InputError('Invalid input. Please provide a valid string.');
		}

		const token = crypto.randomBytes(20).toString('hex');
		const hashedToken = crypto
			.createHash('sha256')
			.update(defaultString + token)
			.digest('hex');

		return hashedToken;
	} catch (error: any) {
		throw new ValidationError(`Token generation error: ${error.message}`);
	}
};

export { generateToken, decoded, generateDefaultPassword };

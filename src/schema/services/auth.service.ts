import { YogaInitialContext } from 'graphql-yoga';
import User from '../../models/User';
import {
	ForbiddenError,
	InputError,
	NotFoundError,
	ValidationError,
} from '../../utils/error_handler';
import {
	generateDefaultPassword,
	generateToken,
} from '../../utils/generate_token';
import extractUsernameFromEmail from '../../utils/extract_email';
import { sendEmail } from '../../utils/send_mail';
import crypto from 'crypto';

// @desc    Login User
// @access  Public
export const loginUser = async (args: any, context: any) => {
	const { email, password } = args;

	const user = await User.findOne({ email }).select('+password');

	if (user && (await user.comparePassword(password))) {
		const token = generateToken(user._id);

		context.request.cookieStore?.set('auth-token', token);

		return { user, token };
	} else throw new ValidationError('Email or Password is incorrect');
};

// @desc    Register Email
// @access  Public
export const registerEmail = async (args: any, context: any) => {
	const { email } = args;

	const emailExisted = await User.findOne({ email });

	if (emailExisted) {
		throw new InputError('Email is already used.');
	}

	const password = generateDefaultPassword(email);
	const username = extractUsernameFromEmail(email);

	const user = await User.create({
		email,
		password,
		username,
	});

	// Generate reset token
	const resetToken = user.getResetPasswordToken();

	await user.save({ validateBeforeSave: true });

	const subject = 'E-baryo Verification Email';
	const message = `E-baryo Verification Message ${resetToken}`;
	try {
		let emailRecipient: string;

		if (user && user.email) {
			emailRecipient = user.email;
		} else {
			throw new Error('User email is required.');
		}

		await sendEmail({
			email: emailRecipient,
			subject: subject || 'E-baryo Verify Email',
			message: message || `E-baryo Verification Message`,
		});

		return { message: `Email sent to ${user.email}` };
	} catch (error: any) {
		user.resetPasswordToken = '';
		user.resetPasswordExpire = new Date();

		await user.save({ validateBeforeSave: false });

		throw new ValidationError(error.message);
	}
};

// @desc    Verify Token
// @access  Private
export const verifyResetToken = async (args: any) => {
	const { token } = args;

	// Hash URL Token
	const resetPasswordToken = crypto
		.createHash('sha256')
		.update(args.token)
		.digest('hex');

	const user = await User.findOne({
		resetPasswordToken,
		resetPasswordExpire: { $gt: Date.now() },
	});

	if (!user) {
		throw new ForbiddenError(
			'Password reset token in invalid or has been expired'
		);
	}

	return { message: 'Valid token' };
};

// @desc   	Reset Password
// @access  Private
export const resetPassword = async (args: any) => {
	// Hash URL Token
	const resetPasswordToken = crypto
		.createHash('sha256')
		.update(args.token)
		.digest('hex');

	const user = await User.findOne({
		resetPasswordToken,
		resetPasswordExpire: { $gt: Date.now() },
	});

	if (!user) {
		throw new ForbiddenError(
			'Password reset token in invalid or has been expired'
		);
	}

	if (args.password !== args.confirmPassword) {
		throw new InputError('Password doet not match');
	}

	// Setup the new password
	user.password = args.password;
	user.resetPasswordToken = '';
	user.resetPasswordExpire = new Date();

	await user.save();

	return { message: 'Password Updated Successfully' };
};

// @desc   	Send Reset Token to Email
// @access  Public
export const forgotPassword = async (args: any) => {
	const { email } = args;

	const user = await User.findOne({ email });

	if (!user) {
		throw new NotFoundError(`User not found with this email`);
	}

	// Generate reset token
	const resetToken = user.getResetPasswordToken();

	await user.save({ validateBeforeSave: true });

	const message = resetToken;

	try {
		await sendEmail({
			email: user.email,
			subject: 'E-baryo Verify Email',
			message,
		});

		return { message: `Email sent to ${user.email}` };
	} catch (error: any) {
		user.resetPasswordToken = '';
		user.resetPasswordExpire = new Date();

		await user.save({ validateBeforeSave: false });
		throw new ValidationError(error.message);
	}
};

// @desc     Get current logged in user
// @access  Private
export const getMe = async (args: any, context: any) => {
	const { user } = context;
	return user;
};

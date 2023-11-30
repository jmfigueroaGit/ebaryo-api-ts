import mongoose, { Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import crypto from 'crypto';

export interface UserDocument extends Document {
	username: string;
	email: string;
	password: string;
	verified: boolean;
	isCompleted: boolean;
	role: number;
	notification: boolean;
	resetPasswordToken: string;
	resetPasswordExpire: Date;

	comparePassword(enteredPassword: string): Promise<boolean>;
	getResetPasswordToken(): string;
}

const userSchema = new mongoose.Schema<UserDocument>(
	{
		username: {
			type: String,
			required: [true, 'Username field is required'],
			unique: true,
		},
		email: {
			type: String,
			required: [true, 'Email field is required'],
			validate: {
				validator: (value: string) => validator.isEmail(value),
				message: 'Please enter a valid email address',
			},
			unique: true,
		},
		password: {
			type: String,
			required: [true, 'Password field is required'],
			select: false,
		},
		verified: {
			type: Boolean,
			default: false,
		},
		isCompleted: {
			type: Boolean,
			default: false,
		},
		role: {
			type: Number,
			default: 5,
		},
		notification: {
			type: Boolean,
			default: false,
		},
		resetPasswordToken: String,
		resetPasswordExpire: Date,
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

userSchema.methods.comparePassword = async function (
	enteredPassword: string
): Promise<boolean> {
	return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre<UserDocument>('save', async function (next) {
	if (!this.isModified('password')) {
		next();
	}

	const salt = bcrypt.genSaltSync(10);
	this.password = await bcrypt.hashSync(this.password, salt);
});

userSchema.methods.getResetPasswordToken = function (): string {
	const resetToken = crypto.randomBytes(20).toString('hex');

	this.resetPasswordToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex');

	const currentTime = Date.now();
	const twoDaysInMilliseconds = 2 * 24 * 60 * 60 * 1000;

	this.resetPasswordExpire = new Date(currentTime + twoDaysInMilliseconds);
	return resetToken;
};

const User: Model<UserDocument> = mongoose.model('User', userSchema);

export default User;

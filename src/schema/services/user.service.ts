import bcrypt from 'bcryptjs';
import User from '../../models/User';
import {
	InputError,
	NotFoundError,
	ValidationError,
} from '../../utils/error_handler';

// @desc    Get All Users
// @access  Private || Admin
export const getAllUsers = async () => {
	const users = await User.find();

	return users;
};

// @desc    Get Single User
// @access  Private || Admin
export const getSingleUser = async (args: Record<string, any>) => {
	const user = await User.findById(args.id);

	if (user) return user;
	else throw new NotFoundError('User not found with this id');
};

// @desc    Create User
// @access  Private || Admin
export const createUser = async (args: Record<string, any>) => {
	const { username, email, password, role } = args;

	const usernameExist = await User.findOne({ username });
	const emailExist = await User.findOne({ email });

	if (usernameExist) throw new ValidationError('Username is already used');
	if (emailExist) throw new ValidationError('Email is already used');

	const user = await User.create({
		username,
		email,
		password,
		role,
	});

	if (user) return user;
	else throw new InputError('Invalid data input');
};

// @desc    Update Single User
// @access  Private || Admin
export const updateUser = async (args: Record<string, any>) => {
	const { id, username, email, password, role, verified } = args;

	const user = await User.findById(id).select('+password');

	if (!user) throw new NotFoundError('User not found with this id');

	const salt = bcrypt.genSaltSync(10);
	let modifiedPassword;

	if (password) {
		modifiedPassword = bcrypt.hashSync(password, salt);
	}

	const updatedData = {
		username: username || user.username,
		email: email || user.email,
		password: modifiedPassword || user.password,
		role: role || user.role,
		verified: verified || user.verified,
	};

	const updatedUser = await User.findByIdAndUpdate(user._id, updatedData, {
		new: true,
	}).select('+password');

	return updatedUser;
};

// @desc    Delete Single User
// @access  Private || Admin
export const deleteUser = async (args: Record<string, any>) => {
	const { id } = args;

	const user = await User.findById(id);

	if (!user) throw new NotFoundError('User not found with this id');

	await User.findByIdAndDelete(user._id);

	return { message: 'User removed' };
};

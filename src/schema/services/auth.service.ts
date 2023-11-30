import { YogaInitialContext } from 'graphql-yoga';
import User from '../../models/User';
import { ValidationError } from '../../utils/error_handler';
import { generateToken } from '../../utils/generate_token';

// @desc    Login User
// @access  Public
export const loginUser = async (args: any, context: YogaInitialContext) => {
	const { email, password } = args;

	const user = await User.findOne({ email }).select('+password');

	if (user && (await user.comparePassword(password))) {
		const token = generateToken(user._id);

		context.request.cookieStore?.set('auth-token', token);

		return { user, token };
	} else throw new ValidationError('Email or Password is incorrect');
};

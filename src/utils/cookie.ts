import { decoded } from '../utils/generate_token';

export const GetCookie = async (
	resolve: any,
	parent: any,
	args: any,
	context: any,
	info: any
) => {
	let user = null;
	const token = await context.request.cookieStore?.get('auth-token');

	if (token) {
		try {
			// Verify and decode the token
			user = await decoded(token);
			context.user = user;
		} catch (error: any) {
			// Handle specific types of token errors
			if (error.name === 'TokenExpiredError') {
				throw new Error('Your session has expired. Please log in again.');
			} else if (error.name === 'JsonWebTokenError') {
				throw new Error('Invalid token. Please log in again.');
			} else {
				// Handle other kinds of unexpected errors
				throw new Error('Authentication error.');
			}
		}
	}

	// Proceed with the execution of the resolver chain
	const result = await resolve(parent, args, context, info);

	return result;
};

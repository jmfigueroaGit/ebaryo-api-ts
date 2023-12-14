import jwt from 'jsonwebtoken';
// import Barangay from '../models/barangay_model';
import {
	AuthenticationError,
	ForbiddenError,
	InputError,
	NotFoundError,
} from '../utils/error_handler';
import Barangay from '../models/Barangay';

interface ResolverFunction {
	(parent: any, args: any, context: any, info: any): any;
}

// Authentication Middleware
const isAuthenticated = (resolver: ResolverFunction) => {
	return (parent: any, args: any, context: any, info: any) => {
		if (!context.user) {
			throw new AuthenticationError('You must be authenticated!');
		}
		return resolver(parent, args, context, info);
	};
};

// Authorization Middleware
const requiresRole = (allowedRoles: number[]) => {
	return (resolver: ResolverFunction) => {
		return (parent: any, args: any, context: any, info: any) => {
			if (!allowedRoles.includes(context.user.role)) {
				throw new ForbiddenError('You do not have the required permissions!');
			}

			return resolver(parent, args, context, info);
		};
	};
};

// Check user is included to barangay admins
export const isUserIncluded = (resolver: ResolverFunction) => {
	return async (parent: any, args: any, context: any, info: any) => {
		const { user } = context;
		const { barangayId } = args;

		if (!barangayId || !user) {
			throw new InputError('Barangay ID or User ID is missing in the request!');
		}

		try {
			const barangay = await Barangay.findById(barangayId);

			if (!barangay) {
				throw new NotFoundError('Barangay not found!');
			}

			// Check if userId exists in adminIds array of Barangay
			if (!barangay.adminIds.includes(user._id)) {
				throw new ForbiddenError('User does not have access to this Barangay!');
			}

			return resolver(parent, args, context, info);
		} catch (error) {
			throw new ForbiddenError('Access denied!'); // You can customize the error message here
		}
	};
};

export { isAuthenticated, requiresRole };

import jwt from 'jsonwebtoken';
// import Barangay from '../models/barangay_model';
import {
	AuthenticationError,
	ForbiddenError,
	NotFoundError,
} from '../utils/error_handler';

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

// Function to check if a barangay exists
// const isBarangayExists = async (barangayId: string) => {
//   const barangay = await Barangay.findById(barangayId);

//   if (!barangay) {
//     throw new NotFoundError('Barangay does not exist');
//   }

//   return barangay;
// };

// Authorization for barangay security
// const isAdminInclude = async (user: any, barangayId: string) => {
//   const barangay = await Barangay.findById(barangayId);

//   if (!barangay) {
//     throw new NotFoundError('Barangay not found with this id');
//   }

//   if (user.role !== 1 && !barangay.adminIds.includes(user._id)) {
//     throw new ForbiddenError('You do not have the required permissions!');
//   }

//   return barangay;
// };

export {
	isAuthenticated,
	requiresRole,
	//   isBarangayExists,
	//   isAdminInclude,
};

import {
	createUser,
	deleteUser,
	getAllUsers,
	getSingleUser,
	updateUser,
} from '../services/user.service';

export const usersResolver = {
	Query: {
		users: (_: any, _args: any, context: any) => {
			return getAllUsers();
		},
		user: (_: any, _args: any, context: any) => {
			return getSingleUser(_args);
		},
	},
	Mutation: {
		user_create: (_: any, _args: any, context: any) => {
			return createUser(_args);
		},
		user_update: (_: any, _args: any, context: any) => {
			return updateUser(_args);
		},
		user_delete: (_: any, _args: any, context: any) => {
			return deleteUser(_args);
		},
	},
};

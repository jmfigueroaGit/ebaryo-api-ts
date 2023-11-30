import { loginUser } from '../services/auth.service';

export const authResolver = {
	Query: {},
	Mutation: {
		auth_login: (_: any, _args: any, context: any) => {
			return loginUser(_args, context);
		},
	},
};

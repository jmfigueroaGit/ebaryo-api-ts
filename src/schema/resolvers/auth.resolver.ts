import { isAuthenticated } from '../../middlewares/auth_middleware';
import {
	forgotPassword,
	getMe,
	loginUser,
	registerEmail,
	resetPassword,
	verifyResetToken,
} from '../services/auth.service';

export const authResolver = {
	Query: {
		auth_getMe: isAuthenticated((_: any, _args: any, context: any) => {
			return getMe(_args, context);
		}),
	},
	Mutation: {
		auth_login: (_: any, _args: any, context: any) => {
			return loginUser(_args, context);
		},
		auth_verify: (_: any, _args: any, context: any) => {
			return registerEmail(_args, context);
		},
		auth_verify_token: (_: any, _args: any, context: any) => {
			return verifyResetToken(_args);
		},
		auth_reset_password: (_: any, _args: any, context: any) => {
			return resetPassword(_args);
		},
		auth_forgot_password: (_: any, _args: any, context: any) => {
			return forgotPassword(_args);
		},
	},
};

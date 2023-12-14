import {
	isAuthenticated,
	requiresRole,
} from '../../middlewares/auth_middleware';
import {
	getBarangayResidents,
	getResident,
	createResident,
	updateResident,
	deleteResident,
} from '../services/resident.service';

export const residentResolver = {
	Query: {
		residents: isAuthenticated(
			requiresRole([1, 2])((_: any, _args: any, context: any) => {
				return getBarangayResidents(_args, context);
			})
		),
		resident: isAuthenticated(
			requiresRole([1, 2])((_: any, _args: any, context: any) => {
				return getResident(_args, context);
			})
		),
	},
	Mutation: {
		resident_create: isAuthenticated((_: any, _args: any, context: any) => {
			return createResident(_args, context);
		}),
		resident_update: isAuthenticated((_: any, _args: any, context: any) => {
			return updateResident(_args, context);
		}),
		resident_delete: isAuthenticated(
			requiresRole([1, 2])((_: any, _args: any, context: any) => {
				return deleteResident(_args);
			})
		),
	},
};

import {
	isAuthenticated,
	isUserIncluded,
	requiresRole,
} from '../../middlewares/auth_middleware';
import {
	createBarangay,
	deleteBarangay,
	getAllBarangays,
	getSingleBarangay,
	updateBarangayAdmins,
	updateBarangayImages,
	updateBarangayOfficial,
} from '../services/barangay.service';

export const barangayResolver = {
	Query: {
		barangays: (_: any, _args: any, context: any) => {
			return getAllBarangays(_args);
		},
		barangay: (_: any, _args: any, context: any) => {
			return getSingleBarangay(_args);
		},
	},
	Mutation: {
		barangay_create: isAuthenticated(
			requiresRole([1, 2])((_: any, _args: any, context: any) => {
				return createBarangay(_args, context);
			})
		),
		barangay_officials_update: isAuthenticated(
			requiresRole([1, 2])(
				isUserIncluded((_: any, _args: any, context: any) => {
					return updateBarangayOfficial(_args);
				})
			)
		),
		barangay_images_update: isAuthenticated(
			requiresRole([1, 2])(
				isUserIncluded((_: any, _args: any, context: any) => {
					return updateBarangayImages(_args);
				})
			)
		),
		barangay_adminIds_update: isAuthenticated(
			requiresRole([1, 2])(
				isUserIncluded((_: any, _args: any, context: any) => {
					return updateBarangayAdmins(_args, context);
				})
			)
		),
		barangay_delete: isAuthenticated(
			requiresRole([1, 2])(
				isUserIncluded((_: any, _args: any, context: any) => {
					return deleteBarangay(_args);
				})
			)
		),
	},
};

import {
	isAuthenticated,
	requiresRole,
} from '../../middlewares/auth_middleware';
import {
	createBarangay,
	deleteBarangay,
	getAllBarangays,
	getSingleBarangay,
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
		barangay_create: (_: any, _args: any, context: any) => {
			return createBarangay(_args);
		},
		barangay_officials_update: (_: any, _args: any, context: any) => {
			return updateBarangayOfficial(_args);
		},
		barangay_images_update: (_: any, _args: any, context: any) => {
			return updateBarangayImages(_args);
		},
		barangay_delete: (_: any, _args: any, context: any) => {
			return deleteBarangay(_args);
		},
	},
};

import {
	InputError,
	NotFoundError,
	ValidationError,
	ForbiddenError,
} from './../../utils/error_handler';

import Barangay from '../../models/Barangay';
// import { isAdminInclude } from '../../middlewares/auth_middleware';

// @desc    Get All Barangay
// @access  Private || Admin
export const getAllBarangays = async (args: any) => {
	const barangays = await Barangay.find();

	return barangays;
};

// @desc    Get Single Barangay
// @access  Private || Admin
export const getSingleBarangay = async (args: any) => {
	const { barangayId } = args;

	const barangay = await Barangay.findById(barangayId);

	if (!barangay) {
		throw new NotFoundError('Barangay not found with this id');
	}

	return barangay;
};

// @desc    Create Barangay
// @access  Private || Admin
export const createBarangay = async (args: any, context: any) => {
	const { name, barangayInfo } = args.input;
	const { user } = context;

	const nameExist = await Barangay.findOne({ name });

	if (nameExist) {
		throw new ValidationError('Barangay Name is already used');
	}

	const newBarangay = await Barangay.create({
		name,
		barangayInfo,
		adminIds: [user._id],
	});

	return newBarangay;
};

// @desc    Update Barangay Officials Info
// @access  Private || Admin
export const updateBarangayOfficial = async (args: any) => {
	const { barangayId, input } = args;
	const barangay = await Barangay.findById(barangayId);

	if (!barangay) throw new NotFoundError('Barangay not found with this id');

	barangay.barangayOfficials = input;

	await barangay.save();

	return { message: 'Barangay details updated' };
};

// @desc    Update Barangay Images
// @access  Private || Admin
export const updateBarangayImages = async (args: any) => {
	const { barangayId, images } = args;
	const barangay = await Barangay.findById(barangayId);

	if (!barangay) throw new NotFoundError('Barangay not found with this id');

	barangay.images = images;

	await barangay.save();

	return { message: 'Barangay details updated' };
};

// @desc    Update Barangay Images
// @access  Private || Admin
export const updateBarangayAdmins = async (args: any, context: any) => {
	const { barangayId, adminIds } = args;
	const barangay = await Barangay.findById(barangayId);

	if (!barangay) throw new NotFoundError('Barangay not found with this id');

	// Check if the userId already exists in adminIds array
	if (barangay.adminIds.includes(adminIds)) {
		throw new InputError('User ID already exists in adminIds');
	}

	// Add the userId to the adminIds array and save the document
	barangay.adminIds.push(adminIds);
	await barangay.save();

	return { message: 'Barangay admins updated' };
};

// @desc    Delete Barangay
// @access  Private || Admin
export const deleteBarangay = async (args: any) => {
	const { barangayId } = args;

	const barangay = await Barangay.findById(barangayId);

	if (!barangay) throw new NotFoundError('Barangay not found with this id');

	await Barangay.findByIdAndDelete(barangay._id);

	return { message: 'Barangay removed' };
};

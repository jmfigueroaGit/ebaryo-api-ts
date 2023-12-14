import Resident from '../../models/Resident';
import User from '../../models/User';
import Barangay from '../../models/Barangay';
import {
	InputError,
	NotFoundError,
	ValidationError,
} from '../../utils/error_handler';

// @desc    Get All Barangay Residents
// @access  Private || Admin
export const getBarangayResidents = async (
	args: Record<string, any>,
	context: any
) => {
	const residents = await Resident.find();

	return residents;
};

// @desc    Get Single Resident
// @access  Private || Admin
export const getResident = async (args: Record<string, any>, context: any) => {
	const resident = await Resident.findById(args.id);

	return resident;
};

// @desc    Create Resident
// @access  Private || Admin
export const createResident = async (
	args: Record<string, any>,
	context: any
) => {
	const { user } = context;
	const {
		name,
		sex,
		birthday,
		civilStatus,
		nationality,
		contactNumber,
		contactPerson,
		address,
		background,
		image_url,
	} = args;
	const { barangay } = address;
	// Find phone number in the Resident's database
	const contactExist = await Resident.findOne({ contactNumber });
	const barangayExist = await Barangay.findById(barangay);
	const residentExist = await Resident.findOne({ user: user.id });

	if (residentExist)
		throw new ValidationError(
			'Resident is already exist with this current logged in user'
		);

	// Check barangay if already existed
	if (!barangayExist)
		throw new NotFoundError('Barangay not found with this id');

	// Check phone number if already existed
	if (contactExist) throw new ValidationError('Phone number is already used.');

	const resident = await Resident.create({
		user,
		name,
		sex,
		birthday,
		civilStatus,
		nationality,
		contactNumber,
		email: user.email,
		contactPerson,
		address,
		background,
		image_url,
	});

	if (!resident) throw new InputError('Invalid data input');

	const findUser = await User.findById(user._id);

	if (!findUser) throw new NotFoundError('User not found');

	findUser.isCompleted = true;
	await findUser.save({ validateBeforeSave: true });
	console.log(resident);
	return { message: 'Nice' };
};

// @desc    Update Single Resident
// @access  Private || Admin
export const updateResident = async (
	args: Record<string, any>,
	context: any
) => {
	const { user } = context;
	const resident = await Resident.findById(user.id);

	if (!resident) throw new NotFoundError('Resident not found with this id');

	// Name
	resident.name.first = args.name.first || resident.name.first;
	resident.name.middle = args.name.middle || resident.name.middle;
	resident.name.last = args.name.last || resident.name.last;
	resident.name.extension = args.name.extension || resident.name.extension;
	// Info
	resident.sex = args.sex || resident.sex;
	resident.birthday = args.birthday || resident.birthday;
	resident.civilStatus = args.civilStatus || resident.civilStatus;
	resident.nationality = args.nationality || resident.nationality;
	resident.contactNumber = args.contactNumber || resident.contactNumber;
	// Contact Person
	resident.contactPerson.name =
		args.contactPerson.name || resident.contactPerson.name;
	resident.contactPerson.contactNumber =
		args.contactPerson.contactNumber || resident.contactPerson.contactNumber;
	resident.contactPerson.relationship =
		args.contactPerson.relationship || resident.contactPerson.relationship;
	resident.contactPerson.address =
		args.contactPerson.address || resident.contactPerson.address;
	// Background
	resident.background.employment =
		args.background.employment || resident.background.employment;
	resident.background.highEduAttainment =
		args.background.highEduAttainment || resident.background.highEduAttainment;
	resident.background.isSeniorCitizen =
		args.background.isSeniorCitizen || resident.background.isSeniorCitizen;
	resident.background.isPWD =
		args.background.isPWD || resident.background.isPWD;
	resident.background.isSingleParent =
		args.background.isSingleParent || resident.background.isSingleParent;
	resident.background.isStudent =
		args.background.isStudent || resident.background.isStudent;
	resident.background.residencyLength =
		args.background.residencyLength || resident.background.residencyLength;
	// Other
	resident.image_url = args.image_url || resident.image_url;

	const updatedResident = await resident.save();

	return updatedResident.populate('barangay');
};

// @desc    Delete Single Resident
// @access  Private || Admin
export const deleteResident = async (args: Record<string, any>) => {
	const { id } = args;
	const resident = await Resident.findById(id);
	if (!resident) throw new NotFoundError('Resident not found with this id');

	await Resident.findByIdAndDelete(resident._id);

	return { message: 'Resident removed' };
};

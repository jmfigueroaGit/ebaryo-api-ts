import mongoose, { Schema, Document, Model, model } from 'mongoose';
import slugify from 'slugify';

interface Name {
	first: string;
	middle?: string;
	last: string;
	extension?: string;
}

interface ContactPerson {
	name: string;
	contactNumber?: string;
	relationship: string;
	address?: string;
}

interface Address {
	houseNumber: string;
	street: string;
	barangay: string;
	region: string;
	city: string;
	zipcode: string;
}

interface Background {
	employment: string;
	highEduAttainment: string;
	isSeniorCitizen: boolean;
	isPWD: boolean;
	isSingleParent: boolean;
	isStudent: boolean;
	residencyLength: number;
}

interface ResidentModel extends Document {
	user: mongoose.Types.ObjectId;
	barangay?: mongoose.Types.ObjectId;
	name: Name;
	sex: string;
	birthday: string;
	civilStatus: string;
	nationality: string;
	contactNumber: string;
	email: string;
	contactPerson: ContactPerson;
	slug: string;
	address: Address;
	background: Background;
	image_url?: string;
}

const residentSchema: Schema<ResidentModel> = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		barangay: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Barangay',
		},
		name: {
			first: {
				type: String,
				required: true,
			},
			middle: {
				type: String,
			},
			last: {
				type: String,
				required: true,
			},
			extension: {
				type: String,
			},
		},
		sex: {
			type: String,
			required: [true, 'Sex field is required'],
			enum: ['male', 'female'],
		},
		birthday: {
			type: String,
			required: [true, 'Birthday field is required'],
		},
		civilStatus: {
			type: String,
			required: [true, 'Civil Status is required'],
			default: 'single',
		},
		nationality: {
			type: String,
			required: [true, 'Nationality field is required'],
		},
		contactNumber: {
			type: String,
			required: [true, 'Contact number field is required'],
		},
		email: {
			type: String,
			required: [true, 'Email field is required'],
		},
		contactPerson: {
			name: {
				type: String,
				required: true,
			},
			contactNumber: {
				type: String,
			},
			relationship: {
				type: String,
				required: true,
			},
			address: {
				type: String,
			},
		},
		slug: {
			type: String,
			unique: true,
		},
		address: {
			houseNumber: { type: String, required: true },
			street: { type: String, required: true },
			barangay: { type: String, required: true },
			region: { type: String, required: true },
			city: { type: String, required: true },
			zipcode: { type: String, required: true },
		},
		background: {
			employment: {
				type: String,
				default: 'none',
			},
			highEduAttainment: {
				type: String,
				default: 'none',
			},
			isSeniorCitizen: {
				type: Boolean,
				default: false,
			},
			isPWD: {
				type: Boolean,
				default: false,
			},
			isSingleParent: {
				type: Boolean,
				default: false,
			},
			isStudent: {
				type: Boolean,
				default: false,
			},
			residencyLength: {
				type: Number,
				default: 1,
			},
		},
		image_url: String,
	},
	{
		timestamps: true,
	}
);

residentSchema.pre<ResidentModel>('save', async function (next) {
	let fullName = `${this.name.first} ${this.name.middle || ''} ${
		this.name.last
	} ${this.name.extension || ''}`;

	this.slug = slugify(fullName, { lower: true, strict: true });

	const ResidentModel = this.model('Resident') as Model<ResidentModel>; // Access the model

	let slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
	try {
		const docs = await ResidentModel.find({ slug: slugRegEx }); // Use the model to perform find
		if (docs.length) {
			this.slug = `${this.slug}-${docs.length + 1}`;
		}
		next();
	} catch (err: any) {
		next(err);
	}
});

const Resident: Model<ResidentModel> = model<ResidentModel>(
	'Resident',
	residentSchema
);

export default Resident;

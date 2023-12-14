import mongoose, { Document, Model, Schema } from 'mongoose';

interface Location {
	houseNumber: string;
	street: string;
	barangay: string;
	province: string;
	city: string;
	zipcode: string;
}

interface Contact {
	hotline: string;
	email: string;
}

interface Demographic {
	residents: number;
	families: number;
	households: number;
	landAreas: number;
	streets: number;
	healthCenters: number;
	schools: number;
	seniorCitizen: number;
	pwd: number;
	singleParent: number;
}

interface BarangayInfo extends Document {
	location: Location;
	contact: Contact;
	demographic: Demographic;
}

interface Official extends Document {
	name: string;
	position: string;
	image: string;
}

interface BarangayOfficials extends Document {
	barangayOfficials: Official[];
	skOfficials: Official[];
}

interface Image extends Document {
	public_id: string;
	url: string;
}

interface Barangay extends Document {
	name: string;
	barangayInfo: BarangayInfo;
	barangayOfficials: BarangayOfficials;
	images: Image[];
	barangayMap: Image;
	adminIds: mongoose.Types.ObjectId[];
}

const barangayInfoSchema: Schema<BarangayInfo> = new mongoose.Schema({
	location: {
		houseNumber: {
			type: String,
			required: true,
		},
		street: {
			type: String,
			required: true,
		},
		barangay: {
			type: String,
			required: true,
		},
		province: {
			type: String,
			required: true,
		},
		city: {
			type: String,
			required: true,
		},
		zipcode: {
			type: String,
			required: true,
		},
	},
	contact: {
		hotline: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
	},
	demographic: {
		residents: {
			type: Number,
			default: 0,
		},
		families: {
			type: Number,
			default: 0,
		},
		households: {
			type: Number,
			default: 0,
		},
		landAreas: {
			type: Number,
			default: 0,
		},
		streets: {
			type: Number,
			default: 0,
		},
		healthCenters: {
			type: Number,
			default: 0,
		},
		schools: {
			type: Number,
			default: 0,
		},
		seniorCitizen: {
			type: Number,
			default: 0,
		},
		pwd: {
			type: Number,
			default: 0,
		},
		singleParent: {
			type: Number,
			default: 0,
		},
	},
});

const mainOfficialSchema: Schema<Official> = new mongoose.Schema({
	name: {
		type: String,
	},
	position: {
		type: String,
	},
	image: {
		type: String,
	},
});

const skOfficialSchema: Schema<Official> = new mongoose.Schema({
	name: {
		type: String,
	},
	position: {
		type: String,
	},
	image: {
		type: String,
	},
});

const barangayOfficialsSchema: Schema<BarangayOfficials> = new mongoose.Schema({
	barangayOfficials: [mainOfficialSchema],
	skOfficials: [skOfficialSchema],
});

const imageSchema: Schema<Image> = new mongoose.Schema({
	public_id: {
		type: String,
	},
	url: {
		type: String,
	},
});

const barangaySchema: Schema<Barangay> = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
		},
		barangayInfo: barangayInfoSchema,
		barangayOfficials: barangayOfficialsSchema,
		images: [imageSchema],
		barangayMap: imageSchema,
		adminIds: [
			{
				type: Schema.Types.ObjectId,
				ref: 'User',
				required: true,
			},
		],
	},
	{
		timestamps: true,
	}
);

// Make sure to set the `toObject` and `toJSON` schema options to `true`.
barangaySchema.set('toObject', { virtuals: true });
barangaySchema.set('toJSON', { virtuals: true });

const Barangay: Model<Barangay> = mongoose.model<Barangay>(
	'Barangay',
	barangaySchema
);

export default Barangay;

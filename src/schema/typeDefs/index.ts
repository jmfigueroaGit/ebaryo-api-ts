import { readFileSync } from 'fs';
import path from 'path';

export const userTypes = readFileSync(path.join(__dirname, './user.graphql'), {
	encoding: 'utf-8',
});

export const authTypes = readFileSync(path.join(__dirname, './auth.graphql'), {
	encoding: 'utf-8',
});

export const barangayTypes = readFileSync(
	path.join(__dirname, './barangay.graphql'),
	{
		encoding: 'utf-8',
	}
);

export const residentTypes = readFileSync(
	path.join(__dirname, './resident.graphql'),
	{
		encoding: 'utf-8',
	}
);

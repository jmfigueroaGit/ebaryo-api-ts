import { barangayResolver } from './resolvers/barangay.resolver';
import { authResolver } from './resolvers/auth.resolver';
import { usersResolver } from './resolvers/user.resolver';
import { readFileSync } from 'fs';
import path from 'path';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { applyMiddleware } from 'graphql-middleware';
import { decoded } from '../utils/generate_token';

const userTypes = readFileSync(
	path.join(__dirname, './typeDefs/user.graphql'),
	{
		encoding: 'utf-8',
	}
);

const authTypes = readFileSync(
	path.join(__dirname, './typeDefs/auth.graphql'),
	{
		encoding: 'utf-8',
	}
);

const barangayTypes = readFileSync(
	path.join(__dirname, './typeDefs/barangay.graphql'),
	{
		encoding: 'utf-8',
	}
);

export const typeDefs = `
    ${userTypes}
	${authTypes}
	${barangayTypes}
`;

export const resolvers = {
	Query: {
		...usersResolver.Query,
		...authResolver.Query,
		...barangayResolver.Query,
	},
	Mutation: {
		...usersResolver.Mutation,
		...authResolver.Mutation,
		...barangayResolver.Mutation,
	},
};

export const schema = makeExecutableSchema({
	typeDefs,
	resolvers,
});

const GetCookie = async (
	resolve: any,
	parent: any,
	args: any,
	context: any,
	info: any
) => {
	let user = null;
	const token = await context.request.cookieStore?.get('auth-token');

	if (token) {
		try {
			// Verify and decode the token
			user = await decoded(token);

			context.user = user;
		} catch (error: any) {
			// Handle specific types of token errors
			if (error.name === 'TokenExpiredError') {
				throw new Error('Your session has expired. Please log in again.');
			} else if (error.name === 'JsonWebTokenError') {
				throw new Error('Invalid token. Please log in again.');
			} else {
				// Handle other kinds of unexpected errors
				throw new Error('Authentication error.');
			}
		}
	}

	// Proceed with the execution of the resolver chain
	const result = await resolve(parent, args, context, info);

	return result;
};

export const schemaWithMiddleware = applyMiddleware(schema, GetCookie);

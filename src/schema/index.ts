import { usersResolver } from './resolvers/user.resolver';
import { readFileSync } from 'fs';
import path from 'path';
import { createSchema } from 'graphql-yoga';

const userTypes = readFileSync(
	path.join(__dirname, './typeDefs/user.graphql'),
	{
		encoding: 'utf-8',
	}
);

export const typeDefs = `
    ${userTypes}
`;

export const resolvers = {
	Query: {
		...usersResolver.Query,
	},
	Mutation: { ...usersResolver.Mutation },
};

export const schema = createSchema({
	typeDefs,
	resolvers,
});

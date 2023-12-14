import { barangayResolver } from './resolvers/barangay.resolver';
import { authResolver } from './resolvers/auth.resolver';
import { usersResolver } from './resolvers/user.resolver';
import { residentResolver } from './resolvers/resident.resolver';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { applyMiddleware } from 'graphql-middleware';
import { GetCookie } from '../utils/cookie';
import { authTypes, barangayTypes, userTypes, residentTypes } from './typeDefs';

const typeDefs = `
    ${userTypes}
	${authTypes}
	${barangayTypes}
	${residentTypes}
`;

const resolvers = {
	Query: {
		...usersResolver.Query,
		...authResolver.Query,
		...barangayResolver.Query,
		...residentResolver.Query,
	},
	Mutation: {
		...usersResolver.Mutation,
		...authResolver.Mutation,
		...barangayResolver.Mutation,
		...residentResolver.Mutation,
	},
};

const schema = makeExecutableSchema({
	typeDefs,
	resolvers,
});

export const schemaWithMiddleware = applyMiddleware(schema, GetCookie);

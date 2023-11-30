import clc from 'cli-color';
import dotenv from 'dotenv';
import express from 'express';
import { createYoga, maskError } from 'graphql-yoga';
import { useCSRFPrevention } from '@graphql-yoga/plugin-csrf-prevention';
import { useCookies } from '@whatwg-node/server-plugin-cookies';
import { schema } from './schema';
import connectDB from './config/db';
import {
	ValidationError,
	AuthenticationError,
	NotFoundError,
	ForbiddenError,
	InputError,
} from './utils/error_handler';

// Create an Express app
const app = express();
dotenv.config();
connectDB();

// Create a Yoga instance with a GraphQL schema.
const yoga = createYoga({
	cors: {
		origin: ['http://localhost:4000'],
		credentials: true, // Allow sending cookies
	},
	schema,
	maskedErrors: {
		maskError(error, message, isDev): any {
			if ((error as any)?.extensions?.code instanceof ValidationError) {
				return error;
			}
			if ((error as any)?.extensions?.code instanceof AuthenticationError) {
				return error;
			}
			if ((error as any)?.extensions?.code instanceof NotFoundError) {
				return error;
			}
			if ((error as any)?.extensions?.code instanceof ForbiddenError) {
				return error;
			}
			if ((error as any)?.extensions?.code instanceof InputError) {
				return error;
			}

			return maskError(error, message, isDev);
		},
	},
	batching: {
		limit: 2,
	},
	plugins: [useCookies()],
});

// Pass it into a server to hook into request handlers.

// Apply the Graphql server middleware to the Express app
app.use(yoga.graphqlEndpoint, yoga);

// Set up a port for express to listen on
const PORT = process.env.PORT || 4000;
// Start the server and you're done!
app.listen(PORT, () => {
	console.info(
		clc.blueBright(`Server is running on http://localhost:${PORT}/graphql 🚀`)
	);
});

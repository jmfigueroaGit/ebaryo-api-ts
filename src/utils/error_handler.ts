import { GraphQLError } from 'graphql';

class CustomError extends GraphQLError {
	code: string;

	constructor(message: string, code: string) {
		super(message);
		this.code = code;
	}
}

export class ValidationError extends CustomError {
	constructor(message: string) {
		super(message, 'VALIDATION_ERROR');
	}
}

export class AuthenticationError extends CustomError {
	constructor(message: string) {
		super(message, 'AUTHENTICATION_ERROR');
	}
}

export class NotFoundError extends CustomError {
	constructor(message: string = 'Resource not found') {
		super(message, 'NOT_FOUND_ERROR');
	}
}

export class ForbiddenError extends CustomError {
	constructor(message: string = 'You do not have permission to do this') {
		super(message, 'FORBIDDEN_ERROR');
	}
}

export class InputError extends CustomError {
	constructor(message: string = 'Invalid input') {
		super(message, 'INPUT_ERROR');
	}
}

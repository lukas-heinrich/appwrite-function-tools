/**
 * Provides utility functions for validating requests.
 */

import { asError } from './error';
import type { Request } from './types/appwrite';

/**
 * Error indicating that the request is invalid. It will be handled as a 400 Bad Request response by the router.
 */
export class InvalidRequestError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'InvalidRequestError';
	}
}

/**
 * Throws an error if any of the keys are missing from the object.
 *
 * @param obj - The object to check for missing keys
 * @param keys - The keys to check for in the object
 * @throws InvalidRequestError if any of the keys are missing from the object
 */
export function throwIfMissing(obj: Record<string, unknown>, keys: string[]) {
	const missing: string[] = [];
	for (let key of keys) {
		if (!(key in obj) || !obj[key]) missing.push(key);
	}
	if (missing.length > 0) throw new InvalidRequestError(`Missing required fields: ${missing.join(', ')}`);
}

/**
 * Validates the json request body and returns the parsed data. Use this function to access the request body safely.
 * You can use any function to validate and transform the data. You may use `zod` or write a custom function.
 *
 * @param req - The request object
 * @param validator - The validator function
 * @returns The parsed data
 * @throws InvalidRequestError if the request body is invalid or the validator throws an error
 */
export function getData<T>(req: Request, validator: (obj: object | string) => T) {
	// Safe access to the request body to handle invalid JSON or empty body
	let body;
	try {
		body = req.bodyJson;
	} catch (err) {
		throw new InvalidRequestError('Invalid request body');
	}

	// Validate the request body
	try {
		return validator(body);
	} catch (err) {
		throw new InvalidRequestError(asError(err).message);
	}
}

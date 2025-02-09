/**
 * Provides utility functions for type safe error handling.
 */

/**
 * Checks if a value is an object.
 *
 * @param value - The value to check
 * @returns True if the value is an object, false otherwise
 */
function isObject(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value != null;
}

/**
 * Gets the message from an object.
 *
 * @param obj - The object to get the message from
 * @returns The message from the object
 */
function getObjectMessage(obj: Record<string, unknown>): string {
	if (typeof obj['message'] === 'string') return obj['message'];

	if (obj.toString !== Object.prototype.toString) return obj.toString();

	try {
		return JSON.stringify(obj);
	} catch {
		return String(obj);
	}
}

/**
 * Type Guard: Checks if a value is an error.
 *
 * @param err - The value to check
 * @returns True if the value is an error, false otherwise
 */
export function isError(err: unknown): err is Error {
	return (
		isObject(err) &&
		typeof err['name'] === 'string' &&
		typeof err['message'] === 'string' &&
		(!('stack' in err) || typeof err['stack'] === 'string')
	);
}

/**
 * Converts a unknown value to an error. Use this function to ensure type safety when handling errors in catch blocks.
 *
 * @param err - The value to convert to an error
 * @returns The error
 */
export function asError(err: unknown): Error {
	if (isError(err)) return err;
	const error = new Error(isObject(err) ? getObjectMessage(err) : String(err));
	error.name = (isObject(err) && err.constructor.name) || typeof err;
	return error;
}

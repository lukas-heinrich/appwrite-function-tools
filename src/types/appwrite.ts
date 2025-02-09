/**
 * This file includes a collection of types for the Appwrite functions runtime to ensure type safety and autocomplete
 * while developing Appwrite functions with TypeScript.
 *
 * Reference: https://appwrite.io/docs/products/functions/develop
 * Reference: https://github.com/open-runtimes/open-runtimes/blob/main/runtimes/bun/versions/latest/src/server.ts
 */

/**
 * Main function entrypoint
 *
 * @see https://appwrite.io/docs/products/functions/develop
 */
export type FunctionEntrypoint = {
	req: Request;
	res: Response;
	log: (...message: any[]) => void;
	error: (...message: any[]) => void;
};

/**
 * Request object for Appwrite functions
 *
 * @see https://appwrite.io/docs/products/functions/develop#request
 */
export interface Request {
	/** Raw request body, contains request data */
	bodyText: string;
	/** Object from parsed JSON request body, otherwise string */
	bodyJson: object | string;
	/** Raw request body, contains request data */
	bodyBinary: ArrayBuffer;
	/** String key-value pairs of all request headers, keys are lowercase */
	headers: RequestHeaders;
	/** Value of the x-forwarded-proto header, usually http or https */
	scheme: string;
	/** Request method, such as GET, POST, PUT, DELETE, PATCH, etc. */
	method: string;
	/** Full URL, for example: http://awesome.appwrite.io:8000/v1/hooks?limit=12&offset=50 */
	url: string;
	/** Hostname from the host header, such as awesome.appwrite.io */
	host: string;
	/** Port from the host header, for example 8000 */
	port: string;
	/** Path part of URL, for example /v1/hooks */
	path: string;
	/** Raw query params string. For example "limit=12&offset=50" */
	queryString: string;
	/** Parsed query params. For example, req.query.limit */
	query: Record<string, string>;
}

/**
 * Default request headers provided by Appwrite functions runtime
 *
 * @see https://appwrite.io/docs/products/functions/develop#headers
 */
export type RequestHeaders = {
	/** Describes how the function execution was invoked */
	'x-appwrite-trigger': 'http' | 'schedule' | 'event';
	/** Event name if the function was triggered by an event */
	'x-appwrite-event': string | undefined;
	/** The dynamic API key is used for server authentication. */
	'x-appwrite-key': string;
	/** If the function execution was invoked by an authenticated user, display the user ID. This doesn't apply to Appwrite Console users or API keys. */
	'x-appwrite-user-id': string | undefined;
	/** JWT token generated from the invoking user's session. Used to authenticate Server SDKs to respect access permissions. */
	'x-appwrite-user-jwt': string | undefined;
	/** Displays the country code of the configured locale. */
	'x-appwrite-country-code': string;
	/** Displays the continent code of the configured locale. */
	'x-appwrite-continent-code': string;
	/** Describes if the configured local is within the EU. */
	'x-appwrite-continent-eu': string;

	/** Any additional headers */
	[key: string]: string | undefined;
};

/**
 * Response object for Appwrite functions
 *
 * @see https://appwrite.io/docs/products/functions/develop#response
 */
export interface Response {
	/** Sends a response with a code 204 No Content status. */
	empty: () => void;
	/** Converts the data into a JSON string and sets the content-type header to application/json. */
	json: (body: any, statusCode?: number, headers?: Record<string, string>) => void;
	/** Packages binary bytes, the status code, and the headers into an object. */
	binary: (body: ArrayBuffer, statusCode?: number, headers?: Record<string, string>) => void;
	/** Converts the body using UTF-8 encoding into a binary Buffer. */
	text: (body: string, statusCode?: number, headers?: Record<string, string>) => void;
	/** Sends a redirect response to the client. */
	redirect: (url: string, statusCode?: number, headers?: Record<string, string>) => void;
}

/**
 * Default environment variables provided by Appwrite functions runtime
 *
 * @see https://appwrite.io/docs/products/functions/develop#environment
 */
export interface FunctionEnvironment {
	/** The API endpoint of the running function */
	APPWRITE_FUNCTION_API_ENDPOINT: string;
	/** The project ID of the running function */
	APPWRITE_FUNCTION_PROJECT_ID: string;
	/** The region where the function will run from */
	APPWRITE_REGION: string;
	/** The ID of the running function */
	APPWRITE_FUNCTION_ID: string;
	/** The name of the running function */
	APPWRITE_FUNCTION_NAME: string;
	/** The deployment ID of the running function */
	APPWRITE_FUNCTION_DEPLOYMENT: string;
	/** The runtime of the running function */
	APPWRITE_FUNCTION_RUNTIME_NAME: string;
	/** The version of the runtime of the running function */
	APPWRITE_FUNCTION_RUNTIME_VERSION: string;
}

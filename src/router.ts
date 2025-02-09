import RouteRecognizer from 'route-recognizer';
import type { Request, Response, FunctionEntrypoint } from './types/appwrite';
import { InvalidRequestError } from './validation';

/*
  Types
*/

/**
 * Parameters to be passed while defining a route handler
 */
type RouteHandlerDef<Context = {}> = {
	/** The request object */
	req: Request;
	/** The response object */
	res: Response;
	/** Object containing a global context to share data between main script and handlers */
	context: Context;
	/** The log function */
	log: FunctionEntrypoint['log'];
	/** The error function */
	error: FunctionEntrypoint['error'];
};

/**
 * Parameters to be passed when calling a route handler
 */
export type RouteHandlerParams<Context = {}, Params = {}> = RouteHandlerDef<Context> & {
	/** The parameters from the route path (not including query parameters) */
	params: Params;
};

/**
 * Function signature for a route handler
 */
export type RouteHandler<Context = {}> = (params: RouteHandlerParams<Context>) => Promise<void>;

/**
 * Route definition
 */
export interface RouteDef<Context = {}> {
	/** The path of the route */
	path: string;
	/** The handler for the route */
	handler: RouteHandler<Context>;
}

/*
  Router
*/

/**
 * Router class provides an abstraction for handling routes and processing requests based on the request path.
 */
export class Router<Context> {
	private recognizer = new RouteRecognizer();

	/**
	 * Initializes the router with the given routes.
	 *
	 * @param routes - Route definitions
	 */
	constructor(routes: RouteDef<Context>[]) {
		for (const route of routes) {
			this.recognizer.add([
				{
					path: route.path,
					handler: route.handler,
				},
			]);
		}
	}

	/**
	 * Matches the request path to a route and returns the handler and parameters from the routes path. If no match is
	 * found, it returns an object with null handler and empty params.
	 *
	 * @param req - The request object
	 * @returns Handler and params for the matched route or null object
	 */
	match(req: Request): {
		handler: RouteHandler<Context> | null;
		params: Record<string, unknown>;
	} {
		const results = this.recognizer.recognize(req.path);
		return results && results[0]
			? {
					handler: results[0].handler as RouteHandler<Context>,
					params: results[0].params,
			  }
			: { handler: null, params: {} };
	}

	/**
	 * Handles the request by matching it to a route and calling the handler with the provided parameters.
	 *
	 * - It creates a 404 response if no match is found.
	 * - It creates a 400 response if the handler throws an InvalidRequestError.
	 * - It creates a 500 response if the handler throws any other error.
	 *
	 * @param data - Handler parameters including request, response, context, and logging functions
	 */
	async handle(data: RouteHandlerDef<Context>): Promise<void> {
		const { handler, params } = this.match(data.req);

		// If no handler is found, return a 404 error
		if (!handler) return data.res.json({ error: 'Not Found' }, 404);

		try {
			return await handler({ ...data, params });
		} catch (err) {
			data.error(err);

			// Handle invalid request errors as bad request errors
			if (err instanceof InvalidRequestError) return data.res.json({ error: err.message }, 400);

			// Handle all other errors as internal server errors
			return data.res.json({ error: 'Internal Server Error' }, 500);
		}
	}
}

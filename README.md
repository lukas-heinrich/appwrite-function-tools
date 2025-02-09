# Appwrite Functions Tools

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
![Appwrite Version](https://img.shields.io/badge/Appwrite_Version-1.6.0-red)

A TypeScript utility library for [Appwrite Functions](https://appwrite.io/docs/products/functions), providing type
definitions and utilities to interact with requests and handle errors.

⚠️ This package was designed to be used in different runtimes, but it has only been tested using `bun-1.0`. If you
notice any problems feel free to create a pull request.

## Features

- 🦺 Type definitions for Appwrite Functions
- 🛠️ Error handling utilities
- 🔍 Request validation utilities
- 📦 Lightweight path-based router using [route-recognizer](https://www.npmjs.com/package/route-recognizer)

## Usage

### Installation

```bash
# npm
npm install appwrite-function-tools

# pnpm
pnpm add appwrite-function-tools

# bun
bun add appwrite-function-tools
```

### Type Definitions

See the following example based on the appwrite starter function for a basic usage of the type definitions:

```ts
import { FunctionEntrypoint } from 'appwrite-function-tools';

export default async ({ req, res, log, error }: FunctionEntrypoint) => {
	// ⬇️ Type Safe access to the request, response, logger and error handler
	// You can use the Appwrite SDK to interact with other services
	// For this example, we're using the Users service
	const client = new Client()
		.setEndpoint(Bun.env['APPWRITE_FUNCTION_API_ENDPOINT']) // ⬅️ Type Safe access to the environment variables
		.setProject(Bun.env['APPWRITE_FUNCTION_PROJECT_ID'])
		.setKey(req.headers['x-appwrite-key'] ?? '');
	const users = new Users(client);

	try {
		const response = await users.list();
		// Log messages and errors to the Appwrite Console
		// These logs won't be seen by your end users
		log(`Total users: ${response.total}`);
	} catch (err) {
		error('Could not list users: ' + asError(err).message); // ⬅️ Type Safe error handling
	}

	// The req object contains the request data
	if (req.path === '/ping') {
		// Use res object to respond with text(), json(), or binary()
		// Don't forget to return a response!
		return res.text('Pong');
	}

	return res.json({
		motto: 'Build like a team of hundreds_',
		learn: 'https://appwrite.io/docs',
		connect: 'https://appwrite.io/discord',
		getInspired: 'https://builtwith.appwrite.io',
	});
};
```

To use the global types, you need to create a `global.d.ts` file in the root of your project. You may want to use it to
declare the environment variables or provide type safety for the Appwrite functions runtime without importing the types.

```ts
import type { FunctionEnvironment } from 'appwrite-function-tools';

// Declare Bun environment variables for the Appwrite functions runtime
declare module 'bun' {
	interface Env extends FunctionEnvironment {}
}

export {};
```

### Validation and Routing

... Coming Soon

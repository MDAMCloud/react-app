const API_TIMEOUT = 30000;
const BT_TIMEOUT = 120000;
export const TIMEOUT = {API_TIMEOUT, BT_TIMEOUT};

/**
 * Trivial promise to make each action ordered
 * Example => sequence().then(promise1).then()...
 */
export const sequence = () => new Promise(resolve => resolve());

export const promiseTimeout = function (promise, ms = 10000) {
	// Create a promise that rejects in <ms> milliseconds
	const timeout = new Promise((resolve, reject) => {
		const id = setTimeout(() => {
			clearTimeout(id);
			reject(new Error(`Timed out in ${ms}ms.`));
		}, ms);
	});

	// Returns a race between our timeout and the passed in promise
	return Promise.race([promise, timeout]);
};

export const joinedPromise = (promise, value) => {
	return new Promise((resolve, reject) =>
		promise.then(promiseValue => resolve({promiseValue, value})).catch(reject),
	);
};

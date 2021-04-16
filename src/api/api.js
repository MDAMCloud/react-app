import endpoints from './endpoints';
import {promiseTimeout, TIMEOUT} from '../helper/promiseHelper';
import {callDefaultToast} from '../helper/toastHelper';

const METHODS = {
	GET: 'get',
	POST: 'post',
	PUT: 'put',
	DELETE: 'delete',
};

const create = () => {
	function initialize() {
		return (method, endpoint, data, headers = {}) => {
			let fullUrl = `https://auth-service-cloud-stage.herokuapp.com${endpoint}`;
			const fullHeaders = {
				...headers,
				'Cache-Control': 'no-cache',
				'Content-Type': 'application/json',
			};

			/* Serialize data to url on get methods */
			if (method === METHODS.GET && data) {
				const paramUrl = Object.entries(data)
					.map(([key, value]) => `${key}=${value}`)
					.join('&');
				fullUrl = `${fullUrl}?${paramUrl}`;
			}

			let request = {
				method,
				headers: fullHeaders,
			};
			if (method !== METHODS.GET) {
				request = {...request, body: data ? JSON.stringify(data) : undefined};
			}

			return fetch(fullUrl, request);
		};
	}

	let api = initialize();

	const refresh = () => {
		api = initialize();
	};

	const getRequest = (url, parameters) => api(METHODS.GET, url, parameters);
	const postRequest = (url, parameters) => api(METHODS.POST, url, parameters);
	const putRequest = (url, parameters) => api(METHODS.PUT, url, parameters);
	const deleteRequest = (url, parameters) =>
		api(METHODS.DELETE, url, parameters);

	const get = (url, data) => process(() => getRequest(url, data));
	const post = (url, data = {}) => process(() => postRequest(url, data));
	const put = (url, data = {}) => process(() => putRequest(url, data));
	const deleteReq = (url, data = {}) => process(() => deleteRequest(url, data));

	const process = request => {
		const call = request()
			.then(resolveResponse)
			.catch(ignored => ({ok: false, data: null}));
		return new Promise(resolve => {
			promiseTimeout(call, TIMEOUT.API_TIMEOUT)
				.then(resolve)
				.catch(() => {
					callDefaultToast('İstek zaman aşımına uğradı. Tekrar deneyiniz');
					resolve({ok: false, data: null});
				});
		}).catch(console.log);
	};

	async function resolveResponse(fetchResponseWrapper) {
		try {
			let response = null;
			try {
				/* On void function case, they will return no data hence response.json() will fail */
				response = await fetchResponseWrapper.json();
			} catch (ignored) {}
			/* if dataWrapper has successful property it should be app response wrapper */
			// eslint-disable-next-line no-prototype-builtins
			if (response?.hasOwnProperty('successful')) {
				/* handle as app response */
				const ok = response?.successful ?? false;
				return {
					ok,
					type: fetchResponseWrapper.type,
					headers: fetchResponseWrapper?.headers?.map ?? {},
					status: fetchResponseWrapper.status,
					data: ok ? response?.data : null,
				};
			} else {
				const {ok} = fetchResponseWrapper;
				return {
					ok,
					type: fetchResponseWrapper.type,
					headers: fetchResponseWrapper?.headers?.map ?? {},
					status: fetchResponseWrapper.status,
					data: ok ? response : null,
				};
			}
		} catch (e) {
			return {
				ok: false,
				type: fetchResponseWrapper.type,
				headers: fetchResponseWrapper?.headers?.map ?? {},
				status: fetchResponseWrapper.status,
				data: null,
			};
		}
	}

	return endpoints({get, post, put, deleteReq}, refresh);
};

export default create();

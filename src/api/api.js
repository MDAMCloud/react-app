import endpoints from "./endpoints";
import { promiseTimeout, TIMEOUT } from "../helper/promiseHelper";
import { callDefaultToast } from "../helper/toastHelper";

const METHODS = {
  GET: "get",
  POST: "post",
  PUT: "put",
  DELETE: "delete",
};

const create = () => {
  function initialize() {
    return (base, method, endpoint, data, headers = {}) => {
      let fullUrl;
      if (base === 1) {
        fullUrl = `https://auth-service-cloud.herokuapp.com${endpoint}`;
      } else {
        fullUrl = `http://mdam.tech${endpoint}`;
      }

      const fullHeaders = {
        ...headers,
        "Cache-Control": "no-cache",
        "Content-Type": "application/json",
      };

      /* Serialize data to url on get methods */
      if (method === METHODS.GET && data) {
        const paramUrl = Object.entries(data)
          .map(([key, value]) => `${key}=${value}`)
          .join("&");
        fullUrl = `${fullUrl}?${paramUrl}`;
      }

      let request = {
        method,
        headers: fullHeaders,
      };
      if (method !== METHODS.GET) {
        request = { ...request, body: data ? JSON.stringify(data) : undefined };
      }

      console.log(fullUrl, request)

      return fetch(fullUrl, request);
    };
  }

  let api = initialize();

  const refresh = () => {
    api = initialize();
  };

  const getRequest = (base, url, parameters) =>
    api(base, METHODS.GET, url, parameters);
  const postRequest = (base, url, parameters) =>
    api(base, METHODS.POST, url, parameters);
  const putRequest = (base, url, parameters) =>
    api(base, METHODS.PUT, url, parameters);
  const deleteRequest = (base, url, parameters) =>
    api(base, METHODS.DELETE, url, parameters);

  const get = (base, url, data = {}) =>
    process(() => getRequest(base, url, data));
  const post = (base, url, data = {}) =>
    process(() => postRequest(base, url, data));
  const put = (base, url, data = {}) =>
    process(() => putRequest(base, url, data));
  const deleteReq = (base, url, data = {}) =>
    process(() => deleteRequest(base, url, data));

  const process = (request) => {
    const call = request()
      .then(resolveResponse)
      .catch((ignored) => ({ ok: false, data: null }));
    return new Promise((resolve) => {
      promiseTimeout(call, TIMEOUT.API_TIMEOUT)
        .then(resolve)
        .catch(() => {
          callDefaultToast("The request timed out. Try again.");
          resolve({ ok: false, data: null });
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
			console.log(response);
      if (response?.hasOwnProperty("successful")) {
        /* handle as app response */
        const ok = response?.successful ?? false;
        return {
          ok,
          type: fetchResponseWrapper.type,
          headers: fetchResponseWrapper?.headers?.map ?? {},
          status: fetchResponseWrapper.status,
          data: ok ? response?.data : null,
					errorReason: response?.errorReason
        };
      } else {
        const { ok } = fetchResponseWrapper;
        return {
          ok,
          type: fetchResponseWrapper.type,
          headers: fetchResponseWrapper?.headers?.map ?? {},
          status: fetchResponseWrapper.status,
          data: ok ? response : null,
					errorReason: response?.errorReason
        };
      }
    } catch (e) {
      return {
        ok: false,
        type: fetchResponseWrapper.type,
        headers: fetchResponseWrapper?.headers?.map ?? {},
        status: fetchResponseWrapper.status,
        data: null
      };
    }
  }

  return endpoints({ get, post, put, deleteReq }, refresh);
};

export default create();

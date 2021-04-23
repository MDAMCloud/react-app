import debounce from "awesome-debounce-promise";

function decorate(obj, decorator) {
  const _obj = {};
  Object.keys(obj).forEach((key) => (_obj[key] = decorator(obj[key])));
  return _obj;
}

export default ({ get, post, put, deleteReq }, refresh) => {
  // user
  const getCurrentUser = () => get(1, "/api/users");
  const addNewUser = (addUserRequest) => post(1, "/api/users", addUserRequest);

  // authentication
  const login = (loginRequest) => post(1, "/api/login", loginRequest);

  //url-shortener
	const getCustomUrls = (token) => post(2, "/urls", token);
	const shortenUrl = (shortenRequest) => post(2, "/shorten", shortenRequest)
	const deleteCustomUrl = (key, token) => deleteReq(2, `/${key}`, token)

  const endpoints = {
    getCurrentUser,
    addNewUser,
    login,
		getCustomUrls,
		shortenUrl,
		deleteCustomUrl
  };

  return decorate(endpoints, (fn) => debounce(fn, 1000));
};

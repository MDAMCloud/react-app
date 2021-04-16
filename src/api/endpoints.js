import debounce from 'awesome-debounce-promise';

function decorate(obj, decorator) {
	const _obj = {};
	Object.keys(obj).forEach(key => (_obj[key] = decorator(obj[key])));
	return _obj;
}

export default ({get, post, put, deleteReq}, refresh) => {
	// user
	const getCurrentUser = () => get('/api/users');
	const addNewUser = addUserRequest => post('/api/users', addUserRequest);

	// authentication
	const login = loginRequest => post('/api/login', loginRequest);
	const logout = () => get('/api/logout');

	const endpoints = {
		getCurrentUser,
		addNewUser,
		login,
		logout,
	};

	return decorate(endpoints, fn => debounce(fn, 1000));
};

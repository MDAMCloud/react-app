import Home from './common/Home';
import Login from './common/Login';
import Signup from './common/Signup';

export default {
	loginRoute: Login,
	homeRoute: Home,
	childRoutes: [Signup],
};

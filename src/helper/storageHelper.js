import AsyncStorage from '@react-native-async-storage/async-storage';

export const AUTH_TOKEN = 'auth-token';

export const storeData = async (key, value) => {
	try {
		await AsyncStorage.setItem(key, value);
	} catch (e) {
		console.log('storage set error');
	}
};

export const getData = async key => {
	try {
		return await AsyncStorage.getItem(key);
	} catch (e) {
		console.log('storage get error');
	}
};

export const removeItem = async key => {
	try {
		return await AsyncStorage.removeItem(key);
	} catch (e) {
		console.log('storage remove error');
	}
}

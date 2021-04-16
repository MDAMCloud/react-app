import {ToastAndroid} from 'react-native';

export const callDefaultToast = (message, time = 3500) => {
	ToastAndroid.showWithGravity(message, time, ToastAndroid.BOTTOM);
};

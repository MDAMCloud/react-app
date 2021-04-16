import React from 'react';
import styles from './style';
import {
	Keyboard,
	Text,
	View,
	TextInput,
	TouchableWithoutFeedback,
	KeyboardAvoidingView,
} from 'react-native';
import {Button} from 'react-native-elements';
import api from '../../../../api';
import {callDefaultToast} from '../../../../helper/toastHelper';
import {AUTH_TOKEN, storeData} from '../../../../helper/storageHelper';
import {Actions} from 'react-native-router-flux';

const HomeContainer = props => {
	const [username, setUsername] = React.useState();
	const [password, setPassword] = React.useState();

	const onLoginPress = async () => {
		try {
			const response = await api.login({
				username: username,
				password: password,
			});
			if (response.data !== null) {
				await storeData(AUTH_TOKEN, response.data?.token);
			} else {
				callDefaultToast('Credentials are wrong.');
			}
			Actions.home();
		} catch (e) {
			callDefaultToast('Network error. Try again later.');
		}
	};

	return (
		<KeyboardAvoidingView style={styles.containerView} behavior="padding">
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<View style={styles.loginScreenContainer}>
					<View style={styles.loginFormView}>
						<Text style={styles.logoText}>Url Shortener</Text>
						<TextInput
							placeholder="Enter your url to shorten"
							placeholderColor="#c4c3cb"
							value={username}
							onChangeText={setUsername}
							style={styles.loginFormTextInput}
						/>
						<TextInput
							placeholder="Custom short url"
							placeholderColor="#c4c3cb"
							value={password}
							onChangeText={setPassword}
							style={styles.loginFormTextInput}
						/>
						<Button
							buttonStyle={styles.loginButton}
							onPress={onLoginPress}
							title="shorten"
						/>
					</View>
				</View>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	);
};

export default HomeContainer;

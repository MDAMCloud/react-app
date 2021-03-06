import React from "react";
import styles from "./style";
import {
  Keyboard,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ImageBackground,
} from "react-native";
import { Button } from "react-native-elements";
import api from "../../../../api";
import { callDefaultToast } from "../../../../helper/toastHelper";
import { AUTH_TOKEN, storeData } from "../../../../helper/storageHelper";
import { Actions } from "react-native-router-flux";

const LoginContainer = (props) => {
  const [username, setUsername] = React.useState();
  const [password, setPassword] = React.useState();

  const onLoginPress = async () => {
    try {
      const response = await api.login({
        username: username,
        password: password,
      });
      if (response.data !== null) {
        await storeData(AUTH_TOKEN, JSON.stringify(response.data));
        Actions.home();
      } else {
        callDefaultToast("Credentials are wrong.");
      }
    } catch (e) {
      callDefaultToast("Network error. Try again later.");
    }
  };

  return (
    <KeyboardAvoidingView style={styles.containerView} behavior="padding">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.loginScreenContainer}>
          <ImageBackground
            source={require("../../../../../background.png")}
            style={styles.image}
          >
            <View style={styles.loginFormView}>
              <Text style={styles.logoText}>Login</Text>
              <TextInput
                placeholder="Username"
                placeholderColor="#c4c3cb"
                value={username}
                onChangeText={setUsername}
                style={styles.loginFormTextInput}
              />
              <TextInput
                placeholder="Password"
                placeholderColor="#c4c3cb"
                value={password}
                onChangeText={setPassword}
                style={styles.loginFormTextInput}
                secureTextEntry={true}
              />
              <Button
                buttonStyle={styles.loginButton}
                onPress={onLoginPress}
                title="Login"
              />
              <Button
                buttonStyle={styles.loginButton}
                onPress={Actions.signup}
                title="Sign up"
              />
              <Button
                buttonStyle={styles.loginButton}
                onPress={Actions.home}
                title="Use url shortener"
              />
            </View>
          </ImageBackground>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default LoginContainer;

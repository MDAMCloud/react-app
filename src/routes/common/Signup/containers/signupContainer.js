import React from "react";
import styles from "./style";
import {
  Keyboard,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Picker,
  ImageBackground,
} from "react-native";
import { Button } from "react-native-elements";
import api from "../../../../api";
import { callDefaultToast } from "../../../../helper/toastHelper";
import { AUTH_TOKEN, storeData } from "../../../../helper/storageHelper";
import { Actions } from "react-native-router-flux";

const SignupContainer = (props) => {
  const [username, setUsername] = React.useState();
  const [password, setPassword] = React.useState();
  const [accountType, setAccountType] = React.useState("premium");
  const [email, setEmail] = React.useState();

  const onSignupPress = async () => {
    try {
      const response = await api.addNewUser({
        email: email,
        accountType: accountType,
        username: username,
        password: password,
      });
      if (response.data !== null) {
        await storeData(AUTH_TOKEN, response.data?.token);
        callDefaultToast("Account created.");
        Actions.login();
      } else {
        callDefaultToast("Credentials are taken. Change and try again.");
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
              <Text style={styles.logoText}>Signup</Text>
              <View
                style={{
                  ...styles.loginFormTextInput,
                  width: "40%",
                  alignSelf: "center",
                }}
              >
                <Picker
                  selectedValue={accountType}
                  onValueChange={(value) => setAccountType(value)}
                >
                  <Picker.Item label="Premium" value="premium" />
                  <Picker.Item label="Free" value="free" />
                </Picker>
              </View>
              <TextInput
                placeholder="Email"
                placeholderColor="#c4c3cb"
                value={email}
                onChangeText={setEmail}
                style={styles.loginFormTextInput}
                keyboardType={"email-address"}
              />
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
                onPress={onSignupPress}
                title="Sign up"
              />
              <Button
                buttonStyle={styles.loginButton}
                onPress={Actions.login}
                title="Go to Login page"
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

export default SignupContainer;

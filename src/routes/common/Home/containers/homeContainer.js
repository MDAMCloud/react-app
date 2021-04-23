import React, { useEffect } from "react";
import styles from "./style";
import {
  Keyboard,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Linking,
  ScrollView,
  ImageBackground,
} from "react-native";
import { Button, Divider } from "react-native-elements";
import api from "../../../../api";
import { callDefaultToast } from "../../../../helper/toastHelper";
import {
  AUTH_TOKEN,
  getData,
  removeItem,
} from "../../../../helper/storageHelper";
import { Actions } from "react-native-router-flux";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const HomeContainer = (props) => {
  const [url, setUrl] = React.useState();
  const [currentUser, setCurrentUser] = React.useState();
  const [customLink, setCustomLink] = React.useState();
  const [shortUrl, setShortUrl] = React.useState();
  const [customUrlList, setCustomUrlList] = React.useState([]);

  const onShortLinkPress = () => {
    api
      .shortenUrl({
        originalUrl: url,
        shortKey: customLink ? customLink : null,
        token: currentUser?.token ? currentUser?.token : null,
      })
      .then((response) => {
        if (response?.errorReason) {
          callDefaultToast(response?.errorReason);
        } else if (response?.data) {
          setShortUrl(`mdam.tech/${response.data.shortenKey}`);
          refreshCustomUrls(currentUser?.token);
        }
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    getData(AUTH_TOKEN)
      .then((result) => {
        const response = JSON.parse(result);
        setCurrentUser(response);
        refreshCustomUrls(response?.token);
      })
      .catch((e) => console.log(e));
  }, []);

  const handleLogout = () => {
    removeItem(AUTH_TOKEN).then(() => {
      Actions.home();
    });
  };

  const refreshCustomUrls = (token) => {
    api
      .getCustomUrls({ token: token })
      .then((response) => {
        if (response?.data) {
          setCustomUrlList(response?.data);
        }
      })
      .catch((e) => console.log(e));
  };

  const handleDelete = (key, token) => {
    api
      .deleteCustomUrl(key, { token: token })
      .then(() => {
        refreshCustomUrls(token);
      })
      .catch((e) => console.log(e));
  };

  return (
  	<View style={{maxHeight: '100%'}}>
			<ScrollView>
				<KeyboardAvoidingView style={styles.containerView} behavior="padding">
					<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
						<View style={styles.loginScreenContainer}>
							<ImageBackground
								source={require("../../../../../background.png")}
								style={styles.image}
							>
								{currentUser ? (
									<View style={styles.userBox}>
										<View
											style={{ ...styles.urlLabel, width: "20%", marginRight: 5 }}
										>
											<Text style={{ color: "red" }}>
												{currentUser.accountType}
											</Text>
										</View>
										<View style={{ ...styles.urlLabel, width: "35%" }}>
											<Text>@{currentUser.username}</Text>
										</View>
										<View style={{ marginTop: 10, marginLeft: 15 }}>
											<FontAwesome5
												name={"sign-out-alt"}
												size={30}
												brand
												onPress={handleLogout}
											/>
										</View>
									</View>
								) : (
									<View style={styles.userBox}>
										<View style={{ ...styles.urlLabel, width: "50%" }}>
											<Text>Login to use custom urls</Text>
										</View>
										<View style={{ marginTop: 10 }}>
											<FontAwesome5
												name={"sign-in-alt"}
												size={30}
												brand
												onPress={Actions.login}
											/>
										</View>
									</View>
								)}

								<View style={styles.loginFormView}>
									<Text style={styles.logoText}>Url Shortener</Text>
									<TextInput
										placeholder="Enter your url to shorten"
										placeholderColor="#c4c3cb"
										value={url}
										onChangeText={setUrl}
										style={styles.loginFormTextInput}
									/>
									{currentUser ? (
										<TextInput
											placeholder="Custom short url"
											placeholderColor="#c4c3cb"
											value={customLink}
											onChangeText={setCustomLink}
											style={styles.loginFormTextInput}
										/>
									) : (
										<></>
									)}
									<Button
										buttonStyle={styles.loginButton}
										onPress={onShortLinkPress}
										title="get short link"
									/>
									<View style={{ ...styles.urlBox, alignItems: "center" }}>
										<Text
											style={{ color: "blue" }}
											onPress={() => Linking.openURL(`http://${shortUrl}`)}
											placeholder={"short link"}
										>
											{shortUrl}
										</Text>
									</View>
									{currentUser && customUrlList && customUrlList.length > 0 ? (
										<>
											<Text style={styles.customUrlsText}>Your Urls</Text>
											{customUrlList.map((customUrl) => {
												return (
													<>
														<View style={styles.urlContainer}>
															<View style={styles.urlLabel}>
																<Text style={{ color: "black" }}>
																	Actual url:
																</Text>
															</View>
															<View style={{ ...styles.urlBox, width: "60%" }}>
																<Text style={{ color: "black" }}>
																	{customUrl.originalUrl}
																</Text>
															</View>
														</View>
														<View style={styles.urlContainer}>
															<View style={styles.urlLabel}>
																<Text style={{ color: "black" }}>Short url:</Text>
															</View>
															<View style={{ ...styles.urlBox, width: "60%" }}>
																<Text
																	style={{ color: "blue" }}
																	onPress={() =>
																		Linking.openURL(
																			`http://mdam.tech/${customUrl.shortenKey}`
																		)
																	}
																>
																	{`mdam.tech/${customUrl.shortenKey}`}
																</Text>
															</View>
														</View>
														<View style={styles.userBox}>
															{customUrl.expirationDate ? (
																<View
																	style={{ ...styles.urlLabel, width: "50%" }}
																>
																	<Text>
																		Remaining expire date:{" "}
																		{customUrl.expirationDate}
																	</Text>
																</View>
															) : (
																<></>
															)}
															<View style={{ marginTop: 10 }}>
																<FontAwesome5
																	style={{
																		alignSelf: "flex-end",
																		marginRight: "10%",
																	}}
																	name={"trash"}
																	size={30}
																	brand
																	onPress={() =>
																		handleDelete(
																			customUrl.shortenKey,
																			currentUser.token
																		)
																	}
																/>
															</View>
														</View>

														<Divider
															style={{
																marginTop: 5,
																backgroundColor: "blue",
																height: 2,
															}}
														/>
													</>
												);
											})}
										</>
									) : (
										<></>
									)}
								</View>
							</ImageBackground>
						</View>
					</TouchableWithoutFeedback>
				</KeyboardAvoidingView>
			</ScrollView>
		</View>

  );
};

export default HomeContainer;

import { View } from "react-native";

const React = require("react-native");

const { StyleSheet } = React;

export default {
  containerView: {
    flex: 1,
  },
  loginScreenContainer: {
    flex: 1,
    backgroundColor: "#EDF5E1",
  },
  logoText: {
    fontSize: 40,
    fontWeight: "800",
    marginBottom: 10,
    textAlign: "center",
  },
  customUrlsText: {
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 10,
    marginTop: 20,
    textAlign: "center",
  },
  loginFormView: {
    flex: 1,
  },
  loginFormTextInput: {
    height: 43,
    fontSize: 14,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#eaeaea",
    backgroundColor: "#fafafa",
    paddingLeft: 10,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 5,
    marginBottom: 5,
  },
  loginButton: {
    backgroundColor: "#3897f1",
    borderRadius: 5,
    height: 45,
    marginTop: 10,
    paddingLeft: 10,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 5,
  },
  urlBox: {
    justifyContent: "center",
    height: 43,
    fontSize: 14,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#eaeaea",
    backgroundColor: "#fafafa",
    paddingLeft: 10,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 5,
    marginBottom: 5,
  },
  urlContainer: {
    flexDirection: "row",
    flex: 1,
  },
  urlLabel: {
    justifyContent: "center",
    width: "25%",
    height: 43,
    fontSize: 14,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#eaeaea",
    backgroundColor: "#fafafa",
    paddingLeft: 10,
    marginLeft: 15,
    marginRight: 5,
    marginTop: 5,
    marginBottom: 5,
  },
  userBox: {
    flexDirection: "row",
    alignSelf: "flex-end",
    marginRight: "5%",
    marginTop: 10,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    minHeight: 800,
  },
};

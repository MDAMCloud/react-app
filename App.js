import "react-native-gesture-handler";
import React from "react";
import type { Node } from "react";
import { enableScreens } from "react-native-screens";
import Router from "./src/scenes/router";
import { NavigationContainer } from "@react-navigation/native";
import { LogBox, View } from "react-native";

enableScreens();

LogBox.ignoreAllLogs();

const App: () => Node = () => {
  return (
    <NavigationContainer>
      <Router />
    </NavigationContainer>
  );
};

export default App;

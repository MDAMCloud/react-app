import React from "react";
import { Actions, Scene } from "react-native-router-flux";
import Routes from "../routes/index";

const createScenes = () =>
  Routes.childRoutes.map((route) => (
    <Scene key={route.path} component={route.component} title={route.title} />
  ));

const scenes = Actions.create(
  <Scene key="app" hideNavBar={true}>
    <Scene
      key={Routes.homeRoute.path}
      component={Routes.homeRoute.component}
      initial={true}
      title={Routes.homeRoute.title}
      type="reset"
    />
    <Scene
      key={Routes.loginRoute.path}
      component={Routes.loginRoute.component}
      type="reset"
      title={Routes.loginRoute.title}
    />
    {createScenes()}
  </Scene>
);

export default scenes;

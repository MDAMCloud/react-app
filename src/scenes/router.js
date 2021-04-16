import React from 'react';
import {Router} from 'react-native-router-flux';
import scenes from './scenes';

const getSceneStyle = () => ({
	flex: 1,
	backgroundColor: '#ffffff',
});

export default () => (
	<Router
		onExitApp={() => true}
		scenes={scenes}
		getSceneStyle={getSceneStyle}
	/>
);

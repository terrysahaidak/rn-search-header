import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import { HomeScreen } from './screens/HomeScreen/HomeScreen';
import { CupertinoScreen } from './screens/CupertinoScreen/CupertinoScreen';

export const routes = {
  ios: CupertinoScreen,
};

const StackNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    ...routes,
  },
  {
    initialRouteName: 'Home',
  },
);

const Navigator = createAppContainer(StackNavigator);

function App() {
  return <Navigator />;
}

export default App;

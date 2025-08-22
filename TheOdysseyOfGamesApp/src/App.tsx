import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LobbyScreen from './screens/LobbyScreen';
import SenetGameScreen from './screens/SenetGameScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Lobby">
        <Stack.Screen name="Lobby" component={LobbyScreen} />
        <Stack.Screen name="SenetGame" component={SenetGameScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;



import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LobbyScreen from './screens/LobbyScreen';
import SenetGameScreen from './screens/SenetGameScreen';
import GoGameScreen from './screens/GoGameScreen';
import MancalaGameScreen from './screens/MancalaGameScreen';
import ChaturangaGameScreen from './screens/ChaturangaGameScreen';
import PatolliGameScreen from './screens/PatolliGameScreen';
import HanafudaGameScreen from './screens/HanafudaGameScreen';
import NineMensMorrisGameScreen from './screens/NineMensMorrisGameScreen';
import HnefataflGameScreen from './screens/HnefataflGameScreen';
import PachisiGameScreen from './screens/PachisiGameScreen';
import ProfileScreen from './screens/ProfileScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Lobby">
        <Stack.Screen name="Lobby" component={LobbyScreen} />
        <Stack.Screen name="SenetGame" component={SenetGameScreen} />
        <Stack.Screen name="GoGame" component={GoGameScreen} />
        <Stack.Screen name="MancalaGame" component={MancalaGameScreen} />
        <Stack.Screen name="ChaturangaGame" component={ChaturangaGameScreen} />
        <Stack.Screen name="PatolliGame" component={PatolliGameScreen} />
        <Stack.Screen name="HanafudaGame" component={HanafudaGameScreen} />
        <Stack.Screen name="NineMensMorrisGame" component={NineMensMorrisGameScreen} />
        <Stack.Screen name="HnefataflGame" component={HnefataflGameScreen} />
        <Stack.Screen name="PachisiGame" component={PachisiGameScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;


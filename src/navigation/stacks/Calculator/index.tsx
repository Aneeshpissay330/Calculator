// src/navigation/CalculatorStack.tsx

import React from 'react';
import { useAppSelector } from '../../../app/hooks';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../../../screens/Home';
import History from '../../../screens/History';

const Stack = createStackNavigator();

export type RootStackParamList = {
  Home: undefined;
  History: undefined;
};

export default function CalculatorStack() {
  const isDarkMode = useAppSelector(state => state.theme.darkMode);
  const headerBg   = isDarkMode ? '#505050' : '#d4d4d2';
  const textColor  = isDarkMode ? '#d4d4d2' : '#505050';

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: headerBg,
          elevation: 0,           // Android
          shadowOpacity: 0,       // iOS
          shadowOffset: {         // iOS
            width: 0,
            height: 0,
          },
          shadowRadius: 0,        // iOS
        },
        // If you’re on react-navigation/native-stack v6+, you can also use this:
        headerShadowVisible: false,

        headerTintColor: textColor,
        headerTitleStyle: {
          color: textColor,
          fontFamily: 'RobotoMono-Medium',
        },
      }}
    >
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ title: 'Calculator' }}
      />
      <Stack.Screen
        name="History"
        component={History}
        options={{ title: 'History' }}
      />
    </Stack.Navigator>
  );
}

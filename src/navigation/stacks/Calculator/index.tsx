import { createStackNavigator } from '@react-navigation/stack';
import Home from '../../../screens/Home';
import History from '../../../screens/History';

const Stack = createStackNavigator();

function CalculatorStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#d4d4d2', // Header background
          elevation: 0, // Remove shadow on Android
        },
        headerTitleStyle: {
          color: '#505050', // Header title text color
          fontFamily: 'RobotoMono-Medium',
        },
        headerTintColor: '#505050', // Back button and icon color
      }}
    >
      <Stack.Screen name="Home" component={Home} options={{ title: 'Calculator' }} />
      <Stack.Screen name="History" component={History} />
    </Stack.Navigator>
  );
}

export default CalculatorStack;
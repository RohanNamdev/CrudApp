import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProductManager from './src/screens/ProductManager';

const Stack = createNativeStackNavigator();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem('token');
      setIsLoggedIn(!!token);
    };
    checkLogin();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <>
            <Stack.Screen name="Home">
              {props => (
                <HomeScreen {...props} onLogout={() => setIsLoggedIn(false)} />
              )}
            </Stack.Screen>
            <Stack.Screen options={{headerShown:true}} name="ProductManager" component={ProductManager} />
          </>
        ) : (
          <Stack.Screen name="Login">
            {props => (
              <LoginScreen
                {...props}
                onLoginSuccess={() => setIsLoggedIn(true)}
              />
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

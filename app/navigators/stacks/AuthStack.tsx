import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { LoginScreen } from "../../screens"
import { RegisterScreen } from '../../screens/register/register-screen';
/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 */
type NavigatorStackParamList = {
    login: undefined;
    register: undefined;
  };
  
  const Stack = createNativeStackNavigator<NavigatorStackParamList>();
  export const AuthStack = () => {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="login"
      >
        <Stack.Screen name="login" component={LoginScreen} />
        <Stack.Screen name="register" component={RegisterScreen} />
      </Stack.Navigator>
    );
  };
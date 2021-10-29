import React, { useLayoutEffect } from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { HomeScreen, ExpensesScreen, PurchaseScreen } from "../../screens"
import { createDrawerNavigator } from "@react-navigation/drawer"
import { useStores } from "../../models"
import { ImageStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { color, spacing } from "../../theme"
import { DrawerContent } from "../../screens/drawerContent/DrawerContent"
import { ChecksScreen } from "../../screens/checks/checks-screen"
import { CheckScreen } from "../../screens/check/check-screen"
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
export type NavigatorParamList = {
  ["BNB Bank"]: undefined
  home: undefined
  Checks: undefined
  Check: undefined
  Expenses: undefined
  Purchase: undefined
  login: undefined
  register: undefined
  forgotPassword: undefined
}
const hamburgerContainer: ViewStyle = {
  marginRight: spacing[4] - 1,
  marginTop: spacing[2],
}
const hamburger: ImageStyle = {
  width: 8,
  height: 8,
}
// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<NavigatorParamList>()

export const AppStack = () => {
  const { authenticationStore } = useStores()
  const Drawer = createDrawerNavigator()

  useLayoutEffect(() => {
    return () => {
      authenticationStore.resetStatus()
    }
  }, [authenticationStore])
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {width: 240},
        headerTintColor: color.palette.white,
        headerStyle: {
          backgroundColor: color.secondary,
        },
      }}
      initialRouteName="BNB Bank"
    >
      <Stack.Screen name="BNB Bank" component={HomeScreen} />
      <Stack.Screen name="Expenses" component={ExpensesScreen} />
      <Stack.Screen name="Purchase" component={PurchaseScreen} />
      <Stack.Screen name="Checks" component={ChecksScreen} />
      <Stack.Screen name="Check" component={CheckScreen} />
    </Drawer.Navigator>
  )
}

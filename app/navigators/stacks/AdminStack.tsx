import React, { useLayoutEffect } from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { HomeScreen, ExpensesScreen, PurchaseScreen } from "../../screens"
import { createDrawerNavigator } from "@react-navigation/drawer"
import { useStores } from "../../models"
import { ImageStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { color, spacing } from "../../theme"
import { DrawerContent } from "../../screens/drawerContent/DrawerContent"
import { ChecksScreen } from '../../screens/admin/checks/checks-screen';
import { CheckDetailScreen } from '../../screens/admin/check-detail/check-detail-screen';

export type NavigatorParamList = {
  ["CHECKS CONTROL"]: undefined
  ["CHECK DETAILS"]: undefined
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

export const AdminStack = () => {
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
      initialRouteName="CHECKS CONTROL"
    >
    <Stack.Screen name="CHECKS CONTROL" component={ChecksScreen} />
    <Stack.Screen name="CHECK DETAILS" component={CheckDetailScreen} />
    </Drawer.Navigator>
  )
}
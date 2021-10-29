import React from "react"
import { View, StyleSheet, Text, Dimensions } from "react-native"
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer"
import { color, spacing } from "../../theme"
import { useStores } from "../../models"
import { Icon } from "../../components"

const styles = StyleSheet.create({
  backgroundSignOut: {
    backgroundColor: color.primary,
    paddingBottom: spacing[4],
  },
  bottomDrawerSection: {
    borderTopColor: "#f4f4f4",
    borderTopWidth: 1,
    marginBottom: 15,
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  drawerContent: {
    flex: 1,
  },
  drawerOptions: {
    backgroundColor: color.primary,
    height: Dimensions.get("window").height,
  },
  drawerRoot: {
    backgroundColor: color.secondary,
    flex: 1,
  },
  drawerSection: {
    marginTop: 15,
  },
  logoDrawerOptions: {
    color: color.quinary,
    width: spacing[6],
  },
  paragraph: {
    fontWeight: "bold",
    marginRight: 3,
  },
  preference: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: 20,
  },
  section: {
    alignItems: "center",
    flexDirection: "row",
    marginRight: 15,
  },
  textColor: {
    color: color.palette.white,
  },
  textTitle: {
    fontSize: 32,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 3,
  },
  userInfoSection: {
    alignItems: "center",
    padding: spacing[4],
  },
})

export function DrawerContent(props) {
  const { authenticationStore } = useStores()
  return (
    <View style={styles.drawerRoot}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <Text style={[styles.textColor, styles.textTitle]}>BNB Bank</Text>
          </View>

          <View style={styles.drawerOptions}>
            <DrawerItem
              icon={() => (
                <Icon
                  type="font-awesome-5"
                  name="balance-scale-right"
                  iconStyle={styles.logoDrawerOptions}
                />
              )}
              label={() => <Text style={styles.textColor}>BALANCE</Text>}
              onPress={() => {
                props.navigation.navigate("BNB Bank")
              }}
            />
            <DrawerItem
              icon={() => (
                <Icon
                  type="font-awesome-5"
                  name="level-up-alt"
                  iconStyle={styles.logoDrawerOptions}
                />
              )}
              label={() => <Text style={styles.textColor}>INCOMES</Text>}
            />
            <DrawerItem
              icon={() => (
                <Icon
                  type="font-awesome-5"
                  name="level-down-alt"
                  iconStyle={styles.logoDrawerOptions}
                />
              )}
              label={() => <Text style={styles.textColor}>EXPENSES</Text>}
              onPress={() => {
                props.navigation.navigate("Expenses")
              }}
            />
            <DrawerItem
              icon={() => (
                <Icon
                  type="font-awesome-5"
                  name="money-check-alt"
                  iconStyle={styles.logoDrawerOptions}
                />
              )}
              label={() => <Text style={styles.textColor}>CHECKS</Text>}
              onPress={() => {
                props.navigation.navigate("Checks")
              }}
            />
            <DrawerItem
              icon={() => (
                <Icon type="ionicons" name="notifications" iconStyle={styles.logoDrawerOptions} />
              )}
              label={() => <Text style={styles.textColor}>NOTIFICATIONS</Text>}
            />
            <DrawerItem
              icon={() => (
                <Icon
                  type="ionicons"
                  name="person"
                  size={24}
                  iconStyle={styles.logoDrawerOptions}
                />
              )}
              label={() => <Text style={styles.textColor}>PROFILE</Text>}
            />
            <DrawerItem
              icon={() => (
                <Icon type="ionicons" name="settings" iconStyle={styles.logoDrawerOptions} />
              )}
              label={() => <Text style={styles.textColor}>SETTINGS</Text>}
            />
            <DrawerItem
              icon={() => (
                <Icon type="entypo" name="help-with-circle" iconStyle={styles.logoDrawerOptions} />
              )}
              label={() => <Text style={styles.textColor}>HELP</Text>}
            />
          </View>
        </View>
      </DrawerContentScrollView>
      <View style={styles.backgroundSignOut}>
        <DrawerItem
          icon={() => <Icon type="ant-design" name="logout" iconStyle={styles.logoDrawerOptions} />}
          label="SIGN OUT"
          onPress={() => {
            authenticationStore.logout()
          }}
        />
      </View>
    </View>
  )
}

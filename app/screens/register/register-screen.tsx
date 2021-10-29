import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { View, StyleSheet } from "react-native"
import { Button, Screen, Text, TextField, AutoImage as Image } from "../../components"
import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { color, spacing } from "../../theme"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../../navigators/stacks"
import { Controller, useForm } from "react-hook-form"
import { useStores } from "../../models"

const styles = StyleSheet.create({
  button: {
    height: 48,
    marginTop: spacing[6],
  },
  buttonText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  input: {
    borderColor: color.secondary,
    borderRadius: 100,
    borderWidth: 2,
    height: 24,
    padding: 10,
  },
  logoBackground: {
    alignItems: "center",
    backgroundColor: color.primary,
    height: 120,
    justifyContent: "flex-end",
    width: "100%",
  },
  logoText: {
    color: color.palette.white,
    fontSize: 24,
    marginBottom: spacing[3],
  },
  root: {
    alignItems: "center",
    flex: 1,
  },
  view: {
    flexDirection: "column",
    width: "80%",
  },
})

type FormData = {
  emailAddress: string
  password: string
  userName: string
}

export const RegisterScreen: FC<StackScreenProps<NavigatorParamList, "register">> = observer(
  function RegisterScreen({ navigation }) {
    // Pull in one of our MST stores
    const { authenticationStore } = useStores()

    const loginScreen = () => navigation.navigate("login")
    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<FormData>()

    const onRegister = async (data: FormData) =>{
      await authenticationStore.register(data.emailAddress, data.password, data.userName)
      loginScreen()
    }

    return (
      <Screen style={styles.root} preset="scroll" unsafe>
        <View style={styles.logoBackground}>
          <Text style={styles.logoText}>BNB Bank</Text>
        </View>
        <View style={styles.view}>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                inputStyle={styles.input}
                placeholderTx="loginScreen.email"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                errors={errors}
                name="emailAddress"
                autoCapitalize='none'
              />
            )}
            name="emailAddress"
            defaultValue=""
          />

          <Controller
            control={control}
            rules={{
              required: true,
              minLength: 6,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                inputStyle={styles.input}
                placeholderTx="loginScreen.password"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                errors={errors}
                name="password"
              />
            )}
            name="password"
            defaultValue=""
          />

          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                inputStyle={styles.input}
                placeholderTx="loginScreen.username"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                errors={errors}
                name="userName"
                autoCapitalize='none'
              />
            )}
            name="userName"
            defaultValue=""
          />

          <Button
            style={styles.button}
            textStyle={styles.buttonText}
            tx={"loginScreen.signUp"}
            onPress={handleSubmit(onRegister)}
          />
          <Button
            style={styles.button}
            textStyle={styles.buttonText}
            tx={"loginScreen.back"}
            onPress={loginScreen}
          />
        </View>
      </Screen>
    )
  },
)

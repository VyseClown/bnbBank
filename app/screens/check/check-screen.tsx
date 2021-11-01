import React, { FC, useEffect, useState } from "react"
import { View, StyleSheet } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { Controller, useForm } from "react-hook-form"
import * as ImagePicker from "expo-image-picker"
import {
  CardItem,
  Button,
  Screen,
  Text,
  AutoImage as Image,
  TextField,
  Icon,
} from "../../components"
import { color, spacing } from "../../theme"
import { NavigatorParamList } from "../../navigators"
import { TouchableOpacity } from "react-native-gesture-handler"
import { useStores } from "../../models"
import { loadString } from "../../utils/storage"
import { useRecoilState, useRecoilValue } from "recoil"
import { allTransactionsState, balance } from "../../recoil"
import { formatter } from "../../utils/currency-formatter"
import { Transaction } from "../../models/transaction/transaction"

const styles = StyleSheet.create({
  button: {
    height: 48,
    marginTop: spacing[6],
  },
  buttonText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  containerImageUploader: {
    backgroundColor: color.palette.white,
    borderColor: color.secondary,
    borderStyle: "dashed",
    borderWidth: 1,
    elevation: 2,
    height: 200,
    marginTop: spacing[6],
    overflow: "hidden",
    position: "relative",
  },
  dateButton: {
    alignItems: "center",
    flexDirection: "row",
  },
  input: {
    borderBottomColor: color.secondary,
    borderBottomWidth: 1,
    height: 24,
    padding: 10,
  },
  label: {
    color: color.secondary,
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
  secondaryPath: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing[6],
  },
  uploadBtn: {
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
  },
  uploadBtnContainer: {
    backgroundColor: "lightgrey",
    bottom: 0,
    height: "25%",
    opacity: 0.7,
    position: "absolute",
    right: 0,
    width: "100%",
  },
  view: {
    flexDirection: "column",
    width: "80%",
  },
})

type FormData = {
  amount: string
  description: string
}

export const CheckScreen: FC<StackScreenProps<NavigatorParamList, "check">> = observer(
  ({ navigation }) => {
    const [allTransactions, setAllTransactions] = useRecoilState(allTransactionsState)
    const balanceValue = useRecoilValue(balance)
    const { transactionStore } = useStores()
    const [image, setImage] = useState(null)
    const addImage = async () => {
      const _image = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      })

      console.log(JSON.stringify(_image))

      if (!_image.cancelled) {
        setImage(_image.uri)
      }
    }

    const {
      register,
      reset,
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<FormData>()

    const normalizeToNumber = (value: string) => {
      return Number(value.replace(/[^0-9\.-]+/g, ""))
    }

    const onNewTransaction = async (data: FormData) => {
      const { description, amount } = data
      const userName = await loadString("userName")
      const newTransaction: Transaction = {
        value: normalizeToNumber(amount).toString(),
        description,
        date: new Date().toString(),
        userName,
        type: "income",
        state: "pending",
        checkImageURI: image,
      }
      const newPurchase = await transactionStore.newPurchase(newTransaction)
      setAllTransactions([...allTransactions, newPurchase])
      setImage(null)
      navigation.navigate("BNB Bank")
    }
    useEffect(() => {
      register("amount")
      register("description")
    }, [register])

    return (
      <Screen style={styles.root} backgroundColor={color.palette.white} unsafe>
        <CardItem header={"Current balance"} value={`${formatter.format(balanceValue)}`}></CardItem>
        <View style={styles.view}>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, value } }) => (
              <View>
                <TextField
                  inputStyle={styles.input}
                  labelTx="purchaseScreen.amount"
                  labelTxStyle={styles.label}
                  leftIcon={{
                    type: "font-awesome",
                    name: "money",
                    color: color.secondary,
                    marginRight: 10,
                  }}
                  onFocus={() => {
                    onChange("")
                  }}
                  onBlur={() => {
                    const numberValue = parseFloat(value)
                    const newValue = String(value).replace(/[^0-9]/g, "")
                    const numberNewValue = parseFloat(newValue)
                    if (numberNewValue === numberValue) onChange(formatter.format(Number(newValue)))
                  }}
                  onChangeText={(value) => {
                    onChange(value.replace(/[^$.,0-9]/g, ""))
                  }}
                  value={value}
                  errors={errors}
                  name="amount"
                />
                <Text tx={"purchaseScreen.messageCheck"} style={{ color: color.secondary }} />
              </View>
            )}
            name="amount"
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
                labelTx="purchaseScreen.description"
                labelTxStyle={styles.label}
                leftIcon={{
                  type: "font-awesome",
                  name: "star",
                  color: color.secondary,
                  marginRight: 10,
                }}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                errors={errors}
                name="description"
              />
            )}
            name="description"
            defaultValue=""
          />
          <View style={styles.containerImageUploader}>
            {image && <Image source={{ uri: image }} style={{ width: "100%", height: "100%" }} />}

            <View style={styles.uploadBtnContainer}>
              <TouchableOpacity onPress={addImage} style={styles.uploadBtn}>
                <Text tx={image ? "purchaseScreen.edit" : "purchaseScreen.upload"}>
                  {image ? "Edit" : "Upload"}
                </Text>
                <Icon type="font-awesome" name="cloud-upload" color={color.primary} />
              </TouchableOpacity>
            </View>
          </View>
          <Button
            style={styles.button}
            textStyle={styles.buttonText}
            tx={"purchaseScreen.depositCheck"}
            onPress={handleSubmit(onNewTransaction)}
          />
        </View>
      </Screen>
    )
  },
)

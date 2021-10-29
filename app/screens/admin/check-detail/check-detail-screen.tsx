import React, { FC, useState } from "react"
import {
  View,
  StyleSheet,
} from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { useForm } from "react-hook-form"
import {
  Button,
  Screen,
  AutoImage as Image,
  TextField,
} from "../../../components"
import { color, spacing } from "../../../theme"
import { NavigatorParamList } from "../../../navigators"
import { useStores } from "../../../models"
import { useRecoilState, useRecoilValue } from "recoil"
import {
  allTransactionsState,
  balance,
  selectedTransactionState,
} from "../../../recoil"
import { formatter } from "../../../utils/currency-formatter"

const styles = StyleSheet.create({
  buttonAccept: {
    height: 48,
    marginTop: spacing[6],
    width: "45%",
  },
  buttonReject: {
    backgroundColor: color.palette.white,
    borderColor: color.primary,
    borderWidth: 1,
    color: color.primary,
    height: 48,
    marginTop: spacing[6],
    width: "45%",
  },
  buttonTextAccept: {
    fontSize: 12,
    fontWeight: "bold",
  },
  buttonTextReject: {
    color: color.primary,
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

export const CheckDetailScreen: FC<
  StackScreenProps<NavigatorParamList, "CHECK DETAILS">
> = observer(({ navigation }) => {
  const [selectedTransaction, setSelectedTransaction] = useRecoilState(selectedTransactionState)
  const [allTransactions, setAllTransactions] = useRecoilState(allTransactionsState)
  const { transactionStore } = useStores()
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false)

  const { handleSubmit } = useForm<FormData>()

  const onAcceptTransaction = async () => {
    await transactionStore.transactionUpdate(selectedTransaction.id, "approved")
    const newTransactions = allTransactions.filter(
      (transaction) => transaction.id !== selectedTransaction.id,
    )
    setAllTransactions(newTransactions)
    navigation.navigate("CHECKS CONTROL")
  }
  const onRejectTransaction = async () => {
    const newPurchase = await transactionStore.transactionUpdate(selectedTransaction.id, "rejected")
    const newTransactions = allTransactions.filter(
      (transaction) => transaction.id !== selectedTransaction.id,
    )
    setAllTransactions(newTransactions)
    navigation.navigate("CHECKS CONTROL")
  }
  return (
    <Screen style={styles.root} backgroundColor={color.palette.white} unsafe>
      <View style={styles.view}>
        <TextField
          editable={false}
          inputStyle={styles.input}
          labelTx="purchaseScreen.customer"
          labelTxStyle={styles.label}
          leftIcon={{
            type: "ionicons",
            name: "person",
            color: color.secondary,
            marginRight: 10,
          }}
          value={selectedTransaction.userName}
          name="username"
        />
        <TextField
          editable={false}
          inputStyle={styles.input}
          labelTx="purchaseScreen.description"
          labelTxStyle={styles.label}
          leftIcon={{
            type: "font-awesome",
            name: "star",
            color: color.secondary,
            marginRight: 10,
          }}
          value={selectedTransaction.description}
          name="description"
        />
        <TextField
          editable={false}
          inputStyle={styles.input}
          labelTx="purchaseScreen.amount"
          labelTxStyle={styles.label}
          leftIcon={{
            type: "font-awesome",
            name: "money",
            color: color.secondary,
            marginRight: 10,
          }}
          value={formatter.format(Number(selectedTransaction.value))}
          name="amount"
        />

        <View style={styles.containerImageUploader}>
          {selectedTransaction?.checkImageURI && (
            <Image
              source={{ uri: selectedTransaction.checkImageURI }}
              style={{ width: "100%", height: "100%" }}
            />
          )}
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Button
            style={styles.buttonReject}
            textStyle={styles.buttonTextReject}
            tx={"purchaseScreen.reject"}
            onPress={handleSubmit(onRejectTransaction)}
          />
          <Button
            style={styles.buttonAccept}
            textStyle={styles.buttonTextAccept}
            tx={"purchaseScreen.accept"}
            onPress={handleSubmit(onAcceptTransaction)}
          />
        </View>
      </View>
    </Screen>
  )
})

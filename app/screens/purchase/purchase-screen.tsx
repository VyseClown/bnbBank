import React, { FC, useEffect, useState } from "react"
import { View, StyleSheet } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { Controller, useForm } from "react-hook-form"
import { CardItem, Button, Screen, TextField, MessageOverlay } from "../../components"
import { color, spacing } from "../../theme"
import { NavigatorParamList } from "../../navigators"
import { TouchableOpacity } from "react-native-gesture-handler"
import DateTimePickerModal from "react-native-modal-datetime-picker"
import { returnStringMonth } from "../../utils/return-string-month"
import { useStores } from "../../models"
import { loadString } from "../../utils/storage"
import { useRecoilState, useRecoilValue } from "recoil"
import { allTransactionsState, balance, incomeTotal, expenseTotal } from "../../recoil"
import { formatter } from "../../utils/currency-formatter"
import { Transaction } from "../../models/transaction/transaction"

const secureLogin = require("../../../assets/images/secureLogin.png")

const styles = StyleSheet.create({
  button: {
    height: 48,
    marginTop: spacing[6],
  },
  buttonText: {
    fontSize: 12,
    fontWeight: "bold",
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
  view: {
    flexDirection: "column",
    width: "80%",
  },
})

type FormData = {
  amount: string
  date: string
  description: string
}

export const PurchaseScreen: FC<StackScreenProps<NavigatorParamList, "purchase">> = observer(
  ({ navigation }) => {
    const [allTransactions, setAllTransactions] = useRecoilState(allTransactionsState)
    const balanceValue = useRecoilValue(balance)
    const incomeValue = useRecoilValue(incomeTotal)
    const expenseValue = useRecoilValue(expenseTotal)
    const { transactionStore } = useStores()
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false)
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [formattedDate, setFormattedDate] = useState("")
    const [teste, setTeste] = useState("")
    const [fetchedData, setFetchedData] = useState([])

    const {
      register,
      reset,
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<FormData>()

    useEffect(() => {
      const stringMonth = returnStringMonth(selectedDate.getMonth())
      loadString("userName").then((storedUserName) => {
        transactionStore.transactionsFiltered(storedUserName, selectedDate).then((data: any) => {
          setAllTransactions(data)
          const dataFilter = data
            .filter((item: any) => {
              return new Date(item.date).getMonth() >= selectedDate.getMonth()
            })
            .sort((a, b) => (a.date > b.date ? -1 : 1))
          setFetchedData(dataFilter)
        })
      })
      setFormattedDate(`${stringMonth} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`)
    }, [selectedDate])

    useEffect(() => {
      register("amount")
      register("description")
    }, [register])

    const showDatePicker = () => {
      setDatePickerVisibility(true)
    }

    const hideDatePicker = () => {
      setDatePickerVisibility(false)
    }

    const handleConfirm = (date: Date) => {
      setSelectedDate(date)
      hideDatePicker()
    }

    const normalizeToNumber = (value: string) => {
      return Number(value.replace(/[^0-9\.-]+/g, ""))
    }

    const onNewTransaction = async (data: FormData) => {
      const { amount } = data
      if (canMakePurchase(amount)) {
        const { description } = data
        const userName = await loadString("userName")
        const newTransaction: Transaction = {
          value: normalizeToNumber(amount).toString(),
          description,
          date: selectedDate,
          userName,
          type: "expense",
          state: "approved",
        }
        const newPurchase = await transactionStore.newPurchase(newTransaction)
        setAllTransactions([...allTransactions, newPurchase])
        reset()
        navigation.navigate("BNB Bank")
      }
    }

    const canMakePurchase = (amount: string) => {
      return balanceValue - normalizeToNumber(amount) >= 0
    }

    return (
      <Screen style={styles.root} backgroundColor={color.palette.white} unsafe>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
        <CardItem header={"Current balance"} value={`${formatter.format(balanceValue)}`}>
          <TouchableOpacity style={styles.dateButton} onPress={showDatePicker} />
        </CardItem>
        <View style={styles.view}>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, value } }) => (
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
                  setTeste(value)
                  onChange(value.replace(/[^$.,0-9]/g, ""))
                }}
                value={value}
                errors={errors}
                name="amount"
              />
            )}
            name="amount"
            defaultValue=""
          />

          <TouchableOpacity onPress={showDatePicker}>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur } }) => (
                <View>
                  <TextField
                    editable={false}
                    inputStyle={styles.input}
                    labelTx="purchaseScreen.date"
                    labelTxStyle={styles.label}
                    leftIcon={{
                      type: "fontisto",
                      name: "date",
                      color: color.secondary,
                      marginRight: 10,
                    }}
                    value={formattedDate}
                    errors={errors}
                    name="date"
                  />
                </View>
              )}
              name="date"
              defaultValue=""
            />
          </TouchableOpacity>

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

          <Button
            style={styles.button}
            textStyle={styles.buttonText}
            tx={"purchaseScreen.addPurchase"}
            onPress={handleSubmit(onNewTransaction)}
          />
        </View>
      </Screen>
    )
  },
)

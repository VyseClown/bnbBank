import React, { FC, useEffect, useState } from "react"
import { StyleSheet } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { CardItem, Screen, Text, TransactionsList } from "../../components"
import { color, spacing } from "../../theme"
import { NavigatorParamList } from "../../navigators"
import { AntDesign } from "@expo/vector-icons"
import { TouchableOpacity } from "react-native-gesture-handler"
import DateTimePickerModal from "react-native-modal-datetime-picker"
import { returnStringMonth } from "../../utils/return-string-month"
import { useStores } from "../../models"
import { loadString } from "../../utils/storage"
import { useRecoilState, useRecoilValue } from "recoil"
import { allTransactionsState, balance, incomeTotal, expenseTotal } from "../../recoil"
import { formatter } from "../../utils/currency-formatter"

const iconDown = () => <AntDesign name="down" size={24} color={color.palette.white} />
const iconPlus = () => <AntDesign name="plus" size={24} color={color.primary} />

const styles = StyleSheet.create({
  balanceButton: {
    alignItems: "center",
    minWidth: 128,
    width: "50%",
  },
  balanceButtonText: {
    fontSize: 15,
  },
  container: {
    backgroundColor: color.palette.white,
  },
  dateButton: {
    alignItems: "center",
    flexDirection: "row",
  },
  dateButtonText: {
    color: color.palette.white,
    fontSize: 18,
    marginRight: spacing[2],
  },
})

export const HomeScreen: FC<StackScreenProps<NavigatorParamList, "BNB Bank">> = observer(
  ({ navigation }) => {
    const [allTransactions, setAllTransactions] = useRecoilState(allTransactionsState)
    const balanceValue = useRecoilValue(balance)
    const incomeValue = useRecoilValue(incomeTotal)
    const expenseValue = useRecoilValue(expenseTotal)
    const { transactionStore } = useStores()
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false)
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [formattedDate, setFormattedDate] = useState("")
    const [fetchedData, setFetchedData] = useState([])
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
      setFormattedDate(`${stringMonth}, ${selectedDate.getFullYear()}`)
    }, [selectedDate])

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
    const handleClickAddExpense = () => {
      navigation.navigate("Purchase")
    }
    const handleClickAddCheck = () => {
      navigation.navigate("Check")
    }

    return (
      <Screen style={styles.container} backgroundColor={color.transparent} unsafe>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
        <CardItem header={"Current balance"} value={`${formatter.format(balanceValue)}`}>
          <TouchableOpacity style={styles.dateButton} onPress={showDatePicker}>
            <Text style={styles.dateButtonText}>{formattedDate}</Text>
            {iconDown()}
          </TouchableOpacity>
        </CardItem>
        <CardItem
          style={{ backgroundColor: color.tertiary }}
          header={"Incomes"}
          value={formatter.format(incomeValue)}
          textStyle={{ color: color.primary }}
        >
          <TouchableOpacity style={styles.balanceButton} onPress={handleClickAddCheck}>
            {iconPlus()}
            <Text style={styles.balanceButtonText} text="Deposit a check" />
          </TouchableOpacity>
        </CardItem>
        <CardItem
          style={{ backgroundColor: color.quaternary }}
          header={"Expenses"}
          value={formatter.format(expenseValue)}
          textStyle={{ color: color.primary }}
        >
          <TouchableOpacity style={styles.balanceButton} onPress={handleClickAddExpense}>
            {iconPlus()}
            <Text style={styles.balanceButtonText} text="Purchase" />
          </TouchableOpacity>
        </CardItem>
        <TransactionsList title={"TRANSACTIONS"} data={fetchedData} />
      </Screen>
    )
  },
)

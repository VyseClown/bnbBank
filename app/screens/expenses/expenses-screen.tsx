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
import { useRecoilState } from "recoil"
import { allTransactionsState } from "../../recoil"
import { FAB } from "react-native-elements"

const iconDown = () => <AntDesign name="down" size={24} color={color.palette.white} />

const styles = StyleSheet.create({
  buttonAddExpense: {
    alignItems: "center",
    bottom: 30,
    height: 50,
    justifyContent: "center",
    position: "absolute",
    right: 30,
    width: 50,
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

export const ExpensesScreen: FC<StackScreenProps<NavigatorParamList, "expenses">> = observer(
  ({ navigation }) => {
    const [allTransactions, setAllTransactions] = useRecoilState(allTransactionsState)
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
            .filter((item) => item.type === "expense")
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

    return (
      <Screen style={styles.container} backgroundColor={color.transparent} unsafe>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
        <CardItem header={""} value={""}>
          <TouchableOpacity style={styles.dateButton} onPress={showDatePicker}>
            <Text style={styles.dateButtonText}>{formattedDate}</Text>
            {iconDown()}
          </TouchableOpacity>
        </CardItem>
        <TransactionsList title={""} data={fetchedData} />
        <FAB
          style={styles.buttonAddExpense}
          icon={{ name: "add", color: color.palette.white }}
          onPress={handleClickAddExpense}
          color={color.primary}
          size={"large"}
        ></FAB>
      </Screen>
    )
  },
)

import React, { FC, useEffect, useState } from "react"
import { StyleSheet } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { Screen, TransactionsList } from "../../../components"
import { color } from "../../../theme"
import { NavigatorParamList } from "../../../navigators"
import { returnStringMonth } from "../../../utils/return-string-month"
import { useStores } from "../../../models"
import { loadString } from "../../../utils/storage"
import { useRecoilState } from "recoil"
import { allTransactionsState, selectedDateState } from "../../../recoil"

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.palette.white,
  },
})

export const IncomesTab: FC<StackScreenProps<NavigatorParamList, "incomes">> = observer(
  () => {
    const [allTransactions, setAllTransactions] = useRecoilState(allTransactionsState)
    const [selectedDate, setSelectedDate] = useRecoilState(selectedDateState)
    const { transactionStore } = useStores()
    const [formattedDate, setFormattedDate] = useState("")
    const [fetchedData, setFetchedData] = useState([])
    useEffect(() => {
      const stringMonth = returnStringMonth(selectedDate.getMonth())
      loadString("userName").then((storedUserName) => {
        transactionStore.transactionsFiltered(storedUserName, selectedDate).then((data: any) => {
          setAllTransactions(data)
          const dataFilter = data
            .filter((item: any) => {
              return Number(new Date(item.date).getMonth()) === Number(selectedDate.getMonth())
            })
            .filter((item) => item.type === "income" && item.incomeType === "check")
            .sort((a, b) => (a.date > b.date ? -1 : 1))
          setFetchedData(dataFilter)
        })
      })
      setFormattedDate(`${stringMonth}, ${selectedDate.getFullYear()}`)
    }, [selectedDate])

    return (
      <Screen style={styles.container} unsafe>
        <TransactionsList title={""} data={fetchedData} />
      </Screen>
    )
  },
)

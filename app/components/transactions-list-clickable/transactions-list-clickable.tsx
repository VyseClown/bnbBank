import * as React from "react"
import { View, ViewStyle, TextStyle, StyleProp, FlatList, TouchableOpacity } from "react-native"
import { Text } from "../text/text"
import { color, spacing } from "../../theme"
import { formatter } from "../../utils/currency-formatter"
import { CardItem, Empty } from ".."
import { useRecoilState } from "recoil"
import { selectedTransactionState } from "../../recoil"

const CONTAINER_LIST: ViewStyle = {
  flex: 1,
  paddingTop: 22,
}
const TITLE_LIST_HEADER: TextStyle = {
  paddingHorizontal: spacing[4],
}
const VALUE_TRANSACTION_TEXT_TYPE = (type) => ({
  color: type === "income" ? color.primary : color.danger,
  fontSize: 18,
  marginRight: spacing[2],
})

export interface TransactionsListProps {
  title: string
  data: any
  handleClick: (item: any) => void
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>

  /**
   * An optional style override useful for the button text.
   */
  textStyle?: StyleProp<TextStyle>
}
const SUB_TEXT_TRANSACTIONS: TextStyle = { color: color.primary, fontSize: 16 }
export function TransactionsListClickable(props: TransactionsListProps) {
  const { title, data, style: styleOverride, textStyle: textStyleOverride, handleClick } = props
  const viewStyles = [CONTAINER_LIST, styleOverride]
  const textStyles = [TITLE_LIST_HEADER, textStyleOverride]
  return (
    <View style={viewStyles}>
      <Text style={textStyles}>{title}</Text>
      <FlatList
        data={data}
        ListEmptyComponent={Empty}
        renderItem={({ item }) => {
          const { date: dateString } = item
          const date = new Date(dateString)
          const formattedDate =
            date.getUTCFullYear() +
            "/" +
            (date.getUTCMonth() + 1) +
            "/" +
            date.getUTCDate() +
            " " +
            date.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            })
          return (
            <TouchableOpacity onPress={() => handleClick(item)}>
              <CardItem
                key={item.key}
                style={{ backgroundColor: color.palette.white }}
                header={item.description}
                value={formattedDate}
                textStyle={SUB_TEXT_TRANSACTIONS}
              >
                <Text
                  style={VALUE_TRANSACTION_TEXT_TYPE(item.type)}
                  text={formatter.format(item.value)}
                />
              </CardItem>
            </TouchableOpacity>
          )
        }}
      />
    </View>
  )
}

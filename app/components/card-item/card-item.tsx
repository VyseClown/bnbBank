import * as React from "react"
import { View, ViewStyle, ImageStyle, TextStyle, Dimensions, StyleProp } from "react-native"
import { Text } from "../text/text"
import { Icon } from "../icon/icon"
import { color, spacing, typography } from "../../theme"

const TEXT: TextStyle = {
  color: color.palette.white,
  fontFamily: typography.primary,
}
const BOLD: TextStyle = { fontWeight: "bold" }
const HEADER_CONTAINER: ViewStyle = {
  justifyContent: "center",
  paddingVertical: spacing[1],
  backgroundColor: color.secondary,
  width: Dimensions.get("window").width,
}
const TITLE_HEADER: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 14,
  lineHeight: 24,
  paddingLeft: spacing[4],
}
const TEXT_SUBHEADER_CONTAINER: ViewStyle = {
  paddingHorizontal: spacing[4],
  alignItems: "center",
  flexDirection: "row",
  justifyContent: "space-between",
}
const TITLE: TextStyle = {
  ...TEXT,
  fontSize: 24,
  lineHeight: 24,
  textAlign: "center",
}
const VALUE: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 24,
  lineHeight: 24,
  textAlign: "center",
}
const textHeaderContainer: ViewStyle = {
  alignContent: "flex-start",
}

export interface CardItemProps {
  header: string
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>

  /**
   * An optional style override useful for the button text.
   */
  textStyle?: StyleProp<TextStyle>
  value?: string
  text?: string
  children?: React.ReactNode
}

export function CardItem(props: CardItemProps) {
  const {
    header,
    text,
    value,
    children,
    style: styleOverride,
    textStyle: textStyleOverride,
  } = props

  const viewStyles = [HEADER_CONTAINER, styleOverride]
  const textStyles = [textHeaderContainer, textStyleOverride]
  const content = text || children
  return (
      <View style={viewStyles}>
        <View style={textHeaderContainer}>
          {header !== '' && <Text style={[TITLE_HEADER, textStyles]} text={header} />}
        </View>
        <View style={TEXT_SUBHEADER_CONTAINER}>
          {value !== '' && <Text style={[TITLE, textStyles]} text={value} />}
          {content}
        </View>
      </View>
  )
}

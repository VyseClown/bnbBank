import React, { Fragment } from "react"
import { StyleProp, TextInput, TextInputProps, TextStyle, View, ViewStyle } from "react-native"
import { color, spacing, typography } from "../../theme"
import { translate, TxKeyPath } from "../../i18n"
import { Text } from "../text/text"
import { FieldError, FieldErrors } from "react-hook-form"
import { isObjectEmpty } from "../../utils/is-object-empty"
import { renderNode } from "../../helpers"
import { Icon, IconNode } from "../"
// the base styling for the container
const CONTAINER: ViewStyle = {
  paddingVertical: spacing[3],
}

// the base styling for the TextInput
const INPUT: TextStyle = {
  fontFamily: typography.primary,
  color: color.text,
  minHeight: 44,
  fontSize: 18,
  backgroundColor: color.palette.white,
}

const inputContainerStyle: ViewStyle = { flexDirection: "row", alignItems: "center" }

// currently we have no presets, but that changes quickly when you build your app.
const PRESETS: { [name: string]: ViewStyle } = {
  default: {},
}

export interface TextFieldProps extends TextInputProps {
  name: string
  /**
   * Object of errors from react-hook-form.
   */
  errors: FieldErrors
  /**
   * The placeholder i18n key.
   */
  placeholderTx?: TxKeyPath

  /**
   * The Placeholder text if no placeholderTx is provided.
   */
  placeholder?: string

  /**
   * The label i18n key.
   */
  labelTx?: TxKeyPath

  /**
   * The label text if no labelTx is provided.
   */
  label?: string

  /**
   * Optional container style overrides useful for margins & padding.
   */
  style?: StyleProp<ViewStyle>
  labelTxStyle?: StyleProp<ViewStyle>
  leftIcon?: IconNode

  /**
   * Optional style overrides for the input.
   */
  inputStyle?: StyleProp<TextStyle>

  /**
   * Various look & feels.
   */
  preset?: keyof typeof PRESETS

  forwardedRef?: any
}

/**
 * A component which has a label and an input together.
 */
export function TextField(props: TextFieldProps) {
  const {
    placeholderTx,
    placeholder,
    labelTx,
    labelTxStyle,
    label,
    preset = "default",
    style: styleOverride,
    inputStyle: inputStyleOverride,
    forwardedRef,
    leftIcon,
    errors = {},
    name,
    ...rest
  } = props

  const containerStyles = [CONTAINER, PRESETS[preset], styleOverride]
  const inputStyles = [INPUT, inputStyleOverride]
  const actualPlaceholder = placeholderTx ? translate(placeholderTx) : placeholder
  return (
    <View style={containerStyles}>
      <View style={inputContainerStyle}>
        {leftIcon && <Fragment>{renderNode(Icon, leftIcon)}</Fragment>}
        <Text preset="fieldLabel" style={labelTxStyle} tx={labelTx} text={label} />
      </View>

      <TextInput
        placeholder={actualPlaceholder}
        placeholderTextColor={color.palette.lighterGrey}
        underlineColorAndroid={color.transparent}
        {...rest}
        style={inputStyles}
        ref={forwardedRef}
      />
      {isObjectEmpty(errors[name]) ? (
        <>
          <Text key={`${name}mockError`} preset="error">
            {""}
          </Text>
        </>
      ) : (
        Object.values(errors).map((error: FieldError, index) => {
          return (
            <Fragment key={index}>
              {name === error.ref.name && error.type === "required" && (
                <Text key={`${error.ref.name}required`} preset="error">
                  This is required
                </Text>
              )}
              {name === error.ref.name && error.type === "maxLength" && (
                <Text key={`${error.ref.name}maxLength`} preset="error">
                  Max length exceeded
                </Text>
              )}
              {name === error.ref.name && error.type === "minLength" && (
                <Text key={`${error.ref.name}minLength`} preset="error">
                  Min length required
                </Text>
              )}
            </Fragment>
          )
        })
      )}
    </View>
  )
}

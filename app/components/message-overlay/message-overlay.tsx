import React from "react"
import { ImageProps, View, StyleSheet } from "react-native"
import { Overlay } from "react-native-elements"
import { Text } from ".."
import { TxKeyPath } from "../../i18n"
import { spacing } from "../../theme"
import { AutoImage as Image } from "../auto-image/auto-image"

interface MessageOverlayProps {
  error: TxKeyPath
  isVisible: boolean
  setIsVisible: () => void
  backImage?: ImageProps
}

const styles = StyleSheet.create({
  image: {
    alignSelf: "center",
    height: 254,
    marginVertical: spacing[5],
    maxHeight: "100%",
    maxWidth: "100%",
    width: 343,
  },
  overlay: {
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    height: "auto",
    justifyContent: "center",
    padding: 20,
    width: "90%",
  },
})

export const MessageOverlay = ({
  error,
  isVisible,
  setIsVisible,
  backImage,
}: MessageOverlayProps) => {
  return (
    <Overlay
      isVisible={isVisible}
      onBackdropPress={setIsVisible}
      overlayStyle={styles.overlay}
    >
      <View>
        <Text tx={error} />
        {backImage && <Image source={backImage} style={styles.image} />}
      </View>
    </Overlay>
  )
}

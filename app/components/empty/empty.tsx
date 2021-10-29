import React from "react"
import { StyleSheet, View } from "react-native"
import { Text } from ".."
import { spacing } from "../../theme"
import { AutoImage as Image } from "../auto-image/auto-image"

const emptyImage = require("../../../assets/images/nodata.png")
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    alignSelf: "center",
    height: 254,
    marginVertical: spacing[5],
    maxHeight: "100%",
    maxWidth: "100%",
    width: 343,
  },
})
export function Empty() {
  return (
    <View style={styles.container}>
      <Image source={emptyImage} style={styles.image} />
      <Text tx={"common.empty"} />
    </View>
  )
}

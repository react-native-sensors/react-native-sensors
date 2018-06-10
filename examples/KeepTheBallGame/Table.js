import React from "react";
import { StyleSheet, View } from "react-native";

export const TABLE_SIZE = 250;

export default function Table({ children }) {
  return <View style={[styles.table, styles.centeredContent]}>{children}</View>;
}

const styles = StyleSheet.create({
  table: {
    alignItems: "center",
    backgroundColor: "rgb(50,50,180)",
    flexDirection: "column",
    height: TABLE_SIZE,
    justifyContent: "center",
    width: TABLE_SIZE
  }
});

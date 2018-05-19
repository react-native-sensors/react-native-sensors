import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";

function Table({ children }) {
  return <View style={[styles.table, styles.centeredContent]}>{children}</View>;
}

function Ball({ x, y }) {
  return <View style={styles.ball} />;
}

export default function Game({ data }) {
  return (
    <Table>
      <Ball x={0} y={0} />
    </Table>
  );
}

const TABLE_SIZE = 250;
const BALL_SIZE = 50;

const styles = StyleSheet.create({
  centeredContent: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  table: {
    height: TABLE_SIZE,
    width: TABLE_SIZE,
    backgroundColor: "blue"
  },
  ball: {
    width: BALL_SIZE,
    height: BALL_SIZE,
    borderRadius: BALL_SIZE / 2,
    backgroundColor: "red"
  }
});

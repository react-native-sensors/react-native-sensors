import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { accelerometer, setUpdateIntervalForType, SensorTypes } from "react-native-sensors";

import Game from "./Game";

setUpdateIntervalForType(SensorTypes.accelerometer, 16);

export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Game data={accelerometer} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  headline: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  }
});

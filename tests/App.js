import React, { Component } from "react";
import { ScrollView } from "react-native";
import SensorView from "./SensorView";

const axis = ["x", "y", "z"];

const availableSensors = {
  accelerometer: axis,
  gyroscope: axis,
  magnetometer: axis,
  barometer: ["pressure"],
};
const viewComponents = Object.entries(availableSensors).map(([name, values]) => SensorView(name, values));

export default class App extends Component {
  render() {
    return (
      <ScrollView testID="scroller">
        {viewComponents.map((Comp, index) => (
          <Comp key={index} />
        ))}
      </ScrollView>
    );
  }
}

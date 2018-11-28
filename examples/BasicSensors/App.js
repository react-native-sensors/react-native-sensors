import React, { Component } from "react";
import { ScrollView } from "react-native";
import SensorView from "./SensorView";

const availableSensors = [
  "accelerometer",
  "gyroscope",
  "magnetometer",
  "barometer"
];
const viewComponents = availableSensors.map(SensorView);

export default class App extends Component {
  render() {
    return (
      <ScrollView>
        {viewComponents.map((Comp, index) => <Comp key={index} />)}
      </ScrollView>
    );
  }
}

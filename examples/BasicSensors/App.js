import React from "react";
import { ScrollView } from "react-native";
import SensorView from "./SensorView";

export const App = () => {
  const axis = ["x", "y", "z"];

  const availableSensors = {
    accelerometer: axis,
    gyroscope: axis,
    magnetometer: axis,
    barometer: ["pressure"],
  };

  return (
    <ScrollView>
      {Object.entries(availableSensors).map(([name, values]) => (
        <SensorView key={name} sensorName={name} values={values} />
      ))}
    </ScrollView>
  );
};

export default App;

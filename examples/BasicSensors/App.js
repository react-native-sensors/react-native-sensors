import React from "react";
import { SafeAreaView, ScrollView } from "react-native";
import SensorView from "./SensorView";

export const App = () => {
  const axis = ["x", "y", "z"];

  const availableSensors = {
    accelerometer: axis,
    gyroscope: axis,
    magnetometer: axis,
    barometer: ["pressure"],
    proximity: ["distance", "is_close"],
  };

  return (
    <SafeAreaView>
      <ScrollView>
        {Object.entries(availableSensors).map(([name, values]) => (
          <SensorView key={name} sensorName={name} values={values} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;

import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import sensors from "react-native-sensors";

const SensorValue = ({ name, value }) => (
  <View style={styles.valueContainer}>
    <Text style={styles.valueName}>{name}:</Text>
    <Text style={styles.valueValue}>{new String(value).substring(0, 8)}</Text>
  </View>
);

export const SensorView = ({ sensorName, values }) => {
  const sensor$ = sensors[sensorName];
  const initialValue = values.reduce((carry, val) => ({ ...carry, [val]: 0 }), {});
  const [sensorValues, setSensorValues] = useState(initialValue);
  const sensorSubscriptionRef = useRef();

  useEffect(() => {
    sensorSubscriptionRef.current = sensor$.subscribe((values) => {
      setSensorValues({ ...values });
    });

    return () => {
      sensorSubscriptionRef.current.unsubscribe();
      sensorSubscriptionRef.current = null;
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.headline}>{sensorName} values</Text>
      {values.map((valueName) => (
        <SensorValue key={sensorName + valueName} name={valueName} value={sensorValues[valueName]} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
    marginVertical: 25,
    paddingBottom: 12,
  },
  headline: {
    fontSize: 30,
    margin: 10,
    color: "#333",
  },
  valueContainer: {
    flex: 1,
    marginHorizontal: 24,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  valueValue: {
    fontSize: 20,
    color: "#333",
    flex: 3,
  },
  valueName: {
    flex: 2,
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5,
  },
});

export default SensorView;

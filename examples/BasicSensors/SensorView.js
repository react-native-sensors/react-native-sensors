import React, { useEffect, useState } from "react";
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
  const [subscription, setSubscription] = useState();

  useEffect(() => {
    const sensorSubsciption = sensor$.subscribe((values) => {
      setSensorValues({ ...values });
    });
    setSubscription(sensorSubsciption);

    return () => {
      subscription.unsubscribe();
      setSubscription(null);
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
    marginTop: 50,
  },
  headline: {
    fontSize: 30,
    textAlign: "left",
    margin: 10,
  },
  valueContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  valueValue: {
    width: 200,
    fontSize: 20,
  },
  valueName: {
    width: 50,
    fontSize: 20,
    fontWeight: "bold",
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5,
  },
});

export default SensorView;

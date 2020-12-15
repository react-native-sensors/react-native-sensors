import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Sensors from "react-native-sensors";

const Value = ({ name, testID, value }) => (
  <View style={styles.valueContainer}>
    <Text style={styles.valueName}>{name}:</Text>
    <Text testID={testID} style={styles.valueValue}>
      {Math.round(value)}
    </Text>
  </View>
);

export default function(sensorName, values) {
  const sensor$ = Sensors[sensorName];

  return class SensorView extends Component {
    constructor(props) {
      super(props);

      const initialValue = values.reduce((carry, val) => ({ ...carry, [val]: 0 }), {});
      this.state = initialValue;
    }

    componentWillMount() {
      const subscription = sensor$.subscribe(values => {
        this.setState({ ...values });
      });
      this.setState({ subscription });
    }

    componentWillUnmount() {
      this.state.subscription.unsubscribe();
      this.setState({ subscription: null });
    }

    render() {
      return (
        <View style={styles.container}>
          <Text style={styles.headline}>{sensorName} values</Text>
          {values.map(valueName => (
            <Value
              testID={`${sensorName}-${valueName}`}
              key={sensorName + valueName}
              name={valueName}
              value={this.state[valueName]}
            />
          ))}
        </View>
      );
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
    marginVertical: 25
  },
  headline: {
    fontSize: 30,
    textAlign: "left",
    margin: 10
  },
  valueContainer: {
    flexDirection: "row",
    flexWrap: "wrap"
  },
  valueValue: {
    width: 200,
    fontSize: 20
  },
  valueName: {
    width: 50,
    fontSize: 20,
    fontWeight: "bold"
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});

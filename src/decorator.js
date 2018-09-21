import React from "react";
import PropTypes from "prop-types";
import Sensors from "./sensors";

const AVAILABLE_SENSORS = ["Accelerometer", "Gyroscope", "Magnetometer"];

class SensorWrapper extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    sensors: PropTypes.shape({
      Accelerometer: PropTypes.bool,
      Gyroscope: PropTypes.bool,
      Magnetometer: PropTypes.bool
    })
  };

  constructor(props) {
    super(props);
    this.state = {
      _subscriptions: [],
      sensorsFound: {}
    };
  }

  componentWillMount() {
    const subscriptions = [];

    Object.entries(this.props.sensors).forEach(
      async ([name, sensorOptions]) => {
        const observable = new Sensors[name]();

        const subscription = observable.subscribe(
          sensorValue => {
            this.setState({
              [name]: sensorValue,
              sensorsFound: { ...this.state.sensorsFound, [name]: true }
            });
          },
          err => {
            console.warn("RNSensors:", err);
            this.setState({
              sensorsFound: { ...this.state.sensorsFound, [name]: false }
            });
          }
        );

        subscriptions.push(subscription);
      }
    );
    this.setState({
      _subscriptions: subscriptions
    });
  }

  componentWillUnmount() {
    this.state._subscriptions.forEach(subscription =>
      subscription.unsubscribe()
    );
  }

  render() {
    return React.cloneElement(this.props.children, this.state);
  }
}

export default function decorator(options = {}) {
  const sensors = Object.keys(options)
    .filter(key => AVAILABLE_SENSORS.includes(key))
    .filter(key => options[key])
    .reduce((carry, key) => {
      carry[key] = options[key];
      return carry;
    }, {});

  return Component => props => (
    <SensorWrapper sensors={sensors}>
      <Component {...props} />
    </SensorWrapper>
  );
}

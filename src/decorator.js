import React from "react";
import PropTypes from "prop-types";
import Sensors from "./sensors";

const AVAILABLE_SENSORS = ["Accelerometer", "Gyroscope", "Magnetometer"];
const optionsType = PropTypes.shape({
  updateInterval: PropTypes.number
});

class SensorWrapper extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    sensors: PropTypes.shape({
      Accelerometer: PropTypes.oneOfType([PropTypes.bool, optionsType]),
      Gyroscope: PropTypes.oneOfType([PropTypes.bool, optionsType]),
      Magnetometer: PropTypes.oneOfType([PropTypes.bool, optionsType])
    })
  };

  constructor(props) {
    super(props);
    this.state = {
      _observables: [],
      sensorsFound: {}
    };
  }

  componentWillMount() {
    const observables = [];

    Object.entries(this.props.sensors).forEach(
      async ([name, sensorOptions]) => {
        const options =
          typeof sensorOptions === "boolean" ? null : sensorOptions;

        let sensorFound = null;
        try {
          const observable = await new Sensors[name](options);
          observables.push(observable);

          observable.subscribe(sensorValue => {
            this.setState({
              [name]: sensorValue
            });
          });

          sensorFound = true;
        } catch (e) {
          sensorFound = false;
        }

        this.setState({
          _observables: observables,
          sensorsFound: { ...this.state.sensorsFound, [name]: sensorFound }
        });
      }
    );
  }

  componentWillUnmount() {
    this.state._observables.forEach(observable => observable.stop());
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

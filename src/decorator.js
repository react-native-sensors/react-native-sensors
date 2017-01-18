import React from 'react';
import Sensors from './sensors';

const AVAILABLE_SENSORS = ['Accelerometer', 'Gyroscope', 'Magnetometer'];
const optionsType = React.PropTypes.shape({
  updateInterval: React.PropTypes.number,
});

const sensorType = React.PropTypes.oneOf([
  React.Proptypes.bool,
  optionsType,
]);

class SensorWrapper extends React.Component {
  static propTypes = {
    children: React.PropTypes.node.isRequired,
    sensors: React.PropTypes.shape({
      Accelerometer: sensorType,
      Gyroscope: sensorType,
      Magnetometer: sensorType,
    }),
  }

  constructor(props) {
    super(props);
    this.state = {
      _observables: [],
    };
  }

  componentWillMount() {
    const observables = [];
    this.props.sensors.entries().forEach(([name, sensorOptions]) => {
      const observable = new Sensors[name](sensorOptions);
      observables.push(observable);

      onservable.subscribe(sensorValue => {
        this.setState({
          [name]: sensorValue,
        });
      });
    });

    this.setState({
      _observables: observables,
    });
  }

  componentWillUnmount() {
    this.state._observables.forEach(observable => observable.stop());
  }

  render() {
    return React.cloneElement(this.children, this.state);
  }
}

export default function sensors(options = {}) {
  const sensors = Object.keys(options)
                    .filter(key => AVAILABLE_SENSORS.includes(key))
                    .filter(key => options[key]);

  return Component => props => (
    <SensorWrapper sensors={sensors}>
      <Component {...props} />
    </SensorWrapper>
  )
}

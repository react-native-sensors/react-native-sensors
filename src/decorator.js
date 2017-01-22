import React from 'react';
import Sensors from './sensors';

const AVAILABLE_SENSORS = ['Accelerometer', 'Gyroscope'];
const optionsType = React.PropTypes.shape({
  updateInterval: React.PropTypes.number,
});

class SensorWrapper extends React.Component {
  static propTypes = {
    children: React.PropTypes.node.isRequired,
    sensors: React.PropTypes.shape({
      Accelerometer: React.PropTypes.oneOfType([
        React.PropTypes.bool,
        optionsType,
      ]),
      Gyroscope: React.PropTypes.oneOfType([
        React.PropTypes.bool,
        optionsType,
      ]),
      Magnetometer: React.PropTypes.oneOfType([
        React.PropTypes.bool,
        optionsType,
      ]),
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
    Object.entries(this.props.sensors).forEach(([name, sensorOptions]) => {
      const options = typeof(sensorOptions) === 'boolean' ? null : sensorOptions;
      const observable = new Sensors[name](options);
      observables.push(observable);

      observable.subscribe(sensorValue => {
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
    return React.cloneElement(this.props.children, this.state);
  }
}

export default function decorator(options = {}) {
  const sensors = Object.keys(options)
                    .filter(key => AVAILABLE_SENSORS.includes(key))
                    .filter(key => options[key])
                    .reduce((carry, key) => {
                      carry[key] = options[key];
                      return carry
                    }, {});

  return Component => props => (
    <SensorWrapper sensors={sensors}>
      <Component {...props} />
    </SensorWrapper>
  )
}

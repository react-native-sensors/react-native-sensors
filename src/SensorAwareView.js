import React from 'react';
import Sensors from './sensors';

const DEFAULT_OBJECTS = {
  accelerometer: {
    x: 0,
    y: 0,
    z: 0,
  },
  gyroscope: {
    x: 0,
    y: 0,
    z: 0,
  },
}

export default class SensorAwareView extends React.Component {
  static ACCELEROMETER_TYPE = 'accelerometer';
  static GYROSCOPE_TYPE = 'gyroscope';

  static propTypes = {
    children: React.PropTypes.node.isRequired,
    type: React.PropTypes.oneOf([SensorAwareView.ACCELEROMETER_TYPE, SensorAwareView.GYROSCOPE_TYPE]).isRequired,
    updateInterval: React.PropTypes.number,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  initSensor(props) {
    this.setState({
      ...DEFAULT_OBJECTS[props.type],
    });

    this.observable = new Sensors[props.type](props);
    this.observable.subscribe(sensorData => {
      this.setState({
        ...sensorData,
      });
    });
  }

  componentWillMount() {
    initSensor(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.type === nextProps.type) {
      return;
    }

    // Restart with new sensor
    this.observable.stop(); // clears the previous subscribe
    initSensor(nextProps);
  }

  render() {
    return React.Children.map(this.props.children, child => React.cloneElement(child, {
      [this.props.type]: this.state,
    }))
  }

  componentDidUnmount() {
    this.observable.stop();
  }
}

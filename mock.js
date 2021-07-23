/**
 * Library mock for test runners. e.g.:
 *
 * ```js
 * jest.mock('react-native-sensors', () => require('react-native-sensors/mock'));
 * ```
 */

const sensorMock = (observerValue) => ({
  subscribe: (observer) => {
    observer(observerValue || { x: 0, y: 0, z: 0, timestamp: 0 })
    return ({ unsubscribe: jest.fn() })
  },
})

const rnSensors = {
  SensorTypes: {
    accelerometer: 'accelerometer',
    gyroscope: 'gyroscope',
    magnetometer: 'magnetometer',
    barometer: 'barometer',
    gravity: 'gravity'
  },

  accelerometer: sensorMock(),
  gyroscope: sensorMock(),
  magnetometer: sensorMock(),
  barometer: sensorMock({ pressure: 0 }),
  gravity: sensorMock(),

  setLogLevelForType: jest.fn(),
  setUpdateIntervalForType: jest.fn(),
}

module.exports = rnSensors

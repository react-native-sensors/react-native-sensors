using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using ReactNative.Bridge;
using ReactNative.Modules.Core;
using System;
using Windows.Foundation;
using Sensors = Windows.Devices.Sensors;

namespace RNSensors
{
    public class Accelerometer : ReactContextNativeModuleBase, ILifecycleEventListener
    {
        private Sensors.Accelerometer _accelerometer;
        private int interval;

        public Accelerometer(ReactContext reactContext) : base(reactContext)
        {
            
        }

        public override string Name
        {
            get
            {
                return "Accelerometer";
            }
        }

        private void ReadingChanged(object sender, Sensors.AccelerometerReadingChangedEventArgs e)
        {
            Sensors.AccelerometerReading reading = e.Reading;

            this.SendEvent("Accelerometer", new RNSensorsJsonObject
            {
                X = reading.AccelerationX,
                Y = reading.AccelerationY,
                Z = reading.AccelerationZ,
                Timestamp = reading.Timestamp
            }.ToJObject());
        }

        [ReactMethod]
        public void setUpdateInterval(int newInterval)
        {
            this.interval = newInterval;
            if (_accelerometer != null) _accelerometer.ReportInterval = (uint)this.interval;
        }

        [ReactMethod]
        public void startUpdates()
        {
            if (_accelerometer == null)
            {
                _accelerometer = Sensors.Accelerometer.GetDefault();
                if (_accelerometer == null) throw new Exception("No Accelerometer found");

                this.setUpdateInterval(this.interval);
            }
            _accelerometer.ReadingChanged += new TypedEventHandler<Sensors.Accelerometer, Sensors.AccelerometerReadingChangedEventArgs>(ReadingChanged);
        }

        [ReactMethod]
        public void stopUpdates()
        {
            _accelerometer.ReadingChanged -= new TypedEventHandler<Sensors.Accelerometer, Sensors.AccelerometerReadingChangedEventArgs>(ReadingChanged);
        }

        private void SendEvent(string eventName, JObject parameters)
        {
            Context.GetJavaScriptModule<RCTDeviceEventEmitter>().emit(eventName, parameters);
        }


        public void OnDestroy()
        {
            throw new NotImplementedException();
        }

        public void OnResume()
        {
            throw new NotImplementedException();
        }

        public void OnSuspend()
        {
            throw new NotImplementedException();
        }
    }
}

using Newtonsoft.Json.Linq;
using ReactNative.Bridge;
using ReactNative.Modules.Core;
using System;
using Windows.Foundation;
using Sensors = Windows.Devices.Sensors;

namespace RNSensors
{
    public class Gyroscope : ReactContextNativeModuleBase, ILifecycleEventListener
    {
        private Sensors.Gyrometer _gyrometer;
        private int interval = 100;

        public Gyroscope(ReactContext reactContext) : base(reactContext)
        {
            
        }

        public override string Name
        {
            get
            {
                return "Gyroscope";
            }
        }

        private void ReadingChanged(object sender, Sensors.GyrometerReadingChangedEventArgs e)
        {
            Sensors.GyrometerReading reading = e.Reading;

            this.SendEvent("Gyroscope", new RNSensorsJsonObject
            {
                X = reading.AngularVelocityX,
                Y = reading.AngularVelocityY,
                Z = reading.AngularVelocityZ,
                Timestamp = reading.Timestamp
            }.ToJObject());
        }

        [ReactMethod]
        public void setUpdateInterval(int newInterval)
        {
            this.interval = newInterval;
            if (_gyrometer != null) _gyrometer.ReportInterval = (uint)this.interval;
        }

        [ReactMethod]
        public void startUpdates()
        {
            if(_gyrometer == null)
            {
                _gyrometer = Sensors.Gyrometer.GetDefault();
                if (_gyrometer == null) throw new Exception("No Gyroscope found");

                this.setUpdateInterval(this.interval);
            }
            _gyrometer.ReadingChanged += new TypedEventHandler<Sensors.Gyrometer, Sensors.GyrometerReadingChangedEventArgs>(ReadingChanged);
        }

        [ReactMethod]
        public void stopUpdates()
        {
            _gyrometer.ReadingChanged -= new TypedEventHandler<Sensors.Gyrometer, Sensors.GyrometerReadingChangedEventArgs>(ReadingChanged);
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

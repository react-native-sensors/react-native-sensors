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
            //_accelerometer = Sensors.Accelerometer.GetDefault();

            //if (_accelerometer == null)
            //{
            //    throw new Exception("No Accelerometer found");
            //}
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

            this.SendEvent("Accelerometer", new AccelerometerJsonObject
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
        }

        [ReactMethod]
        public void startUpdates()
        {
            if (_accelerometer == null)
            {
                _accelerometer = Sensors.Accelerometer.GetDefault();
                if (_accelerometer == null) throw new Exception("No Accelerometer found");
            }
            _accelerometer.ReadingChanged += new TypedEventHandler<Sensors.Accelerometer, Sensors.AccelerometerReadingChangedEventArgs>(ReadingChanged);
        }

        [ReactMethod]
        public void stopUpdates()
        {
            //throw new NotImplementedException();
        }

        //[ReactMethod]
        //public string getName()
        //{
        //    return this.Name;
        //}

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

        public class AccelerometerJsonObject
        {
            [JsonProperty("X")]
            public double X;

            [JsonProperty("Y")]
            public double Y;

            [JsonProperty("Z")]
            public double Z;

            [JsonProperty("timestamp")]
            public DateTimeOffset Timestamp;

            public JObject ToJObject()
            {
                return JObject.Parse(JsonConvert.SerializeObject(this));
            }
        }
    }
}

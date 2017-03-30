using ReactNative.Bridge;
using ReactNative.Modules.Core;
using System.Collections.Generic;
using ReactNative.UIManager;
using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace RNSensors
{
    public class RNSensorsPackage : IReactPackage
    {
        public IReadOnlyList<INativeModule> CreateNativeModules(ReactContext reactContext)
        {
            return new List<INativeModule>
            {
                new Accelerometer(reactContext),
                new Gyroscope(reactContext)
            };
        }

        IReadOnlyList<Type> IReactPackage.CreateJavaScriptModulesConfig()
        {
            return new List<Type>(0);
        }

        IReadOnlyList<IViewManager> IReactPackage.CreateViewManagers(ReactContext reactContext)
        {
            return new List<IViewManager>(0);
        }
    }

    public class RNSensorsJsonObject
    {
        [JsonProperty("x")]
        public double X;

        [JsonProperty("y")]
        public double Y;

        [JsonProperty("z")]
        public double Z;

        [JsonProperty("timestamp")]
        public DateTimeOffset Timestamp;

        public JObject ToJObject()
        {
            return JObject.Parse(JsonConvert.SerializeObject(this));
        }
    }
}

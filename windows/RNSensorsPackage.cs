using ReactNative.Bridge;
using ReactNative.Modules.Core;
using System.Collections.Generic;
using ReactNative.UIManager;
using System;

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
}

package com.sensors;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import android.hardware.Sensor;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.facebook.react.bridge.JavaScriptModule;

public class RNSensorsPackage implements ReactPackage {
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
      return Arrays.<NativeModule>asList(
        new RNSensor(reactContext, "Gyroscope", Sensor.TYPE_GYROSCOPE),
        new RNSensor(reactContext, "Accelerometer", Sensor.TYPE_ACCELEROMETER),
        new RNSensor(reactContext, "Magnetometer", Sensor.TYPE_MAGNETIC_FIELD),
        new RNSensor(reactContext, "Barometer", Sensor.TYPE_PRESSURE)
      );
    }

    public List<Class<? extends JavaScriptModule>> createJSModules() {
      return Collections.emptyList();
    }

    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
      return Collections.emptyList();
    }
}

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
        new RNSensor(reactContext, "RNSensorsGyroscope", Sensor.TYPE_GYROSCOPE),
        new RNSensor(reactContext, "RNSensorsAccelerometer", Sensor.TYPE_ACCELEROMETER),
        new RNSensor(reactContext, "RNSensorsGravity", Sensor.TYPE_GRAVITY),
        new RNSensor(reactContext, "RNSensorsMagnetometer", Sensor.TYPE_MAGNETIC_FIELD),
        new RNSensor(reactContext, "RNSensorsBarometer", Sensor.TYPE_PRESSURE),
        new RNSensor(reactContext, "RNSensorsOrientation", Sensor.TYPE_ROTATION_VECTOR)
      );
    }

    public List<Class<? extends JavaScriptModule>> createJSModules() {
      return Collections.emptyList();
    }

    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
      return Collections.emptyList();
    }
}

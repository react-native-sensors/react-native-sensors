package com.sensors;
import java.lang.*;
import android.os.SystemClock;

public final class Utils {

    public static double sensorTimestampToEpochMilliseconds(long elapsedTime) {
        // elapsedTime = The time in nanoseconds at which the event happened.
        return System.currentTimeMillis() + ((elapsedTime-SystemClock.elapsedRealtimeNanos())/1000000L);
    }

}

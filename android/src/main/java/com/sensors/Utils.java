package com.sensors;

public final class Utils {

    public static double sensorTimeToTimestampSince1970(long elapsedTime) {
        // elapsedTime = The time in nanoseconds at which the event happened.
        return System.currentTimeMillis() + ((elapsedTime-SystemClock.elapsedRealtimeNanos())/1000000L)
    }

}

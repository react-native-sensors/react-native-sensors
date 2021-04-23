#import "RNSensorsUtils.h"

@implementation RNSensorsUtils

+ (double)sensorTimestampToEpochMilliseconds:(NSTimeInterval) timestamp {
    return floor(([[NSDate date] timeIntervalSince1970] + (timestamp - [[NSProcessInfo processInfo] systemUptime])) * 1000);
}

@end

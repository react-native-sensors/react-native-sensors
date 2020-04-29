#import "Utils.h"

@implementation Utils

- (double)sensorTimeToTimestampSince1970:(double) timestamp {
    NSTimeInterval uptime = [[NSProcessInfo processInfo] systemUptime];
    return ((NSTimeIntervalSince1970 + uptime) + (timestamp - uptime)) * 1000;
}

@end

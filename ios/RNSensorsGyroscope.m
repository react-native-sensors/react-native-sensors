// Inspired by https://github.com/pwmckenna/react-native-motion-manager

#import "RNSensorsGyroscope.h"
#import <React/RCTBridge.h>
#import <React/RCTEventDispatcher.h>
#import "RNSensorsUtils.h"

@implementation RNSensorsGyroscope

@synthesize bridge = _bridge;
RCT_EXPORT_MODULE();

- (id) init {
    self = [super init];
    NSLog(@"RNSensorsGyroscope");

    if (self) {
        self->_motionManager = [[CMMotionManager alloc] init];
        self->logLevel = 0;
    }
    return self;
}

- (NSArray<NSString *> *)supportedEvents
{
  return @[@"RNSensorsGyroscope"];
}

+ (BOOL)requiresMainQueueSetup
{
    return NO;
}

RCT_REMAP_METHOD(isAvailable,
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {
    return [self isAvailableWithResolver:resolve
                                rejecter:reject];
}

- (void) isAvailableWithResolver:(RCTPromiseResolveBlock) resolve
                        rejecter:(RCTPromiseRejectBlock) reject {
    if([self->_motionManager isGyroAvailable])
    {
        /* Start the accelerometer if it is not active already */
        if([self->_motionManager isGyroActive] == NO)
        {
            resolve(@YES);
        } else {
            reject(@"-1", @"Gyroscope is not active", nil);
        }
    }
    else
    {
        reject(@"-1", @"Gyroscope is not available", nil);
    }
}

RCT_EXPORT_METHOD(setUpdateInterval:(double) interval) {
    if (self->logLevel > 0) {
        NSLog(@"setUpdateInterval: %f", interval);
    }

    double intervalInSeconds = interval / 1000;

    [self->_motionManager setGyroUpdateInterval:intervalInSeconds];
}

RCT_EXPORT_METHOD(setLogLevel:(int) level) {
    if (level > 0) {
        NSLog(@"setLogLevel: %f", level);
    }

    self->logLevel = level;
}

RCT_EXPORT_METHOD(getUpdateInterval:(RCTResponseSenderBlock) cb) {
    double interval = self->_motionManager.gyroUpdateInterval;

    if (self->logLevel > 0) {
        NSLog(@"getUpdateInterval: %f", interval);
    }

    cb(@[[NSNull null], [NSNumber numberWithDouble:interval]]);
}

RCT_EXPORT_METHOD(getData:(RCTResponseSenderBlock) cb) {
    double x = self->_motionManager.gyroData.rotationRate.x;
    double y = self->_motionManager.gyroData.rotationRate.y;
    double z = self->_motionManager.gyroData.rotationRate.z;
    double timestamp = [RNSensorsUtils sensorTimestampToEpochMilliseconds:self->_motionManager.gyroData.timestamp];

    if (self->logLevel > 0) {
        NSLog(@"getData: %f, %f, %f, %f", x, y, z, timestamp);
    }

    cb(@[[NSNull null], @{
                 @"x" : [NSNumber numberWithDouble:x],
                 @"y" : [NSNumber numberWithDouble:y],
                 @"z" : [NSNumber numberWithDouble:z],
                 @"timestamp" : [NSNumber numberWithDouble:timestamp]
             }]
       );
}

RCT_EXPORT_METHOD(startUpdates) {
    if (self->logLevel > 0) {
        NSLog(@"startUpdates/startGyroUpdates");
    }

    [self->_motionManager startGyroUpdates];

    /* Receive the gyroscope data on this block */
    [self->_motionManager startGyroUpdatesToQueue:[NSOperationQueue mainQueue]
                                      withHandler:^(CMGyroData *gyroData, NSError *error)
     {
         double x = gyroData.rotationRate.x;
         double y = gyroData.rotationRate.y;
         double z = gyroData.rotationRate.z;
         double timestamp = [RNSensorsUtils sensorTimestampToEpochMilliseconds:gyroData.timestamp];

         if (self->logLevel > 1) {
             NSLog(@"Updated gyro values: %f, %f, %f, %f", x, y, z, timestamp);
         }

         [self sendEventWithName:@"RNSensorsGyroscope" body:@{
                                                         @"x" : [NSNumber numberWithDouble:x],
                                                         @"y" : [NSNumber numberWithDouble:y],
                                                         @"z" : [NSNumber numberWithDouble:z],
                                                         @"timestamp" : [NSNumber numberWithDouble:timestamp]
                                                     }];
     }];

}

RCT_EXPORT_METHOD(stopUpdates) {
    if (self->logLevel > 0) {
        NSLog(@"stopUpdates");
    }

    [self->_motionManager stopGyroUpdates];
}

@end

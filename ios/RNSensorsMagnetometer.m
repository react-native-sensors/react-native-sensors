
//  RNSensorsMagnetometer.m


#import <React/RCTBridge.h>
#import <React/RCTEventDispatcher.h>
#import "RNSensorsMagnetometer.h"
#import "RNSensorsUtils.h"

@implementation RNSensorsMagnetometer

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

- (id) init {
    self = [super init];
    NSLog(@"RNSensorsMagnetometer");

    if (self) {
        self->_motionManager = [[CMMotionManager alloc] init];
        self->logLevel = 0;
    }
    return self;
}

- (NSArray<NSString *> *)supportedEvents
{
  return @[@"RNSensorsMagnetometer"];
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
    if([self->_motionManager isMagnetometerAvailable])
    {
        /* Start the accelerometer if it is not active already */
        if([self->_motionManager isMagnetometerActive] == NO)
        {
            resolve(@YES);
        } else {
            reject(@"-1", @"Magnetometer is not active", nil);
        }
    }
    else
    {
        reject(@"-1", @"Magnetometer is not available", nil);
    }
}

RCT_EXPORT_METHOD(setUpdateInterval:(double) interval) {
    if (self->logLevel > 0) {
        NSLog(@"setUpdateInterval: %f", interval);
    }

    double intervalInSeconds = interval / 1000;

    [self->_motionManager setMagnetometerUpdateInterval:intervalInSeconds];
}

RCT_EXPORT_METHOD(setLogLevel:(int) level) {
    if (level > 0) {
        NSLog(@"setLogLevel: %f", level);
    }

    self->logLevel = level;
}

RCT_EXPORT_METHOD(getUpdateInterval:(RCTResponseSenderBlock) cb) {
    double interval = self->_motionManager.magnetometerUpdateInterval;

    if (self->logLevel > 0) {
        NSLog(@"getUpdateInterval: %f", interval);
    }

    cb(@[[NSNull null], [NSNumber numberWithDouble:interval]]);
}

RCT_EXPORT_METHOD(getData:(RCTResponseSenderBlock) cb) {
    double x = self->_motionManager.magnetometerData.magneticField.x;
    double y = self->_motionManager.magnetometerData.magneticField.y;
    double z = self->_motionManager.magnetometerData.magneticField.z;
    double timestamp = [RNSensorsUtils sensorTimestampToEpochMilliseconds:self->_motionManager.magnetometerData.timestamp];

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
        NSLog(@"startUpdates/startMagnetometerUpdates");
    }

    [self->_motionManager startMagnetometerUpdates];

    /* Receive the magnetometer data on this block */
    [self->_motionManager startMagnetometerUpdatesToQueue:[NSOperationQueue mainQueue]
                                               withHandler:^(CMMagnetometerData *magnetometerData, NSError *error)
     {
         double x = magnetometerData.magneticField.x;
         double y = magnetometerData.magneticField.y;
         double z = magnetometerData.magneticField.z;
         double timestamp = [RNSensorsUtils sensorTimestampToEpochMilliseconds:magnetometerData.timestamp];

         if (self->logLevel > 1) {
             NSLog(@"Updated magnetometer values: %f, %f, %f, %f", x, y, z, timestamp);
         }

         [self sendEventWithName:@"RNSensorsMagnetometer" body:@{
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

    [self->_motionManager stopMagnetometerUpdates];
}

@end

//  Accelerometer.m


#import <React/RCTBridge.h>
#import <React/RCTEventDispatcher.h>
#import "RNSensorsAccelerometer.h"
#import "RNSensorsUtils.h"

@implementation RNSensorsAccelerometer

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

- (id) init {
    self = [super init];
    NSLog(@"RNSensorsAccelerometer");

    if (self) {
        self->_motionManager = [[CMMotionManager alloc] init];
        self->logLevel = 0;
    }
    return self;
}

+ (BOOL)requiresMainQueueSetup
{
    return NO;
}

- (NSArray<NSString *> *)supportedEvents
{
  return @[@"RNSensorsAccelerometer"];
}

RCT_REMAP_METHOD(isAvailable,
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {
    return [self isAvailableWithResolver:resolve
                                rejecter:reject];
}

- (void) isAvailableWithResolver:(RCTPromiseResolveBlock) resolve
                        rejecter:(RCTPromiseRejectBlock) reject {
    if([self->_motionManager isAccelerometerAvailable])
    {
        /* Start the accelerometer if it is not active already */
        if([self->_motionManager isAccelerometerActive] == NO)
        {
            resolve(@YES);
        } else {
            reject(@"-1", @"Accelerometer is not active", nil);
        }
    }
    else
    {
        reject(@"-1", @"Accelerometer is not available", nil);
    }
}

RCT_EXPORT_METHOD(setUpdateInterval:(double) interval) {
    if (self->logLevel > 0) {
        NSLog(@"setUpdateInterval: %f", interval);
    }

    double intervalInSeconds = interval / 1000;

    [self->_motionManager setAccelerometerUpdateInterval:intervalInSeconds];
}

RCT_EXPORT_METHOD(setLogLevel:(int) level) {
    if (level > 0) {
        NSLog(@"setLogLevel: %f", level);
    }

    self->logLevel = level;
}

RCT_EXPORT_METHOD(getUpdateInterval:(RCTResponseSenderBlock) cb) {
    double interval = self->_motionManager.accelerometerUpdateInterval;

    if (self->logLevel > 0) {
        NSLog(@"getUpdateInterval: %f", interval);
    }

    cb(@[[NSNull null], [NSNumber numberWithDouble:interval]]);
}

RCT_EXPORT_METHOD(getData:(RCTResponseSenderBlock) cb) {
    double x = self->_motionManager.accelerometerData.acceleration.x;
    double y = self->_motionManager.accelerometerData.acceleration.y;
    double z = self->_motionManager.accelerometerData.acceleration.z;
    double timestamp = [RNSensorsUtils sensorTimestampToEpochMilliseconds:self->_motionManager.accelerometerData.timestamp];

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
        NSLog(@"startUpdates/startAccelerometerUpdates");
    }

    [self->_motionManager startAccelerometerUpdates];

    /* Receive the accelerometer data on this block */
    [self->_motionManager startAccelerometerUpdatesToQueue:[NSOperationQueue mainQueue]
                                               withHandler:^(CMAccelerometerData *accelerometerData, NSError *error)
     {
         double x = accelerometerData.acceleration.x;
         double y = accelerometerData.acceleration.y;
         double z = accelerometerData.acceleration.z;
         double timestamp = [RNSensorsUtils sensorTimestampToEpochMilliseconds:accelerometerData.timestamp];

         if (self->logLevel > 1) {
             NSLog(@"Updated accelerometer values: %f, %f, %f, %f", x, y, z, timestamp);
         }

         [self sendEventWithName:@"RNSensorsAccelerometer" body:@{
                                                           @"x" : [NSNumber numberWithDouble:x],
                                                           @"y" : [NSNumber numberWithDouble:y],
                                                           @"z" : [NSNumber numberWithDouble:z],
                                                           @"timestamp" : [NSNumber numberWithDouble:timestamp]
                                                       }];
     }];

}

RCT_EXPORT_METHOD(stopUpdates) {
    if(self->logLevel > 0) {
        NSLog(@"stopUpdates");
    }

    [self->_motionManager stopAccelerometerUpdates];
}

@end

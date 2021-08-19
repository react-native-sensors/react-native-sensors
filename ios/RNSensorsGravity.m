
//  Orientation.m


#import <React/RCTBridge.h>
#import <React/RCTEventDispatcher.h>
#import "RNSensorsGravity.h"
#import "RNSensorsUtils.h"

@implementation RNSensorsGravity

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

- (id) init {
    self = [super init];
    NSLog(@"RNSensorsGravity");

    if (self) {
        self->_motionManager = [[CMMotionManager alloc] init];
        self->logLevel = 0;
    }
    return self;
}

- (NSArray<NSString *> *)supportedEvents
{
  return @[@"RNSensorsGravity"];
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
    if([self->_motionManager isDeviceMotionAvailable])
    {
        /* Start the accelerometer if it is not active already */
        if([self->_motionManager isDeviceMotionActive] == NO)
        {
            resolve(@YES);
        } else {
            reject(@"-1", @"Gravity is not active", nil);
        }
    }
    else
    {
        reject(@"-1", @"Gravity is not available", nil);
    }
}

RCT_EXPORT_METHOD(setUpdateInterval:(double) interval) {
    if (self->logLevel > 0) {
        NSLog(@"setUpdateInterval: %f", interval);
    }

    double intervalInSeconds = interval / 1000;

    [self->_motionManager setDeviceMotionUpdateInterval:intervalInSeconds];
}

RCT_EXPORT_METHOD(setLogLevel:(int) level) {
    if (level > 0) {
        NSLog(@"setLogLevel: %f", level);
    }

    self->logLevel = level;
}

RCT_EXPORT_METHOD(getUpdateInterval:(RCTResponseSenderBlock) cb) {
    double interval = self->_motionManager.deviceMotionUpdateInterval;

    if (self->logLevel > 0) {
        NSLog(@"getUpdateInterval: %f", interval);
    }

    cb(@[[NSNull null], [NSNumber numberWithDouble:interval]]);
}

RCT_EXPORT_METHOD(getData:(RCTResponseSenderBlock) cb) {    
    double x = self->_motionManager.deviceMotion.gravity.x;
    double y = self->_motionManager.deviceMotion.gravity.y;
    double z = self->_motionManager.deviceMotion.gravity.z;
    double timestamp = [RNSensorsUtils sensorTimestampToEpochMilliseconds:self->_motionManager.deviceMotion.timestamp];

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
        NSLog(@"startUpdates/startGravityUpdates");
    }

    [self->_motionManager setShowsDeviceMovementDisplay:YES];

    /* Receive the orientation data on this block */
    [self->_motionManager startDeviceMotionUpdatesToQueue:[NSOperationQueue mainQueue]
                                               withHandler:^(CMDeviceMotion *deviceMotion, NSError *error)
     {

        double x = deviceMotion.gravity.x;
        double y = deviceMotion.gravity.y;
        double z = deviceMotion.gravity.z;

         double timestamp = [RNSensorsUtils sensorTimestampToEpochMilliseconds:deviceMotion.timestamp];

         if (self->logLevel > 1) {
             NSLog(@"Updated gravity values: %f, %f, %f, %f", x, y, z, timestamp);
         }

         [self sendEventWithName:@"RNSensorsGravity" body:@{
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

    [self->_motionManager stopDeviceMotionUpdates];
}

@end

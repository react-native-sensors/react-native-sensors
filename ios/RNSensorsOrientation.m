
//  RNSensorsOrientation.m


#import <React/RCTBridge.h>
#import <React/RCTEventDispatcher.h>
#import "RNSensorsOrientation.h"
#import "RNSensorsUtils.h"

@implementation RNSensorsOrientation

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

- (id) init {
    self = [super init];
    NSLog(@"RNSensorsOrientation");

    if (self) {
        self->_motionManager = [[CMMotionManager alloc] init];
        self->logLevel = 0;
    }
    return self;
}

- (NSArray<NSString *> *)supportedEvents
{
  return @[@"RNSensorsOrientation"];
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
            reject(@"-1", @"Orientation is not active", nil);
        }
    }
    else
    {
        reject(@"-1", @"Orientation is not available", nil);
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
    CMAttitude *attitude = self->_motionManager.deviceMotion.attitude;
    
    double qx = attitude.quaternion.x;
    double qy = attitude.quaternion.y;
    double qz = attitude.quaternion.z;
    double qw = attitude.quaternion.w;

    double pitch = attitude.pitch;
    double roll = attitude.roll;
    double yaw = attitude.yaw;

    double timestamp = [RNSensorsUtils sensorTimestampToEpochMilliseconds:self->_motionManager.deviceMotion.timestamp];

    if (self->logLevel > 0) {
        NSLog(@"getData pitch/roll/yaw: %f, %f, %f, %f", pitch, roll, yaw, timestamp);
        NSLog(@"getData quaternion: %f, %f, %f, %f %f", qx, qy, qz, qw, timestamp);
    }

    cb(@[[NSNull null], @{
                 @"pitch" : [NSNumber numberWithDouble:pitch],
                 @"roll" : [NSNumber numberWithDouble:roll],
                 @"yaw" : [NSNumber numberWithDouble:yaw],
                 @"qx" : [NSNumber numberWithDouble:qx],
                 @"qy" : [NSNumber numberWithDouble:qy],
                 @"qz" : [NSNumber numberWithDouble:qz],
                 @"qw" : [NSNumber numberWithDouble:qw],
                 @"timestamp" : [NSNumber numberWithDouble:timestamp]
             }]
       );
}

RCT_EXPORT_METHOD(startUpdates) {
    if (self->logLevel > 0) {
        NSLog(@"startUpdates/startOrientationUpdates");
    }

    [self->_motionManager setShowsDeviceMovementDisplay:YES];

    /* Receive the orientation data on this block */
		NSOperationQueue *queue = [[NSOperationQueue alloc] init];
    [self->_motionManager startDeviceMotionUpdatesToQueue:queue withHandler:^(CMDeviceMotion *deviceMotion, NSError *error)
     {
         CMAttitude *attitude = deviceMotion.attitude;
         
         double qx = attitude.quaternion.x;
         double qy = attitude.quaternion.y;
         double qz = attitude.quaternion.z;
         double qw = attitude.quaternion.w;

         double pitch = attitude.pitch;
         double roll = attitude.roll;
         double yaw = attitude.yaw;

         double timestamp = [RNSensorsUtils sensorTimestampToEpochMilliseconds:deviceMotion.timestamp];

         if (self->logLevel > 1) {
             NSLog(@"Updated device motion pitch/roll/yaw: %f, %f, %f, %f", pitch, roll, yaw, timestamp);
             NSLog(@"Updated device motion quaternion: %f, %f, %f, %f %f", qx, qy, qz, qw, timestamp);
         }

         [self sendEventWithName:@"RNSensorsOrientation" body:@{
                                                           @"pitch" : [NSNumber numberWithDouble:pitch],
                                                           @"roll" : [NSNumber numberWithDouble:roll],
                                                           @"yaw" : [NSNumber numberWithDouble:yaw],
                                                           @"qx" : [NSNumber numberWithDouble:qx],
                                                           @"qy" : [NSNumber numberWithDouble:qy],
                                                           @"qz" : [NSNumber numberWithDouble:qz],
                                                           @"qw" : [NSNumber numberWithDouble:qw],
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

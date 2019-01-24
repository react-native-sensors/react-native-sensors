
//  Magnetometer.m


#import <React/RCTBridge.h>
#import <React/RCTEventDispatcher.h>
#import "Devicemotion.h"

@implementation DeviceMotion

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

- (id) init {
    self = [super init];
    NSLog(@"initializing DeviceMotion");
    
    if (self) {
        self->_motionManager = [[CMMotionManager alloc] init];
    }
    return self;
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
            reject(@"-1", @"DeviceMotion is not active", nil);
        }
    }
    else
    {
        reject(@"-1", @"DeviceMotion is not available", nil);
    }
}

RCT_EXPORT_METHOD(setUpdateInterval:(double) interval) {
    NSLog(@"setUpdateInterval: %f", interval);
    double intervalInSeconds = interval / 1000;
    
    self->_motionManager.deviceMotionUpdateInterval = intervalInSeconds;
}

RCT_EXPORT_METHOD(getUpdateInterval:(RCTResponseSenderBlock) cb) {
    double interval = self->_motionManager.deviceMotionUpdateInterval;
    NSLog(@"getUpdateInterval: %f", interval);
    cb(@[[NSNull null], [NSNumber numberWithDouble:interval]]);
}

RCT_EXPORT_METHOD(getData:(RCTResponseSenderBlock) cb) {
    double x = self->_motionManager.deviceMotion.magneticField.field.x;
    double y = self->_motionManager.deviceMotion.magneticField.field.y;
    double z = self->_motionManager.deviceMotion.magneticField.field.z;

    
    NSLog(@"getData: %f, %f, %f", x, y, z);
    
    cb(@[[NSNull null], @{
             @"x" : [NSNumber numberWithDouble:x],
             @"y" : [NSNumber numberWithDouble:y],
             @"z" : [NSNumber numberWithDouble:z]
             }]
       );
}

RCT_EXPORT_METHOD(startUpdates) {
    NSLog(@"startUpdates");
    [self->_motionManager startDeviceMotionUpdates];
    self->_motionManager.showsDeviceMovementDisplay = true;
    /* Receive the magnetometer data on this block */
    [self->_motionManager startDeviceMotionUpdatesUsingReferenceFrame:CMAttitudeReferenceFrameXTrueNorthZVertical toQueue:[NSOperationQueue mainQueue]
                                              withHandler:^(CMDeviceMotion *deviceMotion, NSError *error)
     {
         
         double x = deviceMotion.magneticField.field.x;
         double y = deviceMotion.magneticField.field.y;
         double z = deviceMotion.magneticField.field.z;
         NSLog(@"startCalibratedMagnetometerUpdates: %f, %f, %f", x, y, z);
         
         [self.bridge.eventDispatcher sendDeviceEventWithName:@"Devicemotion" body:@{
                                                                                     @"x" : [NSNumber numberWithDouble:x],
                                                                                     @"y" : [NSNumber numberWithDouble:y],
                                                                                     @"z" : [NSNumber numberWithDouble:z]
                                                                                     }];
         
     }];
    
}

RCT_EXPORT_METHOD(stopUpdates) {
    NSLog(@"stop device motion Updates");
    [self->_motionManager stopDeviceMotionUpdates];
}

@end

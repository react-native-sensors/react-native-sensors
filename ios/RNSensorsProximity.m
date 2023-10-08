// RNSensorsProximity.m

#import "RNSensorsProximity.h"
#import <React/RCTBridge.h>
#import <React/RCTEventDispatcher.h>
#import "RNSensorsUtils.h"


@implementation RNSensorsProximity

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

- (instancetype)init {
    self = [super init];
    NSLog(@"RNSensorsProximity");

    if (self) {
        self->logLevel = 0;
    }
    return self;
}

- (NSArray<NSString *> *)supportedEvents
{
  return @[@"RNSensorsProximity"];
}

+ (BOOL)requiresMainQueueSetup
{
    return YES;
}


RCT_REMAP_METHOD(isAvailable,
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {
    return [self isAvailableWithResolver:resolve
                                rejecter:reject];
}

- (void) isAvailableWithResolver:(RCTPromiseResolveBlock) resolve
                        rejecter:(RCTPromiseRejectBlock) reject {
    dispatch_async(dispatch_get_main_queue(), ^{
        UIDevice *currentDevice = [UIDevice currentDevice];
        currentDevice.proximityMonitoringEnabled = YES;
        BOOL isAvailable = currentDevice.proximityMonitoringEnabled;
        resolve(@(isAvailable));
    });
}

RCT_EXPORT_METHOD(setUpdateInterval:(double) interval) {
    NSLog(@"Can not set update interval for proximity, doing nothing");
}

RCT_EXPORT_METHOD(setLogLevel:(int)level) {
    if (level > 0) {
        NSLog(@"setLogLevel: %f", level);
    }

    self->logLevel = level;
}

RCT_EXPORT_METHOD(getUpdateInterval:(RCTResponseSenderBlock) cb) {
    NSLog(@"getUpdateInterval is not meaningul for a proximity sensor");
    cb(@[[NSNull null], [NSNumber numberWithDouble:0.0]]);
}

RCT_EXPORT_METHOD(getData:(RCTResponseSenderBlock) cb) {
    BOOL proximityState = [UIDevice currentDevice].proximityState;
    if (self->logLevel > 0) {
        NSLog(@"getData: %d", proximityState);
    }
    cb(@[[NSNull null], @{
                 @"is_close" : @(proximityState),
                 @"distance": @(proximityState ? 0 : 10),
    }]);
}

RCT_EXPORT_METHOD(startUpdates) {
    if (self->logLevel > 0) {
        NSLog(@"startUpdates/startProximityUpdates");
    }
    dispatch_async(dispatch_get_main_queue(), ^{
        UIDevice *currentDevice = [UIDevice currentDevice];
        currentDevice.proximityMonitoringEnabled = YES;
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(proximityStateDidChange:) name:UIDeviceProximityStateDidChangeNotification object:nil];
    });
}

- (void)proximityStateDidChange:(NSNotification *)notification {
    BOOL proximityState = [UIDevice currentDevice].proximityState;

    cb(@[[NSNull null], @{
                 @"is_close" : @(proximityState),
                 @"distance": @(proximityState ? 0 : 10),
    }]);
    [self sendEventWithName:@"RNSensorsProximity"
                      body:@{
                             @"is_close": @(proximityState),
                             @"distance": @(proximityState ? 0 : 10),
                             }];
}

RCT_EXPORT_METHOD(stopUpdates) {
    if(self->logLevel > 0) {
        NSLog(@"stopUpdates");
    }
    dispatch_async(dispatch_get_main_queue(), ^{
        UIDevice *currentDevice = [UIDevice currentDevice];
        currentDevice.proximityMonitoringEnabled = NO;
        [[NSNotificationCenter defaultCenter] removeObserver:self name:UIDeviceProximityStateDidChangeNotification object:nil];
    });
}

// Will be called when this module's first listener is added.
-(void)startObserving {
    hasListeners = YES;
    // Set up any upstream listeners or background tasks as necessary
    [self startUpdates];
}

// Will be called when this module's last listener is removed, or on dealloc.
-(void)stopObserving {
    // Remove upstream listeners, stop unnecessary background tasks
    hasListeners = NO;
    // If we no longer have listeners registered we should also probably also stop the sensor since the sensor events are essentially being dropped.
    [self stopUpdates];
}

@end

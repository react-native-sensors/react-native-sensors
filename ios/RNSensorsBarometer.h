// Inspired by https://github.com/pwmckenna/react-native-motion-manager

#import <React/RCTBridgeModule.h>
#import <CoreMotion/CoreMotion.h>
#import <React/RCTEventEmitter.h>

@interface RNSensorsBarometer : RCTEventEmitter <RCTBridgeModule> {
    CMAltimeter *_altimeter;
    int logLevel;
    bool hasListeners;
}

- (void) isAvailableWithResolver:(RCTPromiseResolveBlock) resolve
         rejecter:(RCTPromiseRejectBlock) reject;
- (void) setUpdateInterval:(double) interval;
- (void) getUpdateInterval:(RCTResponseSenderBlock) cb;
- (void) setLogLevel:(int) level;
- (void) getData:(RCTResponseSenderBlock) cb;
- (void) startUpdates;
- (void) stopUpdates;

@end

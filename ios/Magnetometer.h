// Inspired by https://github.com/pwmckenna/react-native-motion-manager

#import <React/RCTBridgeModule.h>
#import <CoreMotion/CoreMotion.h>

@interface Magnetometer : NSObject <RCTBridgeModule> {
    CMMotionManager *_motionManager;
}

- (void) isAvailableWithResolver:(RCTPromiseResolveBlock) resolve
         rejecter:(RCTPromiseRejectBlock) reject;
- (void) setUpdateInterval:(double) interval;
- (void) getUpdateInterval:(RCTResponseSenderBlock) cb;
- (void) getData:(RCTResponseSenderBlock) cb;
- (void) startUpdates;
- (void) stopUpdates;

@end

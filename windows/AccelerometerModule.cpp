#include "pch.h"

#include "AccelerometerModule.h"

using namespace winrt::Microsoft::ReactNative;
using namespace winrt::Windows::Devices::Sensors;

namespace winrt::RNSensors::implementation
{
void AccelerometerManager::Initialize(ReactContext const& context)
{
    assert(context.UIDispatcher().HasThreadAccess());

    m_reactContext = context;
    m_accelerometer = Accelerometer::GetDefault();
    if (m_accelerometer)
    {
        // Note the explicit transform being applied here. This is required to keep the meaning
        // of the values sent across consistent.
        //   - If the device sensor axis is aligned such that the primary sensor axis is in portrait
        //     orientation, then this does nothing and retains the original meaning of x, y, and z
        //     being as if the device had a portrait default screen shape like a phone.
        //   - If the device sensor axis is aligned such that the primary sensor axis is in landscape
        //     orientation, such as a laptop, then it transforms the x, y, and z value as if the device
        //     has a portrait primary axis.
        // This unifies the definition exposed by react-native-sensors to always have the same meaning
        // with respect to the screen orientation of the device.
        m_accelerometer.ReadingTransform(winrt::Windows::Graphics::Display::DisplayOrientations::Portrait);
    }
}

void AccelerometerManager::Teardown()
{
    assert(m_reactContext.UIDispatcher().HasThreadAccess());

    stopUpdates();
    m_accelerometer = nullptr;
}

void AccelerometerManager::isAvailable(ReactPromise<void> promise) noexcept
{
    assert(m_reactContext.UIDispatcher().HasThreadAccess());

    if (m_accelerometer)
    {
        promise.Resolve();
    }
    else
    {
        promise.Reject("Accelerometer is not available");
    }
}

void AccelerometerManager::setUpdateInterval(uint32_t newInterval) noexcept
{
    assert(m_reactContext.UIDispatcher().HasThreadAccess());

    m_desiredIntervalMs = newInterval;
    if (m_accelerometer)
    {
        uint32_t minimumReportInterval = m_accelerometer.MinimumReportInterval();
        if (m_desiredIntervalMs > minimumReportInterval)
        {
            m_accelerometer.ReportInterval(m_desiredIntervalMs);
        }
        else
        {
            m_accelerometer.ReportInterval(minimumReportInterval);
        }
    }
}

void AccelerometerManager::startUpdates() noexcept
{
    assert(m_reactContext.UIDispatcher().HasThreadAccess());

    if (m_accelerometer && !m_readingChangedEventRevoker)
    {
        m_readingChangedEventRevoker =
            m_accelerometer.ReadingChanged(winrt::auto_revoke, {get_weak(), &AccelerometerManager::OnReadingChanged});
    }
}

void AccelerometerManager::stopUpdates() noexcept
{
    assert(m_reactContext.UIDispatcher().HasThreadAccess());

    if (m_accelerometer && m_readingChangedEventRevoker)
    {
        m_readingChangedEventRevoker.revoke();
        m_accelerometer.ReportInterval(0);
    }
}

void AccelerometerManager::OnReadingChanged(Accelerometer /* sender */, AccelerometerReadingChangedEventArgs args)
{
    AccelerometerReading reading = args.Reading();

    // Note that CallJSFunction was used intentionally instead of EmitJSEvent here.
    // At the time of writing this comment, a bug exists in the RNW implementation
    // that is consumed by this library.
    // See: * https://github.com/microsoft/react-native-windows/issues/5951 (the bug)
    //      * https://github.com/microsoft/react-native-windows/pull/6285   (the PR it was fixed in)
    // The bug is that EmitJSEvent wraps single arguments passed (in this case the JSValueObject)
    // in an array without reason. This makes it such that on the JS side the type of the data
    // passed through the event is not what it expects. Using this workaround through
    // CallJSFunction however does not hit the bug and the data of the event goes through as expected.
    m_reactContext.CallJSFunction(
        L"RCTDeviceEventEmitter",
        L"emit",
        L"Accelerometer",
        JSValueObject{
            {"x", reading.AccelerationX()},
            {"y", reading.AccelerationY()},
            {"z", reading.AccelerationZ()},
            {"timestamp", reading.Timestamp().time_since_epoch().count()}});
}

AccelerometerModule::~AccelerometerModule()
{
    if (m_reactContext)
    {
        m_reactContext.UIDispatcher().Post([accelManager = m_accelManager]() { accelManager->Teardown(); });
    }
}

void AccelerometerModule::Initialize(ReactContext const& context) noexcept
{
    m_reactContext = context;
    m_accelManager = winrt::make_self<AccelerometerManager>();

    m_reactContext.UIDispatcher().Post(
        [accelManager = m_accelManager, reactContext = m_reactContext]() { accelManager->Initialize(reactContext); });
}

void AccelerometerModule::isAvailable(ReactPromise<void> promise) noexcept
{
    m_reactContext.UIDispatcher().Post(
        [accelManager = m_accelManager, promise]() { accelManager->isAvailable(promise); });
}

void AccelerometerModule::setUpdateInterval(uint32_t newInterval) noexcept
{
    m_reactContext.UIDispatcher().Post(
        [accelManager = m_accelManager, newInterval]() { accelManager->setUpdateInterval(newInterval); });
}

void AccelerometerModule::startUpdates() noexcept
{
    m_reactContext.UIDispatcher().Post([accelManager = m_accelManager]() { accelManager->startUpdates(); });
}

void AccelerometerModule::stopUpdates() noexcept
{
    m_reactContext.UIDispatcher().Post([accelManager = m_accelManager]() { accelManager->stopUpdates(); });
}
} // namespace winrt::RNSensors::implementation
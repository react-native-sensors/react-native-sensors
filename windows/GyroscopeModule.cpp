#include "pch.h"

#include "GyroscopeModule.h"

using namespace winrt::Microsoft::ReactNative;
using namespace winrt::Windows::Devices::Sensors;

namespace winrt::RNSensors::implementation
{
const float Pi = 3.14159f;

void GyroscopeManager::Initialize(ReactContext const& context)
{
    assert(context.UIDispatcher().HasThreadAccess());

    m_reactContext = context;
    m_gyrometer = Gyrometer::GetDefault();
    if (m_gyrometer)
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
        m_gyrometer.ReadingTransform(winrt::Windows::Graphics::Display::DisplayOrientations::Portrait);
    }
}

void GyroscopeManager::Teardown()
{
    assert(m_reactContext.UIDispatcher().HasThreadAccess());

    stopUpdates();
    m_gyrometer = nullptr;
}

void GyroscopeManager::isAvailable(ReactPromise<void> promise) noexcept
{
    assert(m_reactContext.UIDispatcher().HasThreadAccess());

    if (m_gyrometer)
    {
        promise.Resolve();
    }
    else
    {
        promise.Reject("Gyroscope is not available");
    }
}

void GyroscopeManager::setUpdateInterval(uint32_t newInterval) noexcept
{
    assert(m_reactContext.UIDispatcher().HasThreadAccess());

    m_desiredIntervalMs = newInterval;
    if (m_gyrometer)
    {
        uint32_t minimumReportInterval = m_gyrometer.MinimumReportInterval();
        m_gyrometer.ReportInterval(std::max<uint32_t>(minimumReportInterval, m_desiredIntervalMs));
    }
}

void GyroscopeManager::startUpdates() noexcept
{
    assert(m_reactContext.UIDispatcher().HasThreadAccess());

    if (m_gyrometer && !m_readingChangedEventRevoker)
    {
        setUpdateInterval(m_desiredIntervalMs);
        m_readingChangedEventRevoker =
            m_gyrometer.ReadingChanged(winrt::auto_revoke, { get_weak(), &GyroscopeManager::OnReadingChanged });
    }
}

void GyroscopeManager::stopUpdates() noexcept
{
    assert(m_reactContext.UIDispatcher().HasThreadAccess());

    if (m_gyrometer && m_readingChangedEventRevoker)
    {
        m_readingChangedEventRevoker.revoke();
        m_gyrometer.ReportInterval(0);
    }
}

void GyroscopeManager::OnReadingChanged(Gyrometer /* sender */, GyrometerReadingChangedEventArgs args)
{
    GyrometerReading reading = args.Reading();

    m_reactContext.EmitJSEvent(
        L"RCTDeviceEventEmitter",
        L"Gyroscope",
        JSValueObject{ { "x", reading.AngularVelocityX() / 180 * Pi },
                       { "y", reading.AngularVelocityY() / 180 * Pi },
                       { "z", reading.AngularVelocityZ() / 180 * Pi },
                       { "timestamp", reading.Timestamp().time_since_epoch().count() } });
}

GyroscopeModule::~GyroscopeModule()
{
    if (m_reactContext && m_gyroManager)
    {
        m_reactContext.UIDispatcher().Post(
            [gyroManager = std::move(m_gyroManager)]()
            {
                gyroManager->Teardown();
            });
    }
}

void GyroscopeModule::Initialize(ReactContext const& context) noexcept
{
    m_reactContext = context;
    m_gyroManager = winrt::make_self<GyroscopeManager>();

    m_reactContext.UIDispatcher().Post(
        [gyroManager = m_gyroManager, reactContext = m_reactContext]()
        {
            gyroManager->Initialize(reactContext);
        });
}

void GyroscopeModule::isAvailable(ReactPromise<void> promise) noexcept
{
    m_reactContext.UIDispatcher().Post(
        [gyroManager = m_gyroManager, promise]()
        {
            gyroManager->isAvailable(promise);
        });
}

void GyroscopeModule::setUpdateInterval(uint32_t newInterval) noexcept
{
    m_reactContext.UIDispatcher().Post(
        [gyroManager = m_gyroManager, newInterval]()
        {
            gyroManager->setUpdateInterval(newInterval);
        });
}

void GyroscopeModule::startUpdates() noexcept
{
    m_reactContext.UIDispatcher().Post(
        [gyroManager = m_gyroManager]()
        {
            gyroManager->startUpdates();
        });
}

void GyroscopeModule::stopUpdates() noexcept
{
    m_reactContext.UIDispatcher().Post(
        [gyroManager = m_gyroManager]()
        {
            gyroManager->stopUpdates();
        });
}

// Keep: Required for RN build in Event Emitter Calls.
void GyroscopeModule::addListener(std::string) noexcept
{
  hasListeners = true;
}

// Keep: Required for RN build in Event Emitter Calls.
void GyroscopeModule::removeListeners(int64_t) noexcept
{
  hasListeners = false;
  // If we no longer have listeners registered we should also probably also stop the sensor since the sensor events are essentially being dropped.
  if (m_gyroManager) {
    GyroscopeModule::stopUpdates();
  }
}
} // namespace winrt::RNSensors::implementation

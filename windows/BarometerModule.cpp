#include "pch.h"

#include "BarometerModule.h"

using namespace winrt::Microsoft::ReactNative;
using namespace winrt::Windows::Devices::Sensors;

namespace winrt::RNSensors::implementation 
{
void BarometerManager::Initialize(ReactContext const& context) {
    assert(context.UIDispatcher().HasThreadAccess());

    m_reactContext = context;
    m_barometer = Barometer::GetDefault();
}

void BarometerManager::isAvailable(ReactPromise<void> promise) noexcept {
  assert(m_reactContext.UIDispatcher().HasThreadAccess());

  if (m_barometer) {
    promise.Resolve();
  }
  else {
    promise.Reject("Barometer is not available");
  }
}

void BarometerManager::setUpdateInterval(uint32_t newInterval) noexcept {
  assert(m_reactContext.UIDispatcher().HasThreadAccess());

  m_desiredIntervalMs = newInterval;
  if (m_barometer) {
    uint32_t minimumReportInterval = m_barometer.MinimumReportInterval();
    m_barometer.ReportInterval(std::max<uint32_t>(m_desiredIntervalMs, minimumReportInterval));
  }
}

void BarometerManager::startUpdates() noexcept {
  assert(m_reactContext.UIDispatcher().HasThreadAccess());

  if (m_barometer && !m_readingChangedEventRevoker) {
    setUpdateInterval(m_desiredIntervalMs);
    m_readingChangedEventRevoker = m_barometer.ReadingChanged(winrt::auto_revoke, { get_weak(), &BarometerManager::OnReadingChanged });
  }
}

void BarometerManager::stopUpdates() noexcept {
  assert(m_reactContext.UIDispatcher().HasThreadAccess());

  if (m_barometer && m_readingChangedEventRevoker) {
    m_readingChangedEventRevoker.revoke();
    m_barometer.ReportInterval(0);
  }
}

void BarometerManager::OnReadingChanged(Barometer /* sender */, BarometerReadingChangedEventArgs args) {
  BarometerReading reading = args.Reading();

  m_reactContext.EmitJSEvent(
    L"RCTDeviceEventEmitter",
    L"Barometer",
    JSValueObject{
      { "pressure", reading.StationPressureInHectopascals() },
      { "timestamp", reading.Timestamp().time_since_epoch().count() }
    }
  );
}

void BarometerManager::Teardown() {
  assert(m_reactContext.UIDispatcher().HasThreadAccess());

  BarometerManager::stopUpdates();
  m_barometer = nullptr;
}

BarometerModule::~BarometerModule() {
    if (m_reactContext) {
      m_reactContext.UIDispatcher().Post([baroManager = m_baroManager] {
        baroManager->Teardown();
      });
    }
}

void BarometerModule::isAvailable(ReactPromise<void> promise) noexcept
{
  if (m_reactContext) {
    m_reactContext.UIDispatcher().Post([baroManager = m_baroManager, promise] {
      baroManager->isAvailable(promise);
    });
  }
}

void BarometerModule::setUpdateInterval(uint32_t newInterval) noexcept
{
  if (m_reactContext) {
    m_reactContext.UIDispatcher().Post([baroManager = m_baroManager, newInterval] {
      baroManager->setUpdateInterval(newInterval);
    });
  }
}

void BarometerModule::startUpdates() noexcept
{
  if (m_reactContext) {
    m_reactContext.UIDispatcher().Post([baroManager = m_baroManager] {
      baroManager->startUpdates();
    });
  }
}

void BarometerModule::stopUpdates() noexcept
{
  if (m_reactContext) {
    m_reactContext.UIDispatcher().Post([baroManager = m_baroManager] {
      baroManager->stopUpdates();
    });
  }
}

// Keep: Required for RN build in Event Emitter Calls.
void BarometerModule::addListener(std::string) noexcept
{
  hasListeners = true;
}

// Keep: Required for RN build in Event Emitter Calls.
void BarometerModule::removeListeners(int64_t) noexcept
{
  hasListeners = false;
  // If we no longer have listeners registered we should also probably also stop the sensor since the sensor events are essentially being dropped.
  if (m_baroManager) {
    BarometerModule::stopUpdates();
  }
}
} // namespace winrt::RNSensors::implementation



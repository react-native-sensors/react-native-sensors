// Copyright (C) Microsoft Corporation. All rights reserved.

#include "pch.h"

#include "MagnetometerModule.h"

using namespace winrt::Microsoft::ReactNative;
using namespace winrt::Windows::Devices::Sensors;

namespace winrt::RNSensors::implementation 
{
void MagnetometerManager::Initialize(ReactContext const& context) {
    assert(context.UIDispatcher().HasThreadAccess());

    m_reactContext = context;
    m_magnetometer = Magnetometer::GetDefault();
}

void MagnetometerManager::isAvailable(ReactPromise<void> promise) noexcept {
  assert(m_reactContext.UIDispatcher().HasThreadAccess());

  if (m_magnetometer) {
    promise.Resolve();
  }
  else {
    promise.Reject("Magnetometer is not available");
  }
}

void MagnetometerManager::setUpdateInterval(uint32_t newInterval) noexcept {
  assert(m_reactContext.UIDispatcher().HasThreadAccess());

  m_desiredIntervalMs = newInterval;
  if (m_magnetometer) {
    uint32_t minimumReportInterval = m_magnetometer.MinimumReportInterval();
    m_magnetometer.ReportInterval(std::max<uint32_t>(m_desiredIntervalMs, minimumReportInterval));
  }
}

void MagnetometerManager::startUpdates() noexcept {
  assert(m_reactContext.UIDispatcher().HasThreadAccess());

  if (m_magnetometer && !m_readingChangedEventRevoker) {
    setUpdateInterval(m_desiredIntervalMs);
    m_readingChangedEventRevoker = m_magnetometer.ReadingChanged(winrt::auto_revoke, { get_weak(), &MagnetometerManager::OnReadingChanged });
  }
}

void MagnetometerManager::stopUpdates() noexcept {
  assert(m_reactContext.UIDispatcher().HasThreadAccess());

  if (m_magnetometer && m_readingChangedEventRevoker) {
    m_readingChangedEventRevoker.revoke();
    m_magnetometer.ReportInterval(0);
  }
}

void MagnetometerManager::OnReadingChanged(Magnetometer /* sender */, MagnetometerReadingChangedEventArgs args) {
  MagnetometerReading reading = args.Reading();

  m_reactContext.EmitJSEvent(
    L"RCTDeviceEventEmitter",
    L"Magnetometer",
    JSValueObject{
      { "x", reading.MagneticFieldX() },
      { "y", reading.MagneticFieldY() },
      { "z", reading.MagneticFieldZ() },
      { "timestamp", reading.Timestamp().time_since_epoch().count() }
    }
  );
}

void MagnetometerManager::Teardown() {
  assert(m_reactContext.UIDispatcher().HasThreadAccess());

  MagnetometerManager::stopUpdates();
  m_magnetometer = nullptr;
}

MagnetometerModule::~MagnetometerModule() {
    if (m_reactContext) {
      m_reactContext.UIDispatcher().Post([magnetoManager = m_magnetoManager] {
        magnetoManager->Teardown();
      });
    }
}

void MagnetometerModule::isAvailable(ReactPromise<void> promise) noexcept
{
  if (m_reactContext) {
    m_reactContext.UIDispatcher().Post([magnetoManager = m_magnetoManager, promise] {
      magnetoManager->isAvailable(promise);
    });
  }
}

void MagnetometerModule::setUpdateInterval(uint32_t newInterval) noexcept
{
  if (m_reactContext) {
    m_reactContext.UIDispatcher().Post([magnetoManager = m_magnetoManager, newInterval] {
      magnetoManager->setUpdateInterval(newInterval);
    });
  }
}

void MagnetometerModule::startUpdates() noexcept
{
  if (m_reactContext) {
    m_reactContext.UIDispatcher().Post([magnetoManager = m_magnetoManager] {
      magnetoManager->startUpdates();
    });
  }
}

void MagnetometerModule::stopUpdates() noexcept
{
  if (m_reactContext) {
    m_reactContext.UIDispatcher().Post([magnetoManager = m_magnetoManager] {
      magnetoManager->stopUpdates();
    });
  }
}
} // namespace winrt::RNSensors::implementation



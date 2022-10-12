#pragma once

#include "NativeModules.h"

namespace RN = winrt::Microsoft::ReactNative;
namespace WS = winrt::Windows::Devices::Sensors;

namespace winrt::RNSensors::implementation
{
  struct MagnetometerManager : public winrt::implements<MagnetometerManager, winrt::Windows::Foundation::IInspectable>
  {
    void Initialize(RN::ReactContext const& context);
    void Teardown();

    void isAvailable(RN::ReactPromise<void> /* promise */) noexcept;
    void setUpdateInterval(uint32_t /* newInterval */) noexcept;
    void startUpdates() noexcept;
    void stopUpdates() noexcept;

  private:
    RN::ReactContext m_reactContext;
    WS::Magnetometer m_magnetometer{ nullptr };

    uint32_t m_desiredIntervalMs = 16;

    void OnReadingChanged(WS::Magnetometer /* sender */, WS::MagnetometerReadingChangedEventArgs /* args */);
    WS::Magnetometer::ReadingChanged_revoker m_readingChangedEventRevoker;
  };

  REACT_MODULE(MagnetometerModule, L"RNSensorsMagnetometer")
    struct MagnetometerModule
  {
  public:
    MagnetometerModule() = default;
    ~MagnetometerModule();

    REACT_METHOD(isAvailable)
      void isAvailable(RN::ReactPromise<void> promise) noexcept;

    REACT_METHOD(setUpdateInterval)
      void setUpdateInterval(uint32_t newInterval) noexcept;

    REACT_METHOD(startUpdates)
      void startUpdates() noexcept;

    REACT_METHOD(stopUpdates)
      void stopUpdates() noexcept;

  private:
    RN::ReactContext m_reactContext;
    winrt::com_ptr<MagnetometerManager> m_magnetoManager;
  };
}

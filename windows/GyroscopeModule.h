#pragma once
#include "pch.h"

#include "NativeModules.h"

#include <winrt/Windows.Devices.Sensors.h>

namespace RN = winrt::Microsoft::ReactNative;
namespace WS = winrt::Windows::Devices::Sensors;

namespace winrt::RNSensors::implementation
{
struct GyroscopeManager : public winrt::implements<GyroscopeManager, winrt::Windows::Foundation::IInspectable>
{
    void Initialize(RN::ReactContext const& context);
    void Teardown();

    void isAvailable(RN::ReactPromise<void> /* promise */) noexcept;
    void setUpdateInterval(uint32_t /* newInterval */) noexcept;
    void startUpdates() noexcept;
    void stopUpdates() noexcept;

private:
    RN::ReactContext m_reactContext;
    WS::Gyrometer m_gyrometer = nullptr;

    uint32_t m_desiredIntervalMs = 16;

    void OnReadingChanged(WS::Gyrometer /* sender */, WS::GyrometerReadingChangedEventArgs /* args */);
    winrt::impl::event_revoker<WS::IGyrometer, &winrt::impl::abi<WS::IGyrometer>::type::remove_ReadingChanged>
        m_readingChangedEventRevoker;
};

REACT_MODULE(GyroscopeModule, L"Gyroscope");
struct GyroscopeModule
{
public:
    GyroscopeModule() = default;
    ~GyroscopeModule();

    REACT_INIT(Initialize)
    void Initialize(RN::ReactContext const& context) noexcept;

    REACT_METHOD(isAvailable)
    void isAvailable(RN::ReactPromise<void> promise) noexcept;

    REACT_METHOD(setUpdateInterval)
    void setUpdateInterval(uint32_t /* newInterval */) noexcept;

    REACT_METHOD(startUpdates)
    void startUpdates() noexcept;

    REACT_METHOD(stopUpdates)
    void stopUpdates() noexcept;

private:
    RN::ReactContext m_reactContext;
    winrt::com_ptr<GyroscopeManager> m_gyroManager;
};
} // namespace winrt::RNSensors::implementation
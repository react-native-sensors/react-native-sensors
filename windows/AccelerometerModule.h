#pragma once

#include "NativeModules.h"

namespace RN = winrt::Microsoft::ReactNative;
namespace WS = winrt::Windows::Devices::Sensors;

namespace winrt::RNSensors::implementation
{
struct AccelerometerManager : public winrt::implements<AccelerometerManager, winrt::Windows::Foundation::IInspectable>
{
    void Initialize(RN::ReactContext const& context);
    void Teardown();

    void isAvailable(RN::ReactPromise<void> /* promise */) noexcept;
    void setUpdateInterval(uint32_t /* newInterval */) noexcept;
    void startUpdates() noexcept;
    void stopUpdates() noexcept;

private:
    RN::ReactContext m_reactContext;
    WS::Accelerometer m_accelerometer = nullptr;

    uint32_t m_desiredIntervalMs = 16;

    void OnReadingChanged(WS::Accelerometer /* sender */, WS::AccelerometerReadingChangedEventArgs /* args */);
    winrt::impl::event_revoker<WS::IAccelerometer, &winrt::impl::abi<WS::IAccelerometer>::type::remove_ReadingChanged>
        m_readingChangedEventRevoker;
};

REACT_MODULE(AccelerometerModule, L"RNSensorsAccelerometer")
struct AccelerometerModule
{
public:
    AccelerometerModule() = default;
    ~AccelerometerModule();

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

    // Suppresses a warning that isn't really valid with react-native-windows
    REACT_METHOD(addListener);
    void addListener(std::string) noexcept;

    // Suppresses a warning that isn't really valid with react-native-windows
    REACT_METHOD(removeListeners);
    void removeListeners(int64_t) noexcept;

private:
    RN::ReactContext m_reactContext;
    winrt::com_ptr<AccelerometerManager> m_accelManager;
    int64_t m_listenerCount;
};
} // namespace winrt::RNSensors::implementation

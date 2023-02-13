#pragma once

#include "NativeModules.h"

namespace RN = winrt::Microsoft::ReactNative;
namespace WS = winrt::Windows::Devices::Sensors;

namespace winrt::RNSensors::implementation
{
struct BarometerManager : public winrt::implements<BarometerManager, winrt::Windows::Foundation::IInspectable>
{
	void Initialize(RN::ReactContext const& context);
	void Teardown();

	void isAvailable(RN::ReactPromise<void> /* promise */) noexcept;
	void setUpdateInterval(uint32_t /* newInterval */) noexcept;
	void startUpdates() noexcept;
	void stopUpdates() noexcept;

	private:
		RN::ReactContext m_reactContext;
		WS::Barometer m_barometer{ nullptr };

		uint32_t m_desiredIntervalMs = 16;

		void OnReadingChanged(WS::Barometer /* sender */, WS::BarometerReadingChangedEventArgs /* args */);
		WS::Barometer::ReadingChanged_revoker m_readingChangedEventRevoker;
};

REACT_MODULE(BarometerModule, L"RNSensorsBarometer")
	struct BarometerModule
{
	public:
		BarometerModule() = default;
		~BarometerModule();

		REACT_METHOD(isAvailable)
			void isAvailable(RN::ReactPromise<void> promise) noexcept;

		REACT_METHOD(setUpdateInterval)
			void setUpdateInterval(uint32_t newInterval) noexcept;

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
		winrt::com_ptr<BarometerManager> m_baroManager;
		int64_t m_listenerCount;
};
}

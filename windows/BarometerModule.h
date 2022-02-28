// Copyright (C) Microsoft Corporation. All rights reserved.

#pragma once

#include "NativeModules.h"

REACT_MODULE(BarometerModule, L"Barometer");
struct BarometerModule
{
    REACT_METHOD(isAvailable)
    void isAvailable(winrt::Microsoft::ReactNative::ReactPromise<int64_t> promise) noexcept;

    REACT_METHOD(setUpdateInterval)
    void setUpdateInterval(int newInterval) noexcept;

    REACT_METHOD(startUpdates)
    void startUpdates() noexcept;

    REACT_METHOD(stopUpdates)
    void stopUpdates() noexcept;
};

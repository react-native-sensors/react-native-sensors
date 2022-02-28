// Copyright (C) Microsoft Corporation. All rights reserved.

#include "pch.h"

#include "BarometerModule.h"

void BarometerModule::isAvailable(winrt::Microsoft::ReactNative::ReactPromise<int64_t> promise) noexcept
{
    // TODO
    promise.Reject("NotYetImplemented");
}

void BarometerModule::setUpdateInterval(int /*newInterval*/) noexcept
{
    // TODO
}

void BarometerModule::startUpdates() noexcept
{
    // TODO
}

void BarometerModule::stopUpdates() noexcept
{
    // TODO
}

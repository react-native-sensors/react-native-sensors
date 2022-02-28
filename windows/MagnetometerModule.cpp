// Copyright (C) Microsoft Corporation. All rights reserved.

#include "pch.h"

#include "MagnetometerModule.h"

void MagnetometerModule::isAvailable(winrt::Microsoft::ReactNative::ReactPromise<int64_t> promise) noexcept
{
    // TODO
    promise.Reject("NotYetImplemented");
}

void MagnetometerModule::setUpdateInterval(int /*newInterval*/) noexcept
{
    // TODO
}

void MagnetometerModule::startUpdates() noexcept
{
    // TODO
}

void MagnetometerModule::stopUpdates() noexcept
{
    // TODO
}
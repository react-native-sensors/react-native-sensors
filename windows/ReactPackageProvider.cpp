#include "pch.h"
#include "ReactPackageProvider.h"
#include "ReactPackageProvider.g.cpp"

#include <ModuleRegistration.h>

// NOTE: You must include the headers of your native modules here in
// order for the AddAttributedModules call below to find them.
#include "AccelerometerModule.h"
#include "BarometerModule.h"
#include "GyroscopeModule.h"
#include "MagnetometerModule.h"

namespace winrt::RNSensors::implementation
{
    void ReactPackageProvider::CreatePackage(IReactPackageBuilder const& packageBuilder) noexcept
    {
        AddAttributedModules(packageBuilder);
    }
}
require 'json'

package = JSON.parse(File.read('./package.json'))

Pod::Spec.new do |s|
  s.name                = 'RNSensors'
  s.version             = package['version']
  s.summary             = package['description']
  s.description         = package['description']
  s.homepage            = package['homepage']
  s.license             = package['license']
  s.author              = package['author']
  s.source              = { :git => "https://github.com/react-native-sensors/react-native-sensors.git" }
  s.platform            = :ios, "7.0"
  s.source_files        = "ios/*.{h,m}"
  s.preserve_paths      = "*.js"
  s.dependency 'React-Core'
end

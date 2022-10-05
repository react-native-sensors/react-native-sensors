/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const fs = require("fs");
const path = require("path");
const exclusionList = require("metro-config/src/defaults/exclusionList");

const rnwPath = fs.realpathSync(path.resolve(require.resolve("react-native-windows/package.json"), ".."));
const rnSensorPath = path.resolve(__dirname, "./../../react-native-sensors");

module.exports = {
  resolver: {
    nodeModulePath: [rnSensorPath],
    blockList: exclusionList([
      /react-native-sensors[/\\]node_modules[/\\]react-native[/\\].*/,
      /react-native-sensors[/\\]node_modules[/\\]react-native-windows[/\\].*/,
      // This stops "react-native run-windows" from causing the metro server to crash if its already running
      new RegExp(`${path.resolve(__dirname, "windows").replace(/[/\\]/g, "/")}.*`),
      // This prevents "react-native run-windows" from hitting: EBUSY: resource busy or locked, open msbuild.ProjectImports.zip or other files produced by msbuild
      new RegExp(`${rnwPath}/build/.*`),
      new RegExp(`${rnwPath}/target/.*`),
      // This prevents "react-native run-windows" from hitting: EBUSY: resource busy or locked, open msbuild.ProjectImports.zip
      new RegExp(`${path.resolve(__dirname, "msbuild.ProjectImports.zip").replace(/[/\\]/g, "/")}.*`),
    ]),
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};

// metro.config.js
const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */

// Existing Metro configuration options
const config = {
  // Your existing Metro configuration options here
};

// Merge the default configuration with your custom configuration
const mergedConfig = mergeConfig(getDefaultConfig(__dirname), config);

// Wrap with Reanimated Metro config
module.exports = wrapWithReanimatedMetroConfig(mergedConfig);

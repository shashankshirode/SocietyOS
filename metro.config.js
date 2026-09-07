const { getDefaultConfig } = require('expo/metro-config');

// Disable React Navigation check for Expo SDK 56/57+
process.env.EXPO_ROUTER_DISABLE_RN_NAVIGATION_CHECK = '1';

const config = getDefaultConfig(__dirname);

module.exports = config;

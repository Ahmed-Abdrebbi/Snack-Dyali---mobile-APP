const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);

config.resolver.blockList = [/AppData[\\/]Local[\\/].*/];

module.exports = config;

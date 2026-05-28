module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    // react-native-reanimated plugin is auto-included by babel-preset-expo in SDK 56
    // but listed explicitly for clarity
    plugins: ['react-native-reanimated/plugin'],
  };
};

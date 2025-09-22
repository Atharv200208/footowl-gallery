jest.mock(
    '@react-native-async-storage/async-storage',
    () => require('@react-native-async-storage/async-storage/jest/async-storage-mock')
  );

// jest-setup.js
import '@testing-library/jest-native/extend-expect';

// Basic mocks for common native modules
jest.mock('expo-image', () => {
  const { Image } = require('react-native');
  return {
    __esModule: true,
    Image,
  };
});

// react-native-reanimated minimal mock
jest.mock('react-native-reanimated', () => {
  // Reanimated 2 minimal mock for tests
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default = Reanimated;
  Reanimated.__esModule = true;
  // keep the helper used by many libs
  Reanimated.useAnimatedStyle = () => {};
  Reanimated.withTiming = (v) => v;
  return Reanimated;
});

// Silence native event emitter warnings
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

// If you use icons that require vector icons, mock them
jest.mock('@expo/vector-icons', () => {
  return {
    MaterialIcons: 'MaterialIcons',
    Ionicons: 'Ionicons',
  };
});

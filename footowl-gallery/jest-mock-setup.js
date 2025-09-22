// jest-mock-setup.js
// This runs BEFORE any modules are required so top-level imports pick up mocks.
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

jest.mock(
    '@react-native-async-storage/async-storage',
    () => require('@react-native-async-storage/async-storage/jest/async-storage-mock')
  );
  
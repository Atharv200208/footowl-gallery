// jest.config.js
module.exports = {
  preset: 'jest-expo',
  setupFiles: ['<rootDir>/jest-mock-setup.js'],
  setupFilesAfterEnv: ['<rootDir>/jest-setup.js'],
  transformIgnorePatterns: [
    // transform these packages (allow them to be transformed by Babel)
    'node_modules/(?!(react-native|@react-native|expo|@expo|expo-modules-core|@unimodules|@react-navigation|@shopify|@tanstack|@testing-library)/)',
  ],
  moduleNameMapper: {
    // handle asset imports in tests
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less)$': '<rootDir>/__mocks__/styleMock.js',
  },
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
};

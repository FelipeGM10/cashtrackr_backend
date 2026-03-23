/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json'
    }
  },
  testEnvironment: 'node',
  detectOpenHandles: true,
  openHandlesTimeout: 10 * 1000,
  testTimeout: 10 * 1000
};

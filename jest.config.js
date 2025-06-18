module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(test).[jt]s?(x)'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'resolvers/**/*.js',
    'auth/**/*.js',
    'utils/**/*.js',
    '!**/node_modules/**',
  ],
};

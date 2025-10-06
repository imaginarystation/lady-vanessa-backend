module.exports = {
    testEnvironment: 'node',
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/server.js',
        '!src/config/**'
    ],
    testMatch: ['**/__tests__/**/*.test.js'],
    testTimeout: 10000,
    verbose: true,
    forceExit: true,
    clearMocks: true,
    resetMocks: true,
    restoreMocks: true
};

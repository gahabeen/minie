module.exports = {
    testTimeout: 60e3,
    maxWorkers: 3,
    preset: 'ts-jest',
    testEnvironment: 'node',
    collectCoverage: false,
    testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    collectCoverageFrom: [
        '<rootDir>//src/**/*.[jt]s',
    ],
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.json',
        },
    }
};

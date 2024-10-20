import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  clearMocks: true,

  collectCoverage: true,
  coverageDirectory: "coverage",

  rootDir: './',
  roots: [
    "<rootDir>/src",
    "<rootDir>/tests"
  ],

  testMatch: [
    '**/tests/**/*.test.ts'
  ],

  moduleNameMapper: {
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@controllers/(.*)$': '<rootDir>/src/controllers/$1',
    '^@repositories/(.*)$': '<rootDir>/src/repositories/$1',
  },

  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/index.ts",
  ],

  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};

export default config;

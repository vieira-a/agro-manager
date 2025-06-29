import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverage: true,
  coverageDirectory: '../coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'main.ts',
    '.*\\.module\\.ts$',
    '.*\\.dto\\.ts$',
    '.*\\.entity\\.ts$',
    '.*\\.mapper\\.ts$',
    '.*\\.guard\\.ts$',
    '.*\\.strategy\\.ts$',
    '.*\\.request\\.ts$',
    '.*\\.response\\.ts$',
    '.*\\.e2e-spec\\.ts$',
  ],
  testEnvironment: 'node',
};

export default config;

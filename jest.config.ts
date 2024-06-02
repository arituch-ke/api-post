import {pathsToModuleNameMapper} from 'ts-jest';
import * as tsConfig from './tsconfig.json';

export default {
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        publicPath: './report',
        filename: 'report.html',
        pageTitle: 'Post API TEST Report',
        openReport: true,
      },
    ],
  ],
  preset: 'ts-jest',
  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: 'v8',
  testEnvironment: 'node',

  setupFiles: ['./test/testHelpers/mockEnv.ts'],

  // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
  moduleNameMapper: pathsToModuleNameMapper(tsConfig.compilerOptions.paths, {
    prefix: __dirname,
  }),

  // A path to a module which exports an async function that is triggered once before all test suites
  globalSetup: '<rootDir>/test/testHelpers/setup.ts',

  // A path to a module which exports an async function that is triggered once after all test suites
  globalTeardown: '<rootDir>/test/testHelpers/teardown.ts',

  // A list of paths to modules that run some code to configure or set up the testing framework before each test
  setupFilesAfterEnv: [
    // '<rootDir>/test/testHelpers/setupEach.ts',
    'jest-extended/all',
  ],

  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
};

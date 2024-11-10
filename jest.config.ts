import { createDefaultPreset, JestConfigWithTsJest } from "ts-jest";

module.exports = {
  ...createDefaultPreset({
    tsconfig: "<rootDir>/tsconfig.test.json",
  }),
  roots: ["<rootDir>"],
  testEnvironment: "jsdom",
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
} satisfies JestConfigWithTsJest;

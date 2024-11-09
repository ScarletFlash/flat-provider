import { createDefaultPreset, JestConfigWithTsJest } from "ts-jest";
import { compilerOptions } from "./tsconfig.json";

module.exports = {
  ...createDefaultPreset(),
  roots: ["<rootDir>"],
  modulePaths: [compilerOptions.baseUrl],
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

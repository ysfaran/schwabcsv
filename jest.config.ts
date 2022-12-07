/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */
import { JestConfigWithTsJest } from "ts-jest";

export default {
  preset: "ts-jest",
  testEnvironment: "node",
  clearMocks: true,
  errorOnDeprecated: true,
  testMatch: ["<rootDir>/src/**/*-test.ts"],
} as JestConfigWithTsJest;

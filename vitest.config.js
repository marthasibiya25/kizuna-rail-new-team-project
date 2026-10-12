import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["test/ticket-classes-api.test.js"],
    testTimeout: 30000,
    hookTimeout: 600000,
  },
});

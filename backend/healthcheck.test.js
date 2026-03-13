import { describe, it, expect } from "vitest";

describe("backend setup", () => {
  it("runs in node environment", () => {
    expect(typeof process.env).toBe("object");
  });
});

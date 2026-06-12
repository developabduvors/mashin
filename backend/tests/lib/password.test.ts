import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "../../src/lib/password";

describe("password", () => {
  it("hash qiladi va to'g'ri parolni tasdiqlaydi", async () => {
    const hash = await hashPassword("secret123");
    expect(hash).not.toBe("secret123");
    expect(await verifyPassword("secret123", hash)).toBe(true);
  });

  it("noto'g'ri parolni rad etadi", async () => {
    const hash = await hashPassword("secret123");
    expect(await verifyPassword("wrong", hash)).toBe(false);
  });
});

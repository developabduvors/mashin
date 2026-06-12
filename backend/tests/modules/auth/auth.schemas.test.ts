import { describe, it, expect } from "vitest";
import { registerSchema, loginSchema } from "../../../src/modules/auth/auth.schemas";

describe("auth schemas", () => {
  it("to'g'ri register kirishini qabul qiladi", () => {
    const r = registerSchema.safeParse({
      body: { email: "a@b.com", password: "secret12", fullName: "Ali" },
    });
    expect(r.success).toBe(true);
  });

  it("qisqa parolni rad etadi", () => {
    const r = registerSchema.safeParse({
      body: { email: "a@b.com", password: "123", fullName: "Ali" },
    });
    expect(r.success).toBe(false);
  });

  it("noto'g'ri email login'ni rad etadi", () => {
    const r = loginSchema.safeParse({ body: { email: "nope", password: "secret12" } });
    expect(r.success).toBe(false);
  });
});

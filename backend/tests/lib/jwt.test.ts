import { describe, it, expect, beforeAll } from "vitest";

beforeAll(() => {
  process.env.JWT_ACCESS_SECRET = "test-access";
  process.env.JWT_REFRESH_SECRET = "test-refresh";
  process.env.DATABASE_URL = "postgresql://localhost/db";
  process.env.CORS_ORIGIN = "http://localhost:3000";
});

describe("jwt", () => {
  it("access token sign/verify qiladi", async () => {
    const { signAccessToken, verifyAccessToken } = await import("../../src/lib/jwt");
    const token = signAccessToken({ sub: "u1", role: "BUYER" });
    const payload = verifyAccessToken(token);
    expect(payload.sub).toBe("u1");
    expect(payload.role).toBe("BUYER");
  });

  it("noto'g'ri secret bilan refresh verify throw qiladi", async () => {
    const { signRefreshToken, verifyRefreshToken } = await import("../../src/lib/jwt");
    const token = signRefreshToken({ sub: "u1" });
    expect(() => verifyRefreshToken(token + "tampered")).toThrow();
  });
});

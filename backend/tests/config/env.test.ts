import { describe, it, expect } from "vitest";
import { parseEnv } from "../../src/config/env";

describe("parseEnv", () => {
  const valid = {
    DATABASE_URL: "postgresql://localhost/db",
    JWT_ACCESS_SECRET: "a",
    JWT_REFRESH_SECRET: "b",
    ACCESS_TOKEN_TTL: "15m",
    REFRESH_TOKEN_TTL_DAYS: "7",
    CORS_ORIGIN: "http://localhost:3000",
    PORT: "4000",
    NODE_ENV: "development",
  };

  it("valid env'ni parse qiladi va PORT ni number qiladi", () => {
    const env = parseEnv(valid);
    expect(env.PORT).toBe(4000);
    expect(env.REFRESH_TOKEN_TTL_DAYS).toBe(7);
  });

  it("majburiy maydon yo'q bo'lsa throw qiladi", () => {
    const { JWT_ACCESS_SECRET, ...rest } = valid;
    expect(() => parseEnv(rest)).toThrow();
  });
});

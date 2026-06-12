import { describe, it, expect, vi, beforeAll } from "vitest";

beforeAll(() => {
  process.env.JWT_ACCESS_SECRET = "test-access";
  process.env.JWT_REFRESH_SECRET = "test-refresh";
  process.env.DATABASE_URL = "postgresql://localhost/db";
  process.env.CORS_ORIGIN = "http://localhost:3000";
});

describe("authenticate", () => {
  it("Authorization header yo'q bo'lsa 401 AppError", async () => {
    const { authenticate } = await import("../../src/middleware/authenticate");
    const req: any = { headers: {} };
    const next = vi.fn();
    authenticate(req, {} as any, next);
    expect(next.mock.calls[0][0]).toMatchObject({ statusCode: 401 });
  });

  it("to'g'ri token bo'lsa req.user to'ldiradi", async () => {
    const { signAccessToken } = await import("../../src/lib/jwt");
    const { authenticate } = await import("../../src/middleware/authenticate");
    const token = signAccessToken({ sub: "u1", role: "ADMIN" });
    const req: any = { headers: { authorization: `Bearer ${token}` } };
    const next = vi.fn();
    authenticate(req, {} as any, next);
    expect(next).toHaveBeenCalledWith();
    expect(req.user).toEqual({ id: "u1", role: "ADMIN" });
  });
});

describe("authorize", () => {
  it("rol mos kelmasa 403", async () => {
    const { authorize } = await import("../../src/middleware/authorize");
    const req: any = { user: { id: "u1", role: "BUYER" } };
    const next = vi.fn();
    authorize("ADMIN")(req, {} as any, next);
    expect(next.mock.calls[0][0]).toMatchObject({ statusCode: 403 });
  });

  it("rol mos kelsa o'tkazadi", async () => {
    const { authorize } = await import("../../src/middleware/authorize");
    const req: any = { user: { id: "u1", role: "ADMIN" } };
    const next = vi.fn();
    authorize("ADMIN")(req, {} as any, next);
    expect(next).toHaveBeenCalledWith();
  });
});

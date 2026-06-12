import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../../src/modules/auth/auth.repository", () => ({
  authRepository: {
    findUserByEmail: vi.fn(),
    findUserById: vi.fn(),
    createUser: vi.fn(),
    storeRefreshToken: vi.fn(),
    findRefreshToken: vi.fn(),
    revokeRefreshToken: vi.fn(),
  },
}));
vi.mock("../../../src/lib/password", () => ({
  hashPassword: vi.fn(async () => "HASHED"),
  verifyPassword: vi.fn(),
}));
vi.mock("../../../src/lib/jwt", () => ({
  signAccessToken: vi.fn(() => "ACCESS"),
  signRefreshToken: vi.fn(() => "REFRESH"),
  verifyRefreshToken: vi.fn(() => ({ sub: "u1" })),
}));

import { authService } from "../../../src/modules/auth/auth.service";
import { authRepository } from "../../../src/modules/auth/auth.repository";
import { verifyPassword } from "../../../src/lib/password";
import { AppError } from "../../../src/utils/AppError";

const repo = authRepository as any;

beforeEach(() => vi.clearAllMocks());

describe("authService.register", () => {
  it("email band bo'lsa AppError(409)", async () => {
    repo.findUserByEmail.mockResolvedValue({ id: "u1" });
    await expect(
      authService.register({ email: "a@b.com", password: "secret12", fullName: "Ali" }),
    ).rejects.toMatchObject({ statusCode: 409 });
  });

  it("yangi user yaratadi va token juftligi qaytaradi", async () => {
    repo.findUserByEmail.mockResolvedValue(null);
    repo.createUser.mockResolvedValue({
      id: "u1", email: "a@b.com", fullName: "Ali", phone: null,
      role: "BUYER", createdAt: new Date(),
    });
    repo.storeRefreshToken.mockResolvedValue({});
    const res = await authService.register({ email: "a@b.com", password: "secret12", fullName: "Ali" });
    expect(res.tokens.accessToken).toBe("ACCESS");
    expect(res.user.id).toBe("u1");
    expect((res.user as any).passwordHash).toBeUndefined();
  });
});

describe("authService.login", () => {
  it("user yo'q bo'lsa AppError(401)", async () => {
    repo.findUserByEmail.mockResolvedValue(null);
    await expect(
      authService.login({ email: "a@b.com", password: "x" }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("parol noto'g'ri bo'lsa AppError(401)", async () => {
    repo.findUserByEmail.mockResolvedValue({ id: "u1", passwordHash: "H", role: "BUYER" });
    (verifyPassword as any).mockResolvedValue(false);
    await expect(
      authService.login({ email: "a@b.com", password: "x" }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });
});

describe("authService.refresh", () => {
  it("token revoked bo'lsa AppError(401)", async () => {
    repo.findRefreshToken.mockResolvedValue({ revokedAt: new Date(), expiresAt: new Date(Date.now() + 1e6), userId: "u1" });
    await expect(authService.refresh("REFRESH")).rejects.toMatchObject({ statusCode: 401 });
  });
});

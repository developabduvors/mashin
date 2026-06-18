import { authRepository } from "./auth.repository";
import { hashPassword, verifyPassword } from "../../lib/password";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../lib/jwt";
import { AppError } from "../../utils/AppError";
import { env } from "../../config/env";
import type { RegisterInput, LoginInput } from "./auth.schemas";
import type { UserDTO, TokenPair } from "./auth.types";

type DbUser = {
  id: string; email: string; fullName: string; phone: string | null;
  role: "BUYER" | "SELLER" | "ADMIN"; createdAt: Date;
};

function toDTO(u: DbUser): UserDTO {
  return {
    id: u.id, email: u.email, fullName: u.fullName,
    phone: u.phone, role: u.role, createdAt: u.createdAt,
  };
}

async function issueTokens(user: { id: string; role: UserDTO["role"] }): Promise<TokenPair> {
  const accessToken = signAccessToken({ sub: user.id, role: user.role });
  const refreshToken = signRefreshToken({ sub: user.id });
  const expiresAt = new Date(Date.now() + env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);
  await authRepository.storeRefreshToken({ token: refreshToken, userId: user.id, expiresAt });
  return { accessToken, refreshToken };
}

export const authService = {
  async register(input: RegisterInput): Promise<{ user: UserDTO; tokens: TokenPair }> {
    const existing = await authRepository.findUserByEmail(input.email);
    if (existing) throw new AppError("Email allaqachon band", 409, "EMAIL_TAKEN");
    const passwordHash = await hashPassword(input.password);
    const user = await authRepository.createUser({
      email: input.email, passwordHash, fullName: input.fullName, phone: input.phone,
    });
    const tokens = await issueTokens(user);
    return { user: toDTO(user), tokens };
  },

  async login(input: LoginInput): Promise<{ user: UserDTO; tokens: TokenPair }> {
    const user = await authRepository.findUserByEmail(input.email);
    if (!user) throw new AppError("Email yoki parol noto'g'ri", 401, "INVALID_CREDENTIALS");
    const ok = await verifyPassword(input.password, user.passwordHash);
    if (!ok) throw new AppError("Email yoki parol noto'g'ri", 401, "INVALID_CREDENTIALS");
    const tokens = await issueTokens(user);
    return { user: toDTO(user), tokens };
  },

  async refresh(refreshToken: string): Promise<TokenPair> {
    const stored = await authRepository.findRefreshToken(refreshToken);
    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      throw new AppError("Refresh token yaroqsiz", 401, "INVALID_REFRESH_TOKEN");
    }
    let payload: { sub: string };
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new AppError("Refresh token yaroqsiz", 401, "INVALID_REFRESH_TOKEN");
    }
    await authRepository.revokeRefreshToken(refreshToken); // rotation
    const user = await authRepository.findUserById(payload.sub);
    if (!user) throw new AppError("Foydalanuvchi topilmadi", 401, "USER_NOT_FOUND");
    return issueTokens(user);
  },

  async logout(refreshToken: string): Promise<void> {
    const stored = await authRepository.findRefreshToken(refreshToken);
    if (stored && !stored.revokedAt) {
      await authRepository.revokeRefreshToken(refreshToken);
    }
  },

  async me(userId: string): Promise<UserDTO> {
    const user = await authRepository.findUserById(userId);
    if (!user) throw new AppError("Foydalanuvchi topilmadi", 404, "USER_NOT_FOUND");
    return toDTO(user);
  },
};

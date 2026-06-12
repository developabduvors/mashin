import { prisma } from "../../lib/prisma";

export const authRepository = {
  findUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  findUserById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  createUser(data: { email: string; passwordHash: string; fullName: string; phone?: string }) {
    return prisma.user.create({ data });
  },

  storeRefreshToken(data: { token: string; userId: string; expiresAt: Date }) {
    return prisma.refreshToken.create({ data });
  },

  findRefreshToken(token: string) {
    return prisma.refreshToken.findUnique({ where: { token } });
  },

  revokeRefreshToken(token: string) {
    return prisma.refreshToken.update({
      where: { token },
      data: { revokedAt: new Date() },
    });
  },
};

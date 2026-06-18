# Backend Auth Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** ABC Auto backendning skeleti (Express + Prisma + TypeScript) va Auth domeni (register/login/refresh/logout/me, JWT + RBAC) qurish.

**Architecture:** Qatlamli — Route → Middleware → Controller → Service → Repository → Prisma → PostgreSQL. Controller DB'ga tegmaydi, Service `req`/`res` ni ko'rmaydi, Repository yagona Prisma joyi. Auth: JWT access (~15min) + refresh (~7d, DB'da hash, rotation).

**Tech Stack:** Node.js 24, Express 5, TypeScript, Prisma + PostgreSQL, zod, jsonwebtoken, bcrypt, helmet, cors, express-rate-limit; test: vitest + supertest; dev: tsx.

**Barcha yo'llar `backend/` ichida (working dir = `C:\Users\admin\Desktop\moshina\backend`).** Spec: `../docs/superpowers/specs/2026-06-12-abc-auto-backend-design.md`.

---

### Task 0: Loyiha skeleti (scaffold)

**Files:**
- Create: `backend/package.json`, `backend/tsconfig.json`, `backend/.gitignore`, `backend/.env.example`, `backend/vitest.config.ts`

- [ ] **Step 1: package.json yaratish**

`backend/package.json`:

```json
{
  "name": "abc-auto-backend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "vitest run",
    "test:watch": "vitest",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio"
  }
}
```

- [ ] **Step 2: Bog'liqliklarni o'rnatish**

Run:
```bash
npm install express helmet cors express-rate-limit jsonwebtoken bcrypt zod dotenv @prisma/client
npm install -D typescript tsx vitest supertest prisma @types/express @types/jsonwebtoken @types/bcrypt @types/cors @types/supertest @types/node
```
Expected: `node_modules/` paydo bo'ladi, xato yo'q.

- [ ] **Step 3: tsconfig.json yaratish**

`backend/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "outDir": "dist",
    "rootDir": "src",
    "types": ["node"]
  },
  "include": ["src", "tests"]
}
```

- [ ] **Step 4: .gitignore va .env.example**

`backend/.gitignore`:
```
node_modules/
dist/
.env
```

`backend/.env.example`:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/abc_auto?schema=public"
JWT_ACCESS_SECRET="change-me-access"
JWT_REFRESH_SECRET="change-me-refresh"
ACCESS_TOKEN_TTL="15m"
REFRESH_TOKEN_TTL_DAYS="7"
CORS_ORIGIN="http://localhost:3000"
PORT="4000"
NODE_ENV="development"
```

- [ ] **Step 5: vitest.config.ts**

`backend/vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts", "src/**/*.test.ts"],
  },
});
```

- [ ] **Step 6: Commit**

```bash
git add backend/package.json backend/package-lock.json backend/tsconfig.json backend/.gitignore backend/.env.example backend/vitest.config.ts
git commit -m "chore: backend skeleti — Express+Prisma+TS toolchain"
```

---

### Task 1: Env config (zod-validated)

**Files:**
- Create: `backend/src/config/env.ts`
- Test: `backend/tests/config/env.test.ts`

- [ ] **Step 1: Failing test yozish**

`backend/tests/config/env.test.ts`:
```ts
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
```

- [ ] **Step 2: Test fail bo'lishini tekshirish**

Run: `npm test -- env`
Expected: FAIL — `parseEnv` topilmaydi.

- [ ] **Step 3: Minimal implementatsiya**

`backend/src/config/env.ts`:
```ts
import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  DATABASE_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(1),
  JWT_REFRESH_SECRET: z.string().min(1),
  ACCESS_TOKEN_TTL: z.string().default("15m"),
  REFRESH_TOKEN_TTL_DAYS: z.coerce.number().int().positive().default(7),
  CORS_ORIGIN: z.string().url(),
  PORT: z.coerce.number().int().positive().default(4000),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

export type Env = z.infer<typeof schema>;

export function parseEnv(source: NodeJS.ProcessEnv | Record<string, unknown>): Env {
  return schema.parse(source);
}

export const env = parseEnv(process.env);
```

- [ ] **Step 4: Test pass bo'lishini tekshirish**

Run: `npm test -- env`
Expected: PASS (2 ta test).

- [ ] **Step 5: Commit**

```bash
git add backend/src/config/env.ts backend/tests/config/env.test.ts
git commit -m "feat(config): zod-validated env"
```

---

### Task 2: Prisma schema + migratsiya

**Files:**
- Create: `backend/prisma/schema.prisma`

- [ ] **Step 1: Prisma init**

Run: `npx prisma init --datasource-provider postgresql`
Expected: `prisma/schema.prisma` va `.env` yaratiladi. `.env` ichiga `.env.example`dagi qiymatlarni qo'ying (haqiqiy `DATABASE_URL` bilan).

- [ ] **Step 2: schema.prisma yozish**

`backend/prisma/schema.prisma`:
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  BUYER
  SELLER
  ADMIN
}

model User {
  id            String         @id @default(uuid())
  email         String         @unique
  passwordHash  String
  fullName      String
  phone         String?
  role          Role           @default(BUYER)
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  refreshTokens RefreshToken[]
}

model RefreshToken {
  id        String    @id @default(uuid())
  token     String    @unique
  userId    String
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt DateTime
  revokedAt DateTime?
  createdAt DateTime  @default(now())

  @@index([userId])
}
```

- [ ] **Step 3: Migratsiya yaratish va qo'llash**

Run: `npx prisma migrate dev --name init_auth`
Expected: `prisma/migrations/<ts>_init_auth/` yaratiladi, DB'da `User`, `RefreshToken`, `Role` paydo bo'ladi, Prisma Client generatsiya qilinadi.

- [ ] **Step 4: Commit**

```bash
git add backend/prisma/schema.prisma backend/prisma/migrations
git commit -m "feat(db): User va RefreshToken modellari + init migratsiya"
```

---

### Task 3: Prisma client singleton

**Files:**
- Create: `backend/src/lib/prisma.ts`

- [ ] **Step 1: Implementatsiya (test kerak emas — sodda singleton)**

`backend/src/lib/prisma.ts`:
```ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: xato yo'q.

- [ ] **Step 3: Commit**

```bash
git add backend/src/lib/prisma.ts
git commit -m "feat(lib): PrismaClient singleton"
```

---

### Task 4: Password lib (bcrypt) — TDD

**Files:**
- Create: `backend/src/lib/password.ts`
- Test: `backend/tests/lib/password.test.ts`

- [ ] **Step 1: Failing test**

`backend/tests/lib/password.test.ts`:
```ts
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
```

- [ ] **Step 2: Test fail**

Run: `npm test -- password`
Expected: FAIL — modul topilmaydi.

- [ ] **Step 3: Implementatsiya**

`backend/src/lib/password.ts`:
```ts
import bcrypt from "bcrypt";

const ROUNDS = 12;

export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, ROUNDS);
}

export function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
```

- [ ] **Step 4: Test pass**

Run: `npm test -- password`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add backend/src/lib/password.ts backend/tests/lib/password.test.ts
git commit -m "feat(lib): bcrypt password hash/verify"
```

---

### Task 5: JWT lib — TDD

**Files:**
- Create: `backend/src/lib/jwt.ts`
- Test: `backend/tests/lib/jwt.test.ts`

- [ ] **Step 1: Failing test**

`backend/tests/lib/jwt.test.ts`:
```ts
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
```

- [ ] **Step 2: Test fail**

Run: `npm test -- jwt`
Expected: FAIL — modul yo'q.

- [ ] **Step 3: Implementatsiya**

`backend/src/lib/jwt.ts`:
```ts
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface AccessPayload {
  sub: string;
  role: "BUYER" | "SELLER" | "ADMIN";
}
export interface RefreshPayload {
  sub: string;
}

export function signAccessToken(payload: AccessPayload): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: env.ACCESS_TOKEN_TTL });
}

export function verifyAccessToken(token: string): AccessPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessPayload;
}

export function signRefreshToken(payload: RefreshPayload): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: `${env.REFRESH_TOKEN_TTL_DAYS}d`,
  });
}

export function verifyRefreshToken(token: string): RefreshPayload {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshPayload;
}
```

- [ ] **Step 4: Test pass**

Run: `npm test -- jwt`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add backend/src/lib/jwt.ts backend/tests/lib/jwt.test.ts
git commit -m "feat(lib): JWT access/refresh sign+verify"
```

---

### Task 6: AppError + errorHandler

**Files:**
- Create: `backend/src/utils/AppError.ts`, `backend/src/middleware/errorHandler.ts`
- Test: `backend/tests/utils/AppError.test.ts`

- [ ] **Step 1: Failing test**

`backend/tests/utils/AppError.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { AppError } from "../../src/utils/AppError";

describe("AppError", () => {
  it("statusCode, code va message saqlaydi", () => {
    const err = new AppError("Topilmadi", 404, "NOT_FOUND");
    expect(err.statusCode).toBe(404);
    expect(err.code).toBe("NOT_FOUND");
    expect(err.message).toBe("Topilmadi");
    expect(err).toBeInstanceOf(Error);
  });
});
```

- [ ] **Step 2: Test fail**

Run: `npm test -- AppError`
Expected: FAIL.

- [ ] **Step 3: AppError implementatsiya**

`backend/src/utils/AppError.ts`:
```ts
export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly code: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}
```

- [ ] **Step 4: Test pass**

Run: `npm test -- AppError`
Expected: PASS.

- [ ] **Step 5: errorHandler middleware**

`backend/src/middleware/errorHandler.ts`:
```ts
import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: { message: err.message, code: err.code } });
    return;
  }
  if (err instanceof ZodError) {
    res.status(400).json({
      error: { message: "Validatsiya xatosi", code: "VALIDATION_ERROR", issues: err.issues },
    });
    return;
  }
  console.error(err);
  res.status(500).json({ error: { message: "Server xatosi", code: "INTERNAL" } });
}
```

- [ ] **Step 6: Commit**

```bash
git add backend/src/utils/AppError.ts backend/src/middleware/errorHandler.ts backend/tests/utils/AppError.test.ts
git commit -m "feat(core): AppError + markazlashgan errorHandler"
```

---

### Task 7: validate middleware

**Files:**
- Create: `backend/src/middleware/validate.ts`
- Test: `backend/tests/middleware/validate.test.ts`

- [ ] **Step 1: Failing test**

`backend/tests/middleware/validate.test.ts`:
```ts
import { describe, it, expect, vi } from "vitest";
import { z } from "zod";
import { validate } from "../../src/middleware/validate";

const schema = z.object({ body: z.object({ name: z.string() }) });

describe("validate", () => {
  it("valid bo'lsa next() ni chaqiradi", () => {
    const req: any = { body: { name: "Ali" }, query: {}, params: {} };
    const next = vi.fn();
    validate(schema)(req, {} as any, next);
    expect(next).toHaveBeenCalledWith();
  });

  it("invalid bo'lsa next(error) ni chaqiradi", () => {
    const req: any = { body: {}, query: {}, params: {} };
    const next = vi.fn();
    validate(schema)(req, {} as any, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
  });
});
```

- [ ] **Step 2: Test fail**

Run: `npm test -- validate`
Expected: FAIL.

- [ ] **Step 3: Implementatsiya**

`backend/src/middleware/validate.ts`:
```ts
import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

export function validate(schema: ZodType) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    if (!result.success) {
      next(result.error);
      return;
    }
    next();
  };
}
```

- [ ] **Step 4: Test pass**

Run: `npm test -- validate`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add backend/src/middleware/validate.ts backend/tests/middleware/validate.test.ts
git commit -m "feat(middleware): zod validate"
```

---

### Task 8: Auth schemas (zod) — TDD

**Files:**
- Create: `backend/src/modules/auth/auth.schemas.ts`
- Test: `backend/tests/modules/auth/auth.schemas.test.ts`

- [ ] **Step 1: Failing test**

`backend/tests/modules/auth/auth.schemas.test.ts`:
```ts
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
```

- [ ] **Step 2: Test fail**

Run: `npm test -- auth.schemas`
Expected: FAIL.

- [ ] **Step 3: Implementatsiya**

`backend/src/modules/auth/auth.schemas.ts`:
```ts
import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
    fullName: z.string().min(1),
    phone: z.string().optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),
});

export const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1),
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>["body"];
export type LoginInput = z.infer<typeof loginSchema>["body"];
```

- [ ] **Step 4: Test pass**

Run: `npm test -- auth.schemas`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add backend/src/modules/auth/auth.schemas.ts backend/tests/modules/auth/auth.schemas.test.ts
git commit -m "feat(auth): zod schemas (register/login/refresh)"
```

---

### Task 9: Auth repository

**Files:**
- Create: `backend/src/modules/auth/auth.types.ts`, `backend/src/modules/auth/auth.repository.ts`

- [ ] **Step 1: Types yozish**

`backend/src/modules/auth/auth.types.ts`:
```ts
export interface UserDTO {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  role: "BUYER" | "SELLER" | "ADMIN";
  createdAt: Date;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}
```

- [ ] **Step 2: Repository implementatsiya**

`backend/src/modules/auth/auth.repository.ts`:
```ts
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
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: xato yo'q.

- [ ] **Step 4: Commit**

```bash
git add backend/src/modules/auth/auth.types.ts backend/src/modules/auth/auth.repository.ts
git commit -m "feat(auth): repository + DTO types"
```

---

### Task 10: Auth service — TDD (mock repository)

**Files:**
- Create: `backend/src/modules/auth/auth.service.ts`
- Test: `backend/tests/modules/auth/auth.service.test.ts`

> Service repository, jwt, password modullarini import qiladi. Testda ularni `vi.mock` bilan mock qilamiz, shunda DB kerak emas.

- [ ] **Step 1: Failing test**

`backend/tests/modules/auth/auth.service.test.ts`:
```ts
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
```

- [ ] **Step 2: Test fail**

Run: `npm test -- auth.service`
Expected: FAIL — service yo'q.

- [ ] **Step 3: Implementatsiya**

`backend/src/modules/auth/auth.service.ts`:
```ts
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
```

- [ ] **Step 4: Test pass**

Run: `npm test -- auth.service`
Expected: PASS (barcha holatlar).

- [ ] **Step 5: Commit**

```bash
git add backend/src/modules/auth/auth.service.ts backend/tests/modules/auth/auth.service.test.ts
git commit -m "feat(auth): service — register/login/refresh/logout/me"
```

---

### Task 11: authenticate + authorize middleware — TDD

**Files:**
- Create: `backend/src/middleware/authenticate.ts`, `backend/src/middleware/authorize.ts`, `backend/src/types/express.d.ts`
- Test: `backend/tests/middleware/auth.middleware.test.ts`

- [ ] **Step 1: Express tip kengaytmasi**

`backend/src/types/express.d.ts`:
```ts
import "express";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: "BUYER" | "SELLER" | "ADMIN" };
    }
  }
}
```

- [ ] **Step 2: Failing test**

`backend/tests/middleware/auth.middleware.test.ts`:
```ts
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
```

- [ ] **Step 3: Test fail**

Run: `npm test -- auth.middleware`
Expected: FAIL.

- [ ] **Step 4: authenticate implementatsiya**

`backend/src/middleware/authenticate.ts`:
```ts
import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../lib/jwt";
import { AppError } from "../utils/AppError";

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    next(new AppError("Avtorizatsiya kerak", 401, "UNAUTHORIZED"));
    return;
  }
  try {
    const payload = verifyAccessToken(header.slice(7));
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    next(new AppError("Token yaroqsiz", 401, "INVALID_TOKEN"));
  }
}
```

- [ ] **Step 5: authorize implementatsiya**

`backend/src/middleware/authorize.ts`:
```ts
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

type Role = "BUYER" | "SELLER" | "ADMIN";

export function authorize(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError("Avtorizatsiya kerak", 401, "UNAUTHORIZED"));
      return;
    }
    if (!roles.includes(req.user.role)) {
      next(new AppError("Ruxsat yo'q", 403, "FORBIDDEN"));
      return;
    }
    next();
  };
}
```

- [ ] **Step 6: Test pass**

Run: `npm test -- auth.middleware`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add backend/src/middleware/authenticate.ts backend/src/middleware/authorize.ts backend/src/types/express.d.ts backend/tests/middleware/auth.middleware.test.ts
git commit -m "feat(middleware): authenticate (JWT) + authorize (RBAC)"
```

---

### Task 12: Auth controller

**Files:**
- Create: `backend/src/modules/auth/auth.controller.ts`

- [ ] **Step 1: Implementatsiya**

`backend/src/modules/auth/auth.controller.ts`:
```ts
import { Request, Response, NextFunction } from "express";
import { authService } from "./auth.service";

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body);
      res.status(201).json(result);
    } catch (e) { next(e); }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);
      res.status(200).json(result);
    } catch (e) { next(e); }
  },

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const tokens = await authService.refresh(req.body.refreshToken);
      res.status(200).json({ tokens });
    } catch (e) { next(e); }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.logout(req.body.refreshToken);
      res.status(204).end();
    } catch (e) { next(e); }
  },

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.me(req.user!.id);
      res.status(200).json({ user });
    } catch (e) { next(e); }
  },
};
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: xato yo'q.

- [ ] **Step 3: Commit**

```bash
git add backend/src/modules/auth/auth.controller.ts
git commit -m "feat(auth): controller"
```

---

### Task 13: Routes + app + server (wiring)

**Files:**
- Create: `backend/src/modules/auth/auth.routes.ts`, `backend/src/app.ts`, `backend/src/server.ts`

- [ ] **Step 1: auth.routes.ts**

`backend/src/modules/auth/auth.routes.ts`:
```ts
import { Router } from "express";
import { authController } from "./auth.controller";
import { authenticate } from "../../middleware/authenticate";
import { validate } from "../../middleware/validate";
import { registerSchema, loginSchema, refreshSchema } from "./auth.schemas";

export const authRouter = Router();

authRouter.post("/register", validate(registerSchema), authController.register);
authRouter.post("/login", validate(loginSchema), authController.login);
authRouter.post("/refresh", validate(refreshSchema), authController.refresh);
authRouter.post("/logout", validate(refreshSchema), authController.logout);
authRouter.get("/me", authenticate, authController.me);
```

- [ ] **Step 2: app.ts**

`backend/src/app.ts`:
```ts
import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { env } from "./config/env";
import { authRouter } from "./modules/auth/auth.routes";
import { errorHandler } from "./middleware/errorHandler";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(express.json());

  const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 50 });
  app.use("/api/auth", authLimiter, authRouter);

  app.get("/health", (_req, res) => res.json({ ok: true }));

  app.use(errorHandler);
  return app;
}
```

- [ ] **Step 3: server.ts**

`backend/src/server.ts`:
```ts
import { createApp } from "./app";
import { env } from "./config/env";

const app = createApp();
app.listen(env.PORT, () => {
  console.log(`ABC Auto API → http://localhost:${env.PORT}`);
});
```

- [ ] **Step 4: Type-check + dev server smoke test**

Run: `npx tsc --noEmit`
Expected: xato yo'q.

Run: `npm run dev` (keyin alohida terminalda `curl http://localhost:4000/health`)
Expected: `{"ok":true}`. So'ngra dev serverni to'xtating.

- [ ] **Step 5: Commit**

```bash
git add backend/src/modules/auth/auth.routes.ts backend/src/app.ts backend/src/server.ts
git commit -m "feat(auth): routes + express app + server entrypoint"
```

---

### Task 14: Integration test (supertest, to'liq flow)

**Files:**
- Create: `backend/tests/integration/auth.flow.test.ts`

> **Supabase eslatmasi:** bepul tarifda bitta `postgres` DB bor, shuning uchun alohida test DB yaratilmaydi. Test bir xil `backend/.env` (Supabase) ulanishini ishlatadi. Izolyatsiya: har run **unik email** yaratadi va `afterAll` o'sha userni o'chiradi (RefreshToken `onDelete: Cascade` orqali avtomatik o'chadi). Task 2 migratsiyasi allaqachon schema'ni yaratgan, shuning uchun qo'shimcha migratsiya kerak emas.

- [ ] **Step 1: Failing integration test**

`backend/tests/integration/auth.flow.test.ts`:
```ts
import { describe, it, expect, afterAll } from "vitest";
import request from "supertest";
import { createApp } from "../../src/app";
import { prisma } from "../../src/lib/prisma";

const app = createApp();
const cred = { email: `t${Date.now()}@b.com`, password: "secret12", fullName: "Test" };

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: cred.email } });
  await prisma.$disconnect();
});

describe("auth flow", () => {
  let refreshToken = "";

  it("register → 201 + tokenlar", async () => {
    const res = await request(app).post("/api/auth/register").send(cred);
    expect(res.status).toBe(201);
    expect(res.body.tokens.accessToken).toBeTruthy();
    expect(res.body.user.passwordHash).toBeUndefined();
    refreshToken = res.body.tokens.refreshToken;
  });

  it("login → 200", async () => {
    const res = await request(app).post("/api/auth/login")
      .send({ email: cred.email, password: cred.password });
    expect(res.status).toBe(200);
  });

  it("noto'g'ri parol → 401", async () => {
    const res = await request(app).post("/api/auth/login")
      .send({ email: cred.email, password: "wrong" });
    expect(res.status).toBe(401);
  });

  it("refresh → 200 + yangi token (rotation)", async () => {
    const res = await request(app).post("/api/auth/refresh").send({ refreshToken });
    expect(res.status).toBe(200);
    expect(res.body.tokens.refreshToken).not.toBe(refreshToken);
  });

  it("eski refresh token (rotated) → 401", async () => {
    const res = await request(app).post("/api/auth/refresh").send({ refreshToken });
    expect(res.status).toBe(401);
  });

  it("me — token bilan → 200, tokensiz → 401", async () => {
    const login = await request(app).post("/api/auth/login")
      .send({ email: cred.email, password: cred.password });
    const access = login.body.tokens.accessToken;
    const ok = await request(app).get("/api/auth/me").set("Authorization", `Bearer ${access}`);
    expect(ok.status).toBe(200);
    expect(ok.body.user.email).toBe(cred.email);
    const no = await request(app).get("/api/auth/me");
    expect(no.status).toBe(401);
  });
});
```

- [ ] **Step 2: Test ishga tushirish**

Run: `npm test -- auth.flow`
Expected: PASS (barcha 6 holat). Agar DB ulanmasa, `backend/.env` dagi `DATABASE_URL` ni tekshiring (Supabase parol/host).

- [ ] **Step 3: Commit**

```bash
git add backend/tests/integration/auth.flow.test.ts
git commit -m "test(auth): integration flow (register/login/refresh/me)"
```

> **Eslatma:** `.env` hech qachon commit qilinmaydi (`.gitignore` da). Integration test maxfiy emas — faqat real DB ulanishini ishlatadi.

---

### Task 15: To'liq tekshiruv

- [ ] **Step 1: Barcha testlar**

Run: `npm test`
Expected: barcha test fayllar PASS.

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: 0 xato.

- [ ] **Step 3: README qisqacha (ixtiyoriy, lekin tavsiya)**

`backend/README.md` yaratib, o'rnatish (`npm install`, `.env` to'ldirish, `npx prisma migrate dev`, `npm run dev`) va endpoint ro'yxatini yozing.

```bash
git add backend/README.md
git commit -m "docs: backend README — setup + endpointlar"
```

---

## Self-Review natijasi

**Spec coverage:**
- §2 qatlamli arxitektura → Task 9–13 (repository/service/controller/routes). ✅
- §3 papka strukturasi → barcha tasklar shu yo'llarni ishlatadi. ✅
- §4.2 data modeli (User, RefreshToken, Role) → Task 2. ✅
- §4.3 komponentlar jadvali → env (T1), prisma (T3), jwt (T5), password (T4), authenticate/authorize (T11), validate (T7), errorHandler (T6), schemas (T8), repository (T9), service (T10), controller (T12). ✅
- §4.4 endpointlar/flow → Task 13 routes + T10 service. ✅
- §4.5 xavfsizlik (helmet/cors/rate-limit/bcrypt/rotation) → T13 (helmet/cors/rate-limit), T4 (bcrypt 12), T10 (rotation). ✅
- §4.6 xato handling → T6. ✅
- §4.7 test (service/schemas/integration) → T10, T8, T14. ✅

**Placeholder scan:** TBD/TODO yo'q; har step to'liq kod yoki aniq komanda. ✅

**Type consistency:** `UserDTO`/`TokenPair` (T9) → service (T10) → controller (T12) izchil. `Role` literal `"BUYER"|"SELLER"|"ADMIN"` hamma joyda bir xil. `authRepository` metod nomlari T9 va T10 mock'da mos. `signAccessToken({sub, role})` T5 ta'rifi T10/T11 ishlatishiga mos. ✅

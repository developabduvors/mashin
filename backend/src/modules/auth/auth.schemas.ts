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

// Profil tahrirlash — email o'zgartirilmaydi (login identifikatori).
export const updateMeSchema = z.object({
  body: z.object({
    fullName: z.string().trim().min(1).optional(),
    phone: z.string().trim().min(1).nullable().optional(),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8),
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>["body"];
export type LoginInput = z.infer<typeof loginSchema>["body"];
export type UpdateMeInput = z.infer<typeof updateMeSchema>["body"];
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>["body"];

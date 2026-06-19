import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { hashPassword } from "../src/lib/password";

// .env'dan admin ma'lumotlari — sir kodda saqlanmaydi.
const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
const fullName = process.env.ADMIN_NAME ?? "Administrator";

async function main() {
  if (!email || !password) {
    throw new Error(
      ".env'da ADMIN_EMAIL va ADMIN_PASSWORD bo'lishi shart (qarang .env.example).",
    );
  }
  if (password.length < 8) {
    throw new Error("ADMIN_PASSWORD kamida 8 belgidan iborat bo'lsin.");
  }

  const passwordHash = await hashPassword(password);

  // Idempotent: mavjud bo'lsa ADMIN rolini va parolni yangilaydi, bo'lmasa yaratadi.
  const user = await prisma.user.upsert({
    where: { email },
    update: { role: "ADMIN", passwordHash, fullName },
    create: { email, passwordHash, fullName, role: "ADMIN" },
  });

  console.log(`✓ ADMIN tayyor: ${user.email} (id: ${user.id})`);
}

main()
  .catch((e) => {
    console.error("✗ Admin seed xatosi:", e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

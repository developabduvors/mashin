import type { Metadata } from "next";
import { Oswald, Manrope } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";

// Birinchi bo'yoqdan oldin .dark klassini qo'yadi — theme "miltillashi"ni oldini oladi.
const NO_FLASH = `try{if(localStorage.getItem('abc_theme')==='dark')document.documentElement.classList.add('dark')}catch(e){}`;

// Display: kondenslangan, industrial/sport — avtomobil estetikasi (Cyrillic ✓)
const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

// Body: zamonaviy geometrik, toza (Cyrillic ✓)
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "700", "800"],
});

export const metadata: Metadata = {
  title: "ABC AUTO — Сеть автосалонов в Москве",
  description: "Официальный дилер ABC Auto. Продажа новых автомобилей и авто с пробегом.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${oswald.variable} ${manrope.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH }} />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <AuthProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

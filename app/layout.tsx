import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: "Gestão de Risco — Opções Binárias",
  description: "Aplicativo de gerenciamento de risco e evolução de entradas para opções binárias.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.variable} ${jetbrains.variable} font-sans bg-base-950 text-base-200 min-h-screen`}>
        {children}
      </body>
    </html>
  );
}

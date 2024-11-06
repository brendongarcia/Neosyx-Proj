
"use client";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Nav from "../components/Nav";
import { UserProvider } from "@/context/UserContext";
import { usePathname } from "next/navigation";

// Configurando fontes personalizadas
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentPath = usePathname();

  return (
    <AuthProvider>
      <UserProvider>
        <html lang="en" className={`${geistSans.variable} font-sans`}>
          <body className="w-full h-screen bg-gray-900 text-white">
            <div className="flex w-full h-full">
              {/* Barra de navegação, exceto nas páginas de login e registro */}
              {currentPath !== "/login" && currentPath !== "/register" && (
                <Nav className="w-64 h-full bg-gray-850 border-r border-gray-700 p-4 shadow-lg" />
              )}

              {/* Conteúdo principal */}
              <div
                className={`flex-1 h-full p-6 overflow-y-auto bg-gradient-to-br from-gray-full via-gray-full to-gray-full rounded-l-lg transition-all duration-300`}
              >
                <div
                  className={`${
                    currentPath === "/login" || currentPath === "/register"
                      ? "flex items-center justify-center w-full h-full"  // Mudança para ocupar toda a tela
                      : "flex flex-col h-full space-y-4"
                  }`}
                >
                  {currentPath === "/login" || currentPath === "/register" ? (
                    <div className="w-full h-full bg-gray-800 p-6 rounded-lg shadow-md">
                      {children}
                    </div>
                  ) : (
                    children
                  )}
                </div>
              </div>
            </div>
          </body>
        </html>
      </UserProvider>
    </AuthProvider>
  );
}



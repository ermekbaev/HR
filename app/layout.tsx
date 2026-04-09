import type { Metadata } from "next";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { ToastProvider } from "@/context/ToastContext";

export const metadata: Metadata = {
  title: "HR-Автопилот",
  description: "Система управления адаптацией сотрудников",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full">
      <head>
        <link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col">
        <AppContextProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AppContextProvider>
      </body>
    </html>
  );
}

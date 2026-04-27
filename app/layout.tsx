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
        <div className="fixed bottom-4 right-4 z-50 bg-yellow-400 text-yellow-900 text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg border border-yellow-500 select-none pointer-events-none">
          Демо-версия прототипа
        </div>
        <AppContextProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AppContextProvider>
      </body>
    </html>
  );
}

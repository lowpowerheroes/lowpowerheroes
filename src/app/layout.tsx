import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/component/Header/Header";

export const metadata: Metadata = {
  title: {
    default: "Low Power Heroes",
    template: "%s | LPH",
  },
  description: "Low power heroes is a page for low power drift car enthusiast",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="p-5 flex flex-col h-screen">
          <Header />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

import "./globals.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import { type Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: {
    default: "Low Power Heroes",
    template: "%s | LPH",
  },
  description: "Low power heroes is a page for low power drift car enthusiast",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="dark:bg-slate-800">
        <ClerkProvider>
          <TRPCReactProvider>
            <Theme>{children}</Theme>
          </TRPCReactProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}

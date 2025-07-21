import "./globals.css";
import "@radix-ui/themes/styles.css";
import { type Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Theme } from "@radix-ui/themes";
import { TRPCReactProvider } from "~/trpc/react";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "~/components/ui/header";

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
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className="antialiased">
          <TRPCReactProvider>
            <Theme>
              <ThemeProvider
                attribute={"class"}
                enableSystem
                defaultTheme="system"
              >
                <Header />
                <div className="flex w-full flex-row flex-wrap justify-between px-4 py-5 sm:px-8 md:justify-between md:px-16 lg:px-32 xl:px-60">
                  {children}
                </div>
              </ThemeProvider>
            </Theme>
          </TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

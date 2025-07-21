"use client";

import ReduxProvider from "~/providers/Redux";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <ReduxProvider>{children}</ReduxProvider>;
}

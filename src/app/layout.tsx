import type { Metadata } from 'next'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'

export const metadata: Metadata = {
    title: {
        default: 'Low Power Heroes',
        template: '%s | LPH',
    },
    description:
        'Low power heroes is a page for low power drift car enthusiast',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className="flex flex-col h-screen">{children}</body>
            </html>
        </ClerkProvider>
    )
}

import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Flex, Theme } from '@radix-ui/themes'
import Header from '@/components/Header/Header'

import './globals.css'
import '@radix-ui/themes/styles.css'

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
                <body>
                    <Theme accentColor="gray" appearance="dark">
                        <Flex direction={'column'} height={'100vh'}>
                            <Header />
                            {children}
                        </Flex>
                    </Theme>
                </body>
            </html>
        </ClerkProvider>
    )
}

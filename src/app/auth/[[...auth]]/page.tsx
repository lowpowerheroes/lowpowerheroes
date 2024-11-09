import { SignIn } from '@clerk/nextjs'

export default function auth() {
    return <SignIn fallbackRedirectUrl={'/'} />
}

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-1 box-border items-center justify-center width-full">
            {children}
        </div>
    )
}

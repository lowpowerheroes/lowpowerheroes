export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-100 flex min-h-screen flex-col items-center justify-center py-2">
      {children}
    </div>
  );
}

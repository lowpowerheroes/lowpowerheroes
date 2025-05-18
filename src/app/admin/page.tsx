import { SignOutButton } from "@clerk/nextjs";
export default function AdminDashboard() {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <SignOutButton />
    </div>
  );
}

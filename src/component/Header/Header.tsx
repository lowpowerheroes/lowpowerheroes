import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const Header = () => {
  return (
    <div className="flex items-center justify-between h-16">
      <h1 className="text-3xl font-bold">Low Power Heroes</h1>

      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
};

export default Header;

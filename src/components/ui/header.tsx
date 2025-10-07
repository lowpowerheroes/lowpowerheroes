"use client";

import { useState } from "react";
import Link from "next/link";
import ThemeToggle from "./theme-toggle";
import Search from "~/components/ui/search";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { FaBars } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { SignOutButton, useUser, UserButton } from "@clerk/nextjs";

const Header = () => {
  const { isLoaded, isSignedIn } = useUser();
  const [hamburgerOpen, setHamburgerOpen] = useState(false);

  return (
    <div className="sticky top-0 z-50 flex w-full flex-col items-center bg-background bg-opacity-100">
      <header className="flex w-full flex-row flex-wrap justify-between px-4 py-5 sm:px-8 md:justify-between md:px-16 lg:px-32 xl:px-60">
        <div className="h-10">
          <Button variant={"link"} asChild>
            <Link
              href={process.env.NEXT_PUBLIC_BASE_URL ?? ""}
              className="w-full"
            >
              LowPowerHeroes
            </Link>
          </Button>
        </div>
        <div className="hidden h-10 items-center justify-center space-x-2 md:flex">
          <Button variant={"outline"} asChild className="h-12">
            <Link
              href={`${
                isLoaded && isSignedIn
                  ? "/admin/create"
                  : "mailto:lowwpowerheroes@gmail.com?subject=Upload%20your%20build"
              }`}
              className="w-full"
            >
              {`${isLoaded && isSignedIn ? "Create a new build" : "Upload your build!"} `}
            </Link>
          </Button>
          <Search placeholder="Search builds..." />
          <ThemeToggle />
          {isLoaded && isSignedIn && (
            <div className="hidden md:flex">
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "h-10 w-10",
                    userButtonAvatarImage: "h-10 w-10",
                  },
                }}
              />
            </div>
          )}
        </div>
        <div className="flex items-center md:hidden">
          <Button
            variant={"outline"}
            onClick={() => setHamburgerOpen(!hamburgerOpen)}
          >
            <FaBars
              className={`absolute h-10 w-10 transition-all ${
                hamburgerOpen ? "rotate-90 scale-0" : "rotate-0 scale-100"
              }`}
            />
            <FaXmark
              className={`absolute h-10 w-10 transition-all ${
                hamburgerOpen ? "rotate-0 scale-100" : "rotate-90 scale-0"
              }`}
            />
          </Button>
        </div>
        {hamburgerOpen && (
          <div className="mt-5 flex w-full flex-wrap items-center px-4 md:hidden">
            <Button variant={"outline"} asChild className="mb-5 w-full">
              <Link
                href={`${
                  isLoaded && isSignedIn
                    ? "/admin/create"
                    : "mailto:lowwpowerheroes@gmail.com?subject=Upload%20your%20build"
                }`}
                className="w-full"
              >
                {`${isLoaded && isSignedIn ? "Create a new build" : "Upload your build!"} `}
              </Link>
            </Button>
            <div className="flex w-full flex-row items-center justify-between space-x-2">
              <Search placeholder="Search builds..." />
              <ThemeToggle />
            </div>
            <SignOutButton>
              <Button variant={"outline"} className="mt-5 w-full">
                Sign out
              </Button>
            </SignOutButton>
          </div>
        )}
      </header>
      <Separator />
    </div>
  );
};

export default Header;

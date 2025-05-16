"use client";

import { useState } from "react";
import Link from "next/link";
import ThemeToggle from "./theme-toggle";
import Search from "~/components/ui/search";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { FaBars } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";

const Header = () => {
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const [search, setSearch] = useState<string>("");
  return (
    <div className="bg-white dark:bg-black flex w-full flex-col items-center">
      <header className="flex w-full flex-row flex-wrap justify-between px-4 py-5 align-middle sm:px-8 md:justify-between md:px-16 lg:px-32 xl:px-60">
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
              href={
                "mailto:lowwpowerheroes@gmail.com?subject=Upload%20your%20build"
              }
              className="w-full"
            >
              Upload your build!
            </Link>
          </Button>
          <Search
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search builds..."
          />
          <ThemeToggle />
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
                href={
                  "mailto:lowwpowerheroes@gmail.com?subject=Upload%20your%20build"
                }
                className="w-full"
              >
                Upload your build!
              </Link>
            </Button>
            <div className="flex w-full flex-row items-center justify-between space-x-2">
              <Search
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search builds..."
              />
              <ThemeToggle />
            </div>
          </div>
        )}
      </header>
      <Separator />
    </div>
  );
};

export default Header;

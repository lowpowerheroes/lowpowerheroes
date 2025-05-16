import Link from "next/link";
import ThemeToggle from "./theme-toggle";
import Search from "~/components/ui/search";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";

const Header = () => {
  return (
    <div className="bg-white dark:bg-black flex w-full flex-col items-center">
      <header className="flex w-full justify-between px-60 py-5 align-middle">
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
        <div className="flex h-10 items-center justify-center space-x-2">
          <Button variant={"link"} asChild>
            <Link
              href={
                "mailto:lowwpowerheroes@gmail.com?subject=Upload%20your%20build"
              }
              className="w-full"
            >
              Upload your build!
            </Link>
          </Button>
          <Search />
          <ThemeToggle />
        </div>
      </header>
      <Separator />
    </div>
  );
};

export default Header;

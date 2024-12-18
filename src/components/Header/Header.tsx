"use client";

import { Flex, Heading, TextField, Button, Box } from "@radix-ui/themes";
import { FaSearch } from "react-icons/fa";
import "./style.css";
import Link from "next/link";
import useMenu from "~/app/hooks/useMenu";

const Header = () => {
  const { menuOpen, toggleMenu } = useMenu();

  const handleSearch = () => {
    console.log("searching...");
  };

  return (
    <header className="relative flex w-full flex-wrap justify-between border-b-2 border-secondary p-5 align-middle">
      <Box className="flex-1">
        <Heading asChild>
          <Link href={"/"}>Low Power Heroes</Link>
        </Heading>
      </Box>

      <Flex
        align={"center"}
        justify={"between"}
        gap={"3"}
        className="desktop-only"
      >
        <TextField.Root
          placeholder="Search builds..."
          size="3"
          radius="full"
          onChange={handleSearch}
        >
          <TextField.Slot>
            <FaSearch />
          </TextField.Slot>
        </TextField.Root>
        <Button variant="soft" size={"3"} radius="full" asChild>
          <a
            href="mailto:lowwpowerheroes@gmail.com?subject=Upload%20your%20build"
            target="_blank"
          >
            Upload your build!
          </a>
        </Button>
      </Flex>

      <Button
        variant="soft"
        className="mobile-only"
        style={{ cursor: "pointer" }}
        onClick={toggleMenu}
      >
        {menuOpen ? "⨯" : "☰"}
      </Button>
      <Box className="w-full pt-3" display={menuOpen ? "block" : "none"}>
        <Flex className="flex-wrap gap-3">
          <TextField.Root
            placeholder="Search builds..."
            size="3"
            radius="full"
            className="w-full"
            onChange={handleSearch}
          >
            <TextField.Slot>
              <FaSearch />
            </TextField.Slot>
          </TextField.Root>

          <Button variant="soft" size="3" radius="full" asChild>
            <Link
              style={{ width: "100%" }}
              href="mailto:lowwpowerheroes@gmail.com?subject=Upload%20your%20build"
              target="_blank"
            >
              Upload your build!
            </Link>
          </Button>
        </Flex>
      </Box>
    </header>
  );
};

export default Header;

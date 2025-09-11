import { type FC } from "react";

import { Input } from "~/components/ui/input";
import useDebouncedSearch from "~/hooks/useDebouncedSearch";

import { useRouter } from "next/navigation";

const Search: FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => {
  const router = useRouter();
  const { value: search, setValue: setSearch } = useDebouncedSearch("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search === "") router.push("/");
    if (search.trim()) {
      router.push(`/search?q=${encodeURIComponent(search)}`);
    }
  };

  return (
    <form
      onSubmit={handleSearchSubmit}
      className="border-gray-300 bg-gray-50 dark:bg-gray-900 flex w-full max-w-sm items-center space-x-2 rounded-lg border bg-secondary px-3.5 py-2"
    >
      <SearchIcon className="h-4 w-4" />
      <Input
        type="search"
        className="h-8 w-full border-0 bg-secondary font-semibold shadow-none"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        {...props}
      />
    </form>
  );
};

function SearchIcon(props: JSX.IntrinsicElements["svg"]) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export default Search;

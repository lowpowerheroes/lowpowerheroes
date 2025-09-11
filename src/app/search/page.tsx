"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import BuildCard from "~/components/build/BuildCard";
import { Button } from "~/components/ui/button";
import { keepPreviousData } from "@tanstack/react-query";

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const page = Number(searchParams.get("page") ?? "1");
  const limit = 24;

  const { data, isLoading, isError } = api.build.searchByName.useQuery(
    { query, page, limit },
    {
      enabled: query.length > 0,
      placeholderData: keepPreviousData,
    },
  );

  const builds = data?.builds ?? [];
  const totalCount = data?.totalCount ?? 0;
  const totalPages = Math.ceil(totalCount / limit);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(newPage));
    router.push(`/search?${params.toString()}`);
  };

  return (
    <main className="flex w-full flex-col items-center p-4">
      <h1 className="mb-6 text-3xl font-bold">
        Search Results for:{" "}
        <span className="text-primary">&quot;{query}&quot;</span>
      </h1>

      {isLoading && builds.length === 0 && <p>Loading results...</p>}
      {isError && <p>An error occurred while searching.</p>}

      {builds.length > 0 && (
        <>
          <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {builds.map((b) => (
              <BuildCard
                key={b.build_id}
                build_id={b.build_id}
                build_name={b.build_name}
                build_images={b.images}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <Button
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
              >
                Previous
              </Button>
              <span className="font-semibold">
                Page {page} of {totalPages}
              </span>
              <Button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {!isLoading && builds.length === 0 && query.length > 0 && (
        <p>No builds found for your search.</p>
      )}
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<p>Loading search...</p>}>
      <SearchContent />
    </Suspense>
  );
}

"use client";

import { api } from "~/trpc/react";
import Build from "~/components/Build/build";
import { useEffect, useRef } from "react";
import type { inferProcedureOutput } from "@trpc/server";
import type { AppRouter } from "~/server/api/root";

type InitialData = inferProcedureOutput<AppRouter["build"]["getInfinite"]>;

type BuildListProps = {
  initialBuilds: InitialData;
};

export function BuildList({ initialBuilds }: BuildListProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    api.build.getInfinite.useInfiniteQuery(
      {},
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        initialData: { pages: [initialBuilds], pageParams: [undefined] },
      },
    );

  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { rootMargin: "0px 0px 400px 0px" },
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [loadMoreRef, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allBuilds = data.pages.flatMap((page) => page.items);

  return (
    <>
      <div className="flex w-full flex-wrap justify-center gap-4">
        {allBuilds.map((b) => (
          <Build key={b.build_id} {...b} />
        ))}
      </div>

      <div ref={loadMoreRef} />

      {isFetchingNextPage && (
        <div className="mt-8 flex w-full justify-center">
          <p>Loading more...</p>
        </div>
      )}
    </>
  );
}

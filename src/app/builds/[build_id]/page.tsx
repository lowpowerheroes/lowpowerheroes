"use client";

import { api } from "~/trpc/react";
import Build from "~/components/Build/build";
import { use } from "react";
import { Button } from "~/components/ui/button";
import { Spinner } from "@radix-ui/themes";
import type { Build as BuildProperties } from "~/app/types/createbuild";

export default function BuildPage({
  params,
}: {
  params: Promise<{ build_id: string }>;
}) {
  const { build_id } = use(params);

  const {
    data: build,
    isLoading,
    isError,
    error,
    refetch,
  } = api.build.getById.useQuery({ id: build_id });

  if (isLoading) {
    return (
      <main className="flex h-[90vh] w-full flex-col items-center justify-center p-4">
        <Spinner size={"3"} />
      </main>
    );
  }

  if (isError) {
    if (error.data?.code === "NOT_FOUND") {
      return (
        <main className="flex h-full w-full flex-col items-center justify-center p-4 text-center">
          <h1 className="text-2xl font-bold">Build not found</h1>
          <p className="text-muted-foreground">
            {
              "The build you're searching for doesn't exist or has been removed."
            }
          </p>
        </main>
      );
    }
    return (
      <main className="flex h-[90vh] w-full flex-col items-center justify-center gap-4 p-4 text-center">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="text-muted-foreground">
          The build could not be loaded. Please try again later.
        </p>
        <Button onClick={() => refetch()}>Try again</Button>
      </main>
    );
  }

  return (
    <main className="flex w-full flex-col items-center p-4">
      <Build {...(build as BuildProperties)} />
    </main>
  );
}

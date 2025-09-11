"use client";

import { api } from "~/trpc/react";
import Build from "~/components/build/build";

export default function BuildPage({
  params,
}: {
  params: { build_id: string };
}) {
  const buildId = params.build_id;

  const {
    data: build,
    isLoading,
    isError,
  } = api.build.getById.useQuery({ id: buildId });

  if (isLoading) {
    return <p>Loading build...</p>;
  }

  if (isError || !build) {
    return <p>Build not found or an error occurred.</p>;
  }

  return (
    <main className="flex w-full flex-col items-center p-4">
      <Build {...build} />
    </main>
  );
}

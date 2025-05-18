import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  await api.build.getLatest.prefetch();

  return (
    <HydrateClient>
      <main className="bg-white dark:bg-black text-black dark:text-white flex transition-all duration-300"></main>
    </HydrateClient>
  );
}

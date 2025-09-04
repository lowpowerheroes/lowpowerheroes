import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  const build = await api.build.getLatest.call({});

  console.log(build);

  return (
    <HydrateClient>
      <main className="bg-white dark:bg-black text-black dark:text-white flex transition-all duration-300"></main>
    </HydrateClient>
  );
}

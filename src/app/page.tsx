import Build from "~/components/build/build";
import { HydrateClient, api } from "~/trpc/server";

export default async function Home() {
  const build = await api.build.getLatest.call({});

  return (
    <HydrateClient>
      <main className="bg-white dark:bg-black text-black dark:text-white flex w-full transition-all duration-300">
        {build.map((b) => (
          <Build key={b.build_id} {...b} />
        ))}
      </main>
    </HydrateClient>
  );
}

import { BuildList } from "~/components/Build/BuildList";
import { api } from "~/trpc/server";

export default async function Home() {
  const initialBuilds = await api.build.getInfinite.call(
    {},
    { limit: 24, cursor: undefined },
  );

  return (
    <main className="bg-white dark:bg-black text-black dark:text-white flex w-full flex-col items-center p-4 transition-all duration-300">
      <BuildList initialBuilds={initialBuilds} />
    </main>
  );
}

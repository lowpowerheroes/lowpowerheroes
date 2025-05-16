import Header from "~/components/ui/header";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  void api.build.getLatest.prefetch();

  return (
    <HydrateClient>
      <main className="bg-white dark:bg-black text-black dark:text-white flex min-h-screen transition-all duration-300">
        <Header />
      </main>
    </HydrateClient>
  );
}

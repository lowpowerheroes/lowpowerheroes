import Header from "~/components/Header/Header";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  void api.build.getLatest.prefetch();

  return (
    <HydrateClient>
      <main>
        <Header />
      </main>
    </HydrateClient>
  );
}

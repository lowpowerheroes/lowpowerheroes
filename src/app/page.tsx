import Build from "~/components/build/build";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  const build = await api.build.getLatest.call({});

  console.log(build);

  return (
    <HydrateClient>
      <main className="bg-white dark:bg-black text-black dark:text-white flex w-full transition-all duration-300">
        {build.map((b) => (
          <Build
            key={b.build_id}
            {...b}
            build_images={b.images.map((v) => v.image_url)}
          />
        ))}
      </main>
    </HydrateClient>
  );
}

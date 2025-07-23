"use client";
import { Separator } from "@radix-ui/react-separator";
import { Avatar } from "@radix-ui/themes";
import { updateBuild } from "~/app/services/createbuild";
import CarouselWithThumbs from "~/components/customized/carousel/carousel";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { TagsInput } from "~/components/ui/tags-input";
import { Textarea } from "~/components/ui/textarea";
import { useAppDispatch, useAppSelector } from "~/hooks/useRedux";
import { api } from "~/trpc/react";
const Create = () => {
  const dispatch = useAppDispatch();
  const build = useAppSelector((state) => state.createbuild);

  const createBuild = api.build.create.useMutation();

  const handleUploadBuild = async () => {
    try {
      await createBuild.mutateAsync({
        name: build.name,
        description: build.description,
        tags: build.tags ?? [],
        images: build.images ?? [],
        mods: build.mods ?? [],
        driver_nationality: build.driver_nationality,
        driver_description: build.driver_description,
        driver_image: build.driver_image,
      });
      alert("Build caricata con successo!");
    } catch (error) {
      alert("Errore durante l'upload della build");
      console.error(error);
    }
  };

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="xs:flex-col w-full items-center justify-between gap-5 p-4 2xl:flex">
        <div className="flex w-full flex-col gap-5 2xl:w-2/3">
          <Input
            placeholder="Build name..."
            className="min-h-[4vh] w-full"
            value={build.name}
            onChange={(e) => dispatch(updateBuild({ name: e.target.value }))}
          />
          <Textarea
            placeholder="Build description..."
            className="min-h-[25vh] w-full"
            value={build.description}
            onChange={(e) =>
              dispatch(updateBuild({ description: e.target.value }))
            }
          />
          <TagsInput
            value={build.tags ?? []}
            onChange={(e) => dispatch(updateBuild({ tags: e }))}
            placeholder="Build tags..."
            className="w-full"
          />
          <TagsInput
            value={build.mods ?? []}
            onChange={(e) => dispatch(updateBuild({ mods: e }))}
            placeholder="Build mods..."
            className="w-full"
          />
        </div>
        <div className="mt-10 flex flex-col items-center justify-center gap-5 2xl:ms-10 2xl:mt-0 2xl:w-1/3 2xl:items-start">
          <h6>Build images:</h6>
          <CarouselWithThumbs />
        </div>
      </div>
      <Separator className="my-4 w-full" />
      <div className="flex w-full flex-col items-center justify-between gap-5 p-4">
        <div className="flex w-full items-center justify-between gap-5">
          <Avatar fallback="CN" src="https://github.com/shadcn.png" />
          <Input
            placeholder="Driver name..."
            className="min-h-[4vh] w-full"
            value={build.driver_name}
            onChange={(e) =>
              dispatch(updateBuild({ driver_name: e.target.value }))
            }
          />
        </div>
        <Textarea
          placeholder="Driver description..."
          className="min-h-[25vh] w-full"
          value={build.driver_description}
          onChange={(e) =>
            dispatch(updateBuild({ driver_description: e.target.value }))
          }
        />
      </div>
      <Button onClick={handleUploadBuild}>Upload Build</Button>
    </div>
  );
};

export default Create;

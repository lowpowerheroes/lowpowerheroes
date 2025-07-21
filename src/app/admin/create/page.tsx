"use client";
import { Separator } from "@radix-ui/react-separator";
import { Avatar } from "@radix-ui/themes";
import CarouselWithThumbs from "~/components/customized/carousel/carousel";
import { Input } from "~/components/ui/input";
import { TagsInput } from "~/components/ui/tags-input";
import { Textarea } from "~/components/ui/textarea";
import { useAppSelector } from "~/hooks/useRedux";

const Create = () => {
  const build = useAppSelector((state) => state.createbuild);

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="xs:flex-col w-full items-center justify-between gap-5 p-4 2xl:flex">
        <div className="flex w-full flex-col gap-5 2xl:w-2/3">
          <Input
            placeholder="Build name..."
            className="min-h-[4vh] w-full"
            value={build.name}
            onChange={(e) => console.log(e)}
          />
          <Textarea
            placeholder="Build description..."
            className="min-h-[25vh] w-full"
            value={build.description}
            onChange={(e) => console.log(e)}
          />
          <TagsInput
            value={build.tags ?? []}
            onChange={(e) => console.log(e)}
            placeholder="Build tags..."
            className="w-full"
          />
          <TagsInput
            value={build.mods ?? []}
            onChange={(e) => console.log(e)}
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
            value={build.name}
            onChange={(e) => console.log(e)}
          />
        </div>
        <Textarea
          placeholder="Driver description..."
          className="min-h-[25vh] w-full"
          value={build.description}
          onChange={(e) => console.log(e)}
        />
      </div>
    </div>
  );
};

export default Create;

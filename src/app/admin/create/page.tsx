"use client";
import { Separator } from "@radix-ui/react-separator";
import { resetBuild, updateBuild } from "~/app/services/createbuild";
import ImageSwiper from "~/components/customized/SwiperImages/SwiperImages";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { TagsInput } from "~/components/ui/tags-input";
import { Textarea } from "~/components/ui/textarea";
import { useAppDispatch, useAppSelector } from "~/hooks/useRedux";
import { api } from "~/trpc/react";
import Dropzone from "~/components/customized/Dropzone/Dropzone";
import { fileToBase64 } from "~/lib/utils";
import { useEffect, useRef, useState } from "react";
import { Spinner } from "@radix-ui/themes";
const Create = () => {
  const dispatch = useAppDispatch();
  const build = useAppSelector((state) => state.createbuild);
  const [buildLoading, setBuildLoading] = useState(false);

  const createBuild = api.build.create.useMutation({
    onError: (error) => {
      alert(error.message);
    },
  });

  const imageRef = useRef<File[]>([]);

  const handleUploadBuild = async () => {
    let buildImages: string[] = [];

    if (imageRef.current) {
      buildImages = await Promise.all(imageRef.current.map(fileToBase64));
    }
    try {
      setBuildLoading(true);
      await createBuild.mutateAsync({
        build_name: build.build_name,
        build_description: build.build_description,
        build_images: buildImages.map((img, idx) => ({
          base64: img,
          isPrimary: idx === 0,
        })),
        build_mods: build.build_mods ?? [],
        driver_name: build.driver_name,
        driver_nationality: build.driver_nationality,
        driver_description: build.driver_description,
      });
      alert("Build caricata con successo!");
      setBuildLoading(false);
      dispatch(resetBuild());
    } catch (error) {
      alert("Errore durante l'upload della build");
      console.error(error);
      setBuildLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(resetBuild());
    };
  }, [dispatch]);

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="xs:flex-col w-full items-start justify-between gap-5 p-4 2xl:flex">
        <div className="flex w-full flex-col gap-5 2xl:w-2/4">
          <Input
            placeholder="Build name..."
            className="min-h-[4vh] w-full bg-secondary"
            value={build.build_name}
            onChange={(e) =>
              dispatch(updateBuild({ build_name: e.target.value }))
            }
          />
          <Textarea
            placeholder="Build description..."
            className="min-h-[25vh] w-full bg-secondary"
            value={build.build_description}
            onChange={(e) =>
              dispatch(updateBuild({ build_description: e.target.value }))
            }
          />

          <TagsInput
            value={build.build_mods ?? []}
            onChange={(e) => dispatch(updateBuild({ build_mods: e }))}
            placeholder="Build mods..."
            className="w-full bg-secondary"
          />
        </div>
        <div className="mt-10 flex flex-col items-center justify-center gap-5 2xl:ms-10 2xl:mt-0 2xl:w-2/4 2xl:items-start">
          <Dropzone
            onDropAccepted={(images) => {
              imageRef.current = images;
              dispatch(
                updateBuild({
                  build_images: images.map((i) => URL.createObjectURL(i)),
                }),
              );
            }}
            className={`${build.build_images?.length ? "w-full p-2" : "h-[42vh] w-full"} flex cursor-pointer items-center justify-center rounded bg-secondary`}
          >
            Drop images here or click to open Files.
          </Dropzone>
          {build.build_images && build.build_images?.length !== 0 && (
            <div className="h-[37vh] w-full">
              <ImageSwiper images={build.build_images} isUpload />
            </div>
          )}
        </div>
      </div>
      <Separator className="my-4 w-full" />
      <div className="flex w-full flex-col items-center justify-between gap-5 p-4">
        <div className="flex w-full items-center justify-between gap-5">
          <Input
            placeholder="Driver name..."
            className="min-h-[4vh] w-2/3 bg-secondary"
            value={build.driver_name}
            onChange={(e) =>
              dispatch(updateBuild({ driver_name: e.target.value }))
            }
          />
          <Input
            placeholder="Driver nationality..."
            className="min-h-[4vh] w-1/3 bg-secondary"
            value={build.driver_nationality}
            onChange={(e) =>
              dispatch(updateBuild({ driver_nationality: e.target.value }))
            }
          />
        </div>
        <Textarea
          placeholder="Driver description..."
          className="min-h-[25vh] w-full bg-secondary"
          value={build.driver_description}
          onChange={(e) =>
            dispatch(updateBuild({ driver_description: e.target.value }))
          }
        />
      </div>
      <Button
        onClick={handleUploadBuild}
        variant={"secondary"}
        className="mt-10"
      >
        {buildLoading ? <Spinner /> : "Upload Build"}
      </Button>
    </div>
  );
};

export default Create;

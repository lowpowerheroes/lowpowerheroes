interface CreateBuild {
  name: string;
  description: string;
  tags: string[] | undefined;
  mods: string[] | undefined;
  images: string[] | undefined;
  driver_name: string;
  driver_nationality: string;
  driver_description: string;
  driver_image: string;
}

export type CreateBuildArgs = {
  [K in keyof CreateBuild]: CreateBuild[K];
};

export const createbuildInitialState: CreateBuild = {
  name: "",
  description: "",
  tags: undefined,
  mods: undefined,
  images: undefined,
  driver_name: "",
  driver_nationality: "",
  driver_description: "",
  driver_image: "",
};

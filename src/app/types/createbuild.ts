export interface CreateBuildArgs {
  name: string;
  description: string;
  tags: string[] | undefined;
  mods: string[] | undefined;
  images: string[] | undefined;
  driver_nationality: string;
  driver_description: string;
  driver_image: string;
}

export const createbuildInitialState: CreateBuildArgs = {
  name: "",
  description: "",
  tags: undefined,
  mods: undefined,
  images: undefined,
  driver_nationality: "",
  driver_description: "",
  driver_image: "",
};

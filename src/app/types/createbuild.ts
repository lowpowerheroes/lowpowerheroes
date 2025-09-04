export interface Build {
  name: string;
  description: string;
  mods: string[] | undefined;
  images: string[] | undefined;
  driver_name: string;
  driver_description: string;
  driver_image: string;
}

export type CreateBuildArgs = {
  [K in keyof Build]: Build[K];
};

export const createbuildInitialState: Build = {
  name: "",
  description: "",
  mods: undefined,
  images: undefined,
  driver_name: "",
  driver_description: "",
  driver_image: "",
};

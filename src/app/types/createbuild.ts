export interface Build {
  build_name: string;
  build_description: string;
  build_mods: string[] | undefined;
  build_images: string[] | undefined;
  driver_name: string;
  driver_description: string;
  driver_nationality: string;
}

export type CreateBuildArgs = {
  [K in keyof Build]: Build[K];
};

export const createbuildInitialState: Build = {
  build_name: "",
  build_description: "",
  build_mods: undefined,
  build_images: undefined,
  driver_name: "",
  driver_description: "",
  driver_nationality: "",
};

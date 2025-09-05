export interface Build {
  build_name: string;
  build_description: string;
  build_mods: string[] | undefined;
  driver_name: string;
  driver_description: string;
  driver_nationality: string;
  build_id?: string;
  createdAt?: Date;
  updatedAt?: Date | null;
  images:
    | {
        build_id: string;
        image_id: string;
        image_url: string;
        is_primary: boolean;
        order_index: number | null;
      }[]
    | undefined;
}

export type CreateBuildArgs = {
  [K in keyof Build]: Build[K];
};

export const createbuildInitialState: Build = {
  build_name: "",
  build_description: "",
  build_mods: undefined,
  images: undefined,
  driver_name: "",
  driver_description: "",
  driver_nationality: "",
};

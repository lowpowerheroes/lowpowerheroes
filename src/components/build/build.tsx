import React, { type FC } from "react";
import type { Build } from "~/app/types/createbuild";

const build: FC<Build> = ({
  description,
  driver_description,
  driver_image,
  driver_name,
  images,
}) => {
  return <div>build</div>;
};

export default build;

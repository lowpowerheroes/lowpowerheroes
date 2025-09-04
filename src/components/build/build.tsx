"use client";

import React, { type FC } from "react";
import type { Build as BuildProperties } from "~/app/types/createbuild";
import ImageSwiper from "../customized/SwiperImages/SwiperImages";

const Build: FC<BuildProperties> = (props) => {
  return (
    <div className="my-8 w-full overflow-hidden rounded-xl bg-secondary text-primary-foreground shadow-2xl">
      <div className="flex flex-col md:flex-row">
        <div className="bg-black h-[25vh] w-full md:h-[85vh] md:w-1/2">
          {props.build_images && props.build_images.length > 0 ? (
            <ImageSwiper images={props.build_images} />
          ) : (
            <div className="bg-gray-800 flex h-full w-full items-center justify-center">
              <p className="text-muted-foreground">No images available</p>
            </div>
          )}
        </div>

        <div className="flex w-full flex-col gap-6 p-6 md:w-1/2 md:p-8">
          <div className="border-b border-border pb-4">
            <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-primary">
              {props.build_name}
            </h1>
            <p className="text-base text-muted-foreground">
              {props.build_description}
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-xl font-semibold text-primary">Mods</h3>
            <div className="flex flex-wrap gap-2">
              {props.build_mods && props.build_mods.length > 0 ? (
                props.build_mods.map((mod, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-primary px-3 py-1 text-sm font-medium text-primary-foreground"
                  >
                    {mod}
                  </span>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No mods listed.</p>
              )}
            </div>
          </div>

          <div className="mt-auto border-t border-border pt-4">
            <h3 className="text-xl font-semibold text-primary">Driver</h3>
            <div className="mt-2 flex items-center gap-4">
              <div className="text-primary">
                <span className="text-lg font-bold">{props.driver_name}</span>
                <span className="text-sm">
                  &nbsp; from {props.driver_nationality}
                </span>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {props.driver_description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Build;

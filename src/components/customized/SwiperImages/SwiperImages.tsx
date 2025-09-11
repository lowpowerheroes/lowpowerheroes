import { useEffect, type FC } from "react";
import { Swiper as S, SwiperSlide as SS } from "swiper/react";
import { Navigation, Pagination, Mousewheel, Keyboard } from "swiper/modules";
import Image from "next/image";
import { Spinner, Tooltip } from "@radix-ui/themes";
import { FaTrash } from "react-icons/fa6";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./swiper-images.css";
import { useAppDispatch, useAppSelector } from "~/hooks/useRedux";
import { updateBuild } from "~/app/services/createbuild";

interface ImageSwiperProps {
  images?: string[];
  isUpload?: boolean;
  className?: string;
}

const ImageSwiper: FC<ImageSwiperProps> = ({
  images,
  isUpload = false,
  className,
}) => {
  const dispatch = useAppDispatch();
  const buildImages = useAppSelector((state) => state.createbuild.images);

  useEffect(() => {
    return () => {
      images?.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);

  return (
    <S
      cssMode
      navigation
      pagination
      mousewheel
      keyboard
      loop={images?.length !== 1 ? true : false}
      modules={[Navigation, Pagination, Mousewheel, Keyboard]}
      className={className}
    >
      {images ? (
        images?.map((img, idx) => (
          <SS
            key={idx}
            className="relative"
            style={{ backgroundColor: "inherit" }}
          >
            <Image
              src={img}
              alt={`image-${idx}`}
              fill
              unoptimized
              className="rounded"
            />
            {isUpload && (
              <Tooltip content="Elimina immagine">
                <button
                  className="absolute bottom-5 right-5 z-10 cursor-pointer rounded bg-secondary p-2 opacity-75"
                  onClick={() =>
                    dispatch(
                      updateBuild({
                        images: buildImages?.filter(
                          (_i, imgIdx) => imgIdx !== idx,
                        ),
                      }),
                    )
                  }
                >
                  <FaTrash />
                </button>
              </Tooltip>
            )}
          </SS>
        ))
      ) : (
        <SS style={{ backgroundColor: "transparent" }}>
          <Spinner />
        </SS>
      )}
    </S>
  );
};

export default ImageSwiper;

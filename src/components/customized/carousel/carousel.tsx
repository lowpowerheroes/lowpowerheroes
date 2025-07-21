import Image from "next/image";
import { useEffect, useState, type SVGProps } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "~/components/ui/carousel";

export default function Component() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="max-h-2xl max-w-3xl">
      <Carousel className="relative" setApi={setApi}>
        <CarouselContent>
          {new Array(5).fill(0).map((_v, idx) => (
            <CarouselItem key={idx + "carousel"}>
              <Image
                src="https://g-8fhjeqorrz8.vusercontent.net/placeholder.svg"
                alt={`Carousel Image ${idx}`}
                width={800}
                height={500}
                className="h-[400px] w-full rounded-lg object-cover"
                style={{ aspectRatio: "800/500", objectFit: "cover" }}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute inset-0 flex items-center justify-between px-4">
          <CarouselPrevious className="bg-white/50 hover:bg-white/75 rounded-full p-2 shadow-md transition-colors">
            <ChevronLeftIcon className="text-gray-800 h-6 w-6" />
          </CarouselPrevious>
          <CarouselNext className="bg-white/50 hover:bg-white/75 rounded-full p-2 shadow-md transition-colors">
            <ChevronRightIcon className="text-gray-800 h-6 w-6" />
          </CarouselNext>
        </div>
      </Carousel>
      <div className="mt-4 flex justify-center gap-4">
        {new Array(5).fill(0).map((_v, idx) => (
          <button
            className="border-gray-300 overflow-hidden rounded-md border"
            key={idx + "preview"}
            onClick={() => api?.scrollTo(idx)}
          >
            <Image
              src="https://g-8fhjeqorrz8.vusercontent.net/placeholder.svg"
              alt={`Thumbanil ${idx}`}
              width={100}
              height={60}
              className="h-[60px] w-[100px] object-cover"
              style={{ aspectRatio: "100/60", objectFit: "cover" }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function ChevronLeftIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

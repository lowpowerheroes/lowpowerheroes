import Link from "next/link";

type BuildCardProps = {
  build_id: string;
  build_name: string;
  build_images: { image_url: string }[];
};

const BuildCard: React.FC<BuildCardProps> = ({
  build_id,
  build_name,
  build_images,
}) => {
  const primaryImage = build_images?.[0]?.image_url;

  return (
    <Link href={`/builds/${build_id}`} className="group block">
      <div className="overflow-hidden rounded-lg border border-border bg-secondary shadow-lg">
        <div
          className="bg-gray-700 relative aspect-video w-full bg-cover bg-center transition-transform duration-300 ease-in-out group-hover:scale-105"
          style={{
            backgroundImage: primaryImage ? `url(${primaryImage})` : "none",
          }}
        >
          {!primaryImage && (
            <div className="flex h-full w-full items-center justify-center">
              <p className="text-gray-300">No Image</p>
            </div>
          )}
        </div>

        <div className="p-2">
          <h3 className="truncate text-sm font-semibold text-primary">
            {build_name}
          </h3>
        </div>
      </div>
    </Link>
  );
};

export default BuildCard;

import Image, { type ImageProps } from "next/image";
import { useEffect, useMemo, useState } from "react";
type AvatarProps = Omit<ImageProps, "src"> & {
  src?: string | null;
};

export function Avatar({
  src,
  alt = "Avatar",
  className,
  ...props
}: AvatarProps) {
  const fallback = useMemo(
    () =>
      `https://api.dicebear.com/10.x/shape-grid/svg?seed=${encodeURIComponent(
        String(alt),
      )}`,
    [alt],
  );

  const [imageSrc, setImageSrc] = useState(fallback);

  useEffect(() => {
    setImageSrc(src || fallback);
  }, [src, fallback]);

  const isFallback = imageSrc === fallback;

  return (
    <Image
      {...props}
      src={imageSrc}
      alt={String(alt)}
      onError={() => setImageSrc(fallback)}
      unoptimized
      className={`transition-all duration-300 ${
        isFallback
          ? "grayscale opacity-50 border-2 border-dashed border-white/20"
          : "border border-white/10"
      } ${className || ""}`}
    />
  );
}

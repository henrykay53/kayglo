import Image from "next/image";
import type { ProjectPhoto } from "@/lib/site";

/**
 * A site photo in a rounded frame. The frame sets the shape — pass an aspect
 * ratio or height in `className` — and the photo fills it.
 *
 * Every photo in /public is already watermarked and stripped of location data
 * by `npm run photos`, so there is nothing to add here.
 */
export function Photo({
  photo,
  className = "",
  sizes,
  preload = false,
  position,
}: {
  photo: ProjectPhoto;
  className?: string;
  sizes: string;
  /** Only for the photo that is the page's largest above-the-fold element. */
  preload?: boolean;
  /** CSS object-position, for frames that crop the photo hard. */
  position?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-ink/10 bg-cream-200 ${className}`}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes={sizes}
        preload={preload}
        className="object-cover"
        style={position ? { objectPosition: position } : undefined}
      />
    </div>
  );
}

import React from 'react';
import { ImageWithFallback } from './image-with-fallback';

export function Thumbnail({ src, alt, size = 48, className = '' }: { src?: string | null; alt: string; size?: number; className?: string }) {
  const finalSrc = src || '/file.svg';
  return (
    <ImageWithFallback
      src={finalSrc}
      alt={alt}
      width={size}
      height={size}
      className={className}
      placeholder="blur"
      blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTAnIGhlaWdodD0nMTAnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PHJlY3Qgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyBmaWxsPSIjZWVlIi8+PC9zdmc+"
    />
  );
}

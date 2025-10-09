"use client";
import Image, { ImageProps } from 'next/image';
import React from 'react';

type Props = Omit<ImageProps, 'onError'> & { fallbackSrc?: string };

export function ImageWithFallback({ fallbackSrc, alt, ...rest }: Props) {
  const [src, setSrc] = React.useState(rest.src as string);
  return (
    <Image
      {...rest}
      alt={alt}
      src={src}
      onError={() => {
        if (fallbackSrc) setSrc(fallbackSrc);
      }}
    />
  );
}


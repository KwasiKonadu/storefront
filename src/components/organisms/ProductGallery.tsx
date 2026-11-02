'use client';

import { useState } from 'react';
import { cx } from '@/lib/format';

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [current, setCurrent] = useState(0);
  return (
    <div className="pdp-gallery">
      <div className="main-img">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images[current]} alt={name} />
      </div>
      <div className="thumbs">
        {images.map((src, i) => (
          <button key={src} type="button" className={cx(i === current && 'on')} onClick={() => setCurrent(i)} aria-label={`Image ${i + 1}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" loading="lazy" />
          </button>
        ))}
      </div>
    </div>
  );
}

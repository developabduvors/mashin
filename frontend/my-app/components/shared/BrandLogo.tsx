'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface BrandLogoProps {
  src?: string | null;
  name: string;
  className?: string;
}

// Brend logosi tashqi manbadan keladi (admin'da yuklanishi mumkin). Manba yo'q
// yoki yuklanmasa (o'lik URL/404) — brend nomini toza wordmark sifatida
// ko'rsatamiz. Shu tariqa o'lik tashqi servis sahifani hech qachon buzmaydi.
export const BrandLogo = ({ src, name, className = 'object-contain' }: BrandLogoProps) => {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <span className="absolute inset-0 flex items-center justify-center px-1 text-center font-display text-sm font-black uppercase leading-tight tracking-tight text-zinc-700">
        {name}
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt={name}
      fill
      className={className}
      onError={() => setFailed(true)}
    />
  );
};

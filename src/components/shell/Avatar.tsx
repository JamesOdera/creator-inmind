// src/components/shell/Avatar.tsx
"use client";

import { useState } from "react";

type AvatarProps = {
  initials: string;
  src?: string; // Optional image URL
  className?: string;
};

export function Avatar({ initials, src, className = "" }: AvatarProps) {
  const [imageError, setImageError] = useState(false);

  if (src && !imageError) {
    return (
      <img
        src={src}
        alt={initials}
        className={`rounded-full object-cover bg-im-surface ${className}`}
        onError={() => setImageError(true)}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-gradient-to-br from-im-violet to-im-pink font-semibold text-white ${className}`}
    >
      {initials}
    </div>
  );
}

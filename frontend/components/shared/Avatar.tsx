'use client';

import Image from 'next/image';
import { useMemo } from 'react';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Avatar = ({
  src,
  name,
  size = 'md',
  className = '',
}: AvatarProps) => {
  const initials = useMemo(() => {
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  }, [name]);

  const backgroundColor = useMemo(() => {
    const colors = [
      'bg-red-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-yellow-500',
      'bg-indigo-500',
      'bg-cyan-500',
      'bg-orange-500',
      'bg-amber-500',
      'bg-lime-500',
      'bg-emerald-500',
    ];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    const index = Math.abs(hash) % colors.length;
    return colors[index];
  }, [name]);

  // ✅ IMPORTANT: Tailwind classes en tant que string complet
  const getContainerClass = () => {
    const baseClasses = 'relative overflow-hidden rounded-full flex-shrink-0';

    switch (size) {
      case 'sm':
        return `${baseClasses} w-8 h-8`;
      case 'md':
        return `${baseClasses} w-10 h-10`;
      case 'lg':
        return `${baseClasses} w-16 h-16`;
      default:
        return `${baseClasses} w-10 h-10`;
    }
  };

  const imageSizes = {
    sm: '32px',
    md: '40px',
    lg: '64px',
  };

  // ============================================
  // CAS 1: SI IMAGE EXISTE
  // ============================================
  if (src) {
    return (
      <div
        className={`${getContainerClass()} ${backgroundColor} ${className}`}
        style={{
          position: 'relative',
          display: 'block',
        }}
      >
        <Image
          src={src}
          alt={name}
          fill
          className="object-cover"
          sizes={imageSizes[size]}
          priority
          placeholder="blur"
          blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23e5e7eb' width='100' height='100'/%3E%3C/svg%3E"
        />
      </div>
    );
  }

  // ============================================
  // CAS 2: SANS IMAGE → INITIALES
  // ============================================
  const textSize = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-lg',
  };

  return (
    <div
      className={`
        flex items-center justify-center
        rounded-full font-semibold text-white
        flex-shrink-0
        ${getContainerClass()}
        ${backgroundColor}
        ${textSize[size] || 'text-sm'}
        ${className}
      `}
      title={name}
    >
      {initials}
    </div>
  );
};

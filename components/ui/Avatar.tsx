import Image from 'next/image'

interface AvatarProps {
  src?: string | null
  alt?: string
  size?: 'sm' | 'md' | 'lg'
  fallback?: string
}

export default function Avatar({
  src,
  alt = 'Avatar',
  size = 'md',
  fallback,
}: AvatarProps) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
  }

  const sizePixels = {
    sm: 32,
    md: 40,
    lg: 56,
  }

  if (src) {
    return (
      <div className={`relative rounded-full overflow-hidden ${sizes[size]}`}>
        <Image
          src={src}
          alt={alt}
          width={sizePixels[size]}
          height={sizePixels[size]}
          className="object-cover"
        />
      </div>
    )
  }

  const initials = fallback || alt.charAt(0).toUpperCase()

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-gray-200 text-gray-600 font-medium ${sizes[size]}`}
    >
      {initials}
    </div>
  )
}

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx'

interface ProductImageProps {
  src: string | null
  name: string
}

export default function ProductImage({ src, name }: ProductImageProps) {
  return (
    <Avatar className="size-12">
      {src ? <AvatarImage src={src} alt="" /> : null}
      <AvatarFallback>{name.slice(0, 1).toUpperCase()}</AvatarFallback>
    </Avatar>
  )
}

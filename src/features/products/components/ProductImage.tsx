import { cn } from "cn";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";

interface ProductImageProps {
  src: string | null;
  name: string;
  className?: string;
}

export default function ProductImage({
  src,
  name,
  className,
}: ProductImageProps) {
  return (
    <Avatar
      className={cn("size-12 rounded-lg after:rounded-lg", className)}
    >
      {src ? (
        <AvatarImage className="rounded-lg" src={src} alt="" />
      ) : null}
      <AvatarFallback className="rounded-lg">
        {name.slice(0, 1).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}

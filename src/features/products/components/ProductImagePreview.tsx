import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card.tsx";
import ProductImage from "./ProductImage.tsx";

interface ProductImagePreviewProps {
  src: string | null;
  name: string;
}

export default function ProductImagePreview({
  src,
  name,
}: ProductImagePreviewProps) {
  if (!src) return <ProductImage src={null} name={name} />;

  return (
    <HoverCard>
      <HoverCardTrigger
        delay={200}
        render={<span className="shrink-0 cursor-zoom-in" />}
      >
        <ProductImage src={src} name={name} />
      </HoverCardTrigger>
      <HoverCardContent side="right" align="start" className="w-auto p-1.5">
        <img
          src={src}
          alt={name}
          className="size-64 rounded-md object-contain"
        />
      </HoverCardContent>
    </HoverCard>
  );
}

import { useRef, useState } from "react";
import type { FieldError as FormFieldError } from "react-hook-form";
import { UploadCloud, XIcon } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button.tsx";
import FormFieldLabel from "@/components/features/Form/FormFieldLabel.tsx";
import { Field, FieldError } from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Separator } from "@/components/ui/separator.tsx";

const ACCEPTED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

interface ProductImageFieldProps {
  name: string;
  value: string;
  invalid?: boolean;
  error?: FormFieldError;
  required?: boolean;
  onChange: (value: string) => void;
  onBlur: () => void;
}

function readImageFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }
      reject(new Error("No se pudo leer la imagen"));
    };
    reader.onerror = () => reject(new Error("No se pudo leer la imagen"));
    reader.readAsDataURL(file);
  });
}

export default function ProductImageField({
  name,
  value,
  invalid,
  error,
  required = false,
  onChange,
  onBlur,
}: ProductImageFieldProps) {
  const readGeneration = useRef(0);
  const [dragging, setDragging] = useState(false);
  const [fileLabel, setFileLabel] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const isUploadedFile = value.startsWith("data:");
  const urlText = isUploadedFile ? "" : value;
  const preview = value.length > 0 ? value : null;

  const applyFile = async (file: File) => {
    const generation = readGeneration.current + 1;
    readGeneration.current = generation;

    if (!ACCEPTED_IMAGE_TYPES.has(file.type)) {
      setFileError("Usa una imagen JPG, PNG, WEBP o GIF.");
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      setFileError("La imagen supera los 5 MB.");
      return;
    }

    setFileError(null);

    try {
      const dataUrl = await readImageFile(file);
      if (generation !== readGeneration.current) return;
      setFileLabel(file.name);
      onChange(dataUrl);
    } catch {
      if (generation !== readGeneration.current) return;
      setFileError("No se pudo leer la imagen.");
    }
  };

  const clearImage = () => {
    readGeneration.current += 1;
    setFileLabel(null);
    setFileError(null);
    onChange("");
  };

  return (
    <Field data-invalid={invalid || fileError ? true : undefined}>
      <FormFieldLabel required={required}>Imagen</FormFieldLabel>
      <label
        className={cn(
          "flex min-h-40 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-primary/40 bg-primary/5 px-4 py-6 text-center transition-colors hover:border-primary hover:bg-primary/10",
          dragging && "border-primary bg-primary/10",
        )}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={(event) => {
          const nextTarget = event.relatedTarget;
          if (
            nextTarget instanceof Node &&
            event.currentTarget.contains(nextTarget)
          )
            return;
          setDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          const file = event.dataTransfer.files[0];
          if (file) void applyFile(file);
        }}
      >
        {preview ? (
          <img
            src={preview}
            alt={name}
            className="size-16 rounded-lg object-cover"
          />
        ) : (
          <span className="relative text-muted-foreground">
            <UploadCloud className="size-10 stroke-1" />
          </span>
        )}
        {fileLabel ? (
          <p className="max-w-full truncate text-sm font-medium">{fileLabel}</p>
        ) : null}
        <p className="text-sm">
          Arrastra y suelta la foto aquí o{" "}
          <span className="font-medium text-foreground underline underline-offset-2">
            elige archivo
          </span>
        </p>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void applyFile(file);
            event.target.value = "";
          }}
        />
      </label>
      <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
        <span>Formatos: JPG, PNG, WEBP, GIF</span>
        <span>Tamaño máximo: 5 MB</span>
      </div>
      {value ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="self-start"
          onClick={clearImage}
        >
          <XIcon data-icon="inline-start" />
          Quitar imagen
        </Button>
      ) : null}
      <div className="relative flex items-center py-1">
        <Separator />
        <span className="absolute left-1/2 -translate-x-1/2 bg-card px-2 text-sm text-muted-foreground">
          o usa una URL
        </span>
      </div>
      <Field>
        <FormFieldLabel htmlFor="imagen_url">URL de la imagen</FormFieldLabel>
        <Input
          id="imagen_url"
          type="url"
          placeholder="https://…"
          value={urlText}
          aria-invalid={invalid ? true : undefined}
          onBlur={onBlur}
          onChange={(event) => {
            readGeneration.current += 1;
            setFileLabel(null);
            setFileError(null);
            onChange(event.target.value);
          }}
        />
      </Field>
      <FieldError errors={[fileError ? { message: fileError } : error]} />
    </Field>
  );
}

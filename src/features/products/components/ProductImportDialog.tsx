import { useState } from "react";
import { DownloadIcon, FileSpreadsheetIcon, UploadCloudIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "cn";
import { Alert, AlertDescription } from "@/components/ui/alert.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Field, FieldError } from "@/components/ui/field.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import {
  listImportCategories,
  toImportableProductFile,
  withFriendlyProductTemplate,
} from "../product-workbook.ts";
import {
  useDownloadProductTemplate,
  useImportProducts,
} from "../services/queries.ts";

const MAX_IMPORT_BYTES = 2 * 1024 * 1024;

interface ProductImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function isExcelFile(file: File) {
  return file.name.toLowerCase().endsWith(".xlsx");
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function saveDownloadedFile(file: Blob, fileName: string) {
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

export default function ProductImportDialog({
  open,
  onOpenChange,
}: ProductImportDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [prepareError, setPrepareError] = useState<string | null>(null);
  const [preparing, setPreparing] = useState<"download" | "import" | null>(null);
  const [dragging, setDragging] = useState(false);
  const downloadTemplate = useDownloadProductTemplate();
  const importProducts = useImportProducts();
  const isBusy =
    downloadTemplate.isPending || importProducts.isPending || preparing !== null;

  const closeDialog = (nextOpen: boolean) => {
    if (!nextOpen && (importProducts.isPending || preparing !== null)) return;
    if (!nextOpen) {
      setFile(null);
      setFileError(null);
      setPrepareError(null);
      setDragging(false);
    }
    onOpenChange(nextOpen);
  };

  const selectFile = (nextFile: File | undefined) => {
    if (!nextFile) return;

    if (!isExcelFile(nextFile)) {
      setFile(null);
      setFileError("Usa un archivo Excel .xlsx.");
      return;
    }

    if (nextFile.size > MAX_IMPORT_BYTES) {
      setFile(null);
      setFileError("El archivo supera los 2 MB.");
      return;
    }

    setFileError(null);
    setPrepareError(null);
    setFile(nextFile);
  };

  const download = () => {
    setPrepareError(null);
    downloadTemplate.mutate(undefined, {
      onSuccess: (template) => {
        void saveFriendlyTemplate(template.file, template.fileName);
      },
    });
  };

  const saveFriendlyTemplate = async (template: Blob, fileName: string) => {
    setPreparing("download");
    try {
      const categories = await listImportCategories();
      const friendlyTemplate = await withFriendlyProductTemplate(template, categories);
      saveDownloadedFile(friendlyTemplate, fileName);
    } catch (error) {
      setPrepareError(
        error instanceof Error ? error.message : "No se pudo preparar la plantilla.",
      );
    } finally {
      setPreparing(null);
    }
  };

  const submitImport = () => {
    if (!file) return;
    setPrepareError(null);
    void importSelectedFile(file);
  };

  const importSelectedFile = async (selectedFile: File) => {
    setPreparing("import");
    try {
      const categories = await listImportCategories();
      const preparedFile = await toImportableProductFile(selectedFile, categories);
      setPreparing(null);
      importProducts.mutate(preparedFile, {
        onSuccess: (result) => {
          const createdLabel =
            result.creados === 1
              ? "1 producto creado"
              : `${result.creados} productos creados`;
          toast.success(createdLabel);
          setFile(null);
          setFileError(null);
          setPrepareError(null);
          onOpenChange(false);
        },
      });
    } catch (error) {
      setPrepareError(
        error instanceof Error ? error.message : "No se pudo leer el Excel.",
      );
      setPreparing(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent className="max-h-[min(90svh,720px)] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Importar productos</DialogTitle>
          <DialogDescription>
            En categoría elige el nombre. En es servicio elige sí o no; si lo
            dejas vacío, se toma como no. Máximo 500 filas y 2 MB.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-between gap-3 rounded-lg border bg-muted/40 p-3">
          <div className="min-w-0">
            <p className="font-medium">Plantilla</p>
            <p className="text-muted-foreground">
              Trae listas para la categoría y para sí o no.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isBusy}
            onClick={download}
          >
            {downloadTemplate.isPending || preparing === "download" ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <DownloadIcon data-icon="inline-start" />
            )}
            Descargar
          </Button>
        </div>
        <Field data-invalid={fileError ? true : undefined}>
          <label
            className={cn(
              "flex min-h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-primary/40 bg-primary/5 px-4 py-6 text-center transition-colors hover:border-primary hover:bg-primary/10",
              dragging && "border-primary bg-primary/10",
              isBusy && "pointer-events-none opacity-60",
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
              selectFile(event.dataTransfer.files[0]);
            }}
          >
            <UploadCloudIcon className="size-8 stroke-1 text-muted-foreground" />
            {file ? (
              <p className="max-w-full truncate text-sm font-medium">
                <FileSpreadsheetIcon className="mr-1 inline size-4" />
                {file.name}
                <span className="ml-1 font-normal text-muted-foreground">
                  {formatFileSize(file.size)}
                </span>
              </p>
            ) : (
              <p className="text-sm">
                Arrastra el Excel aquí o{" "}
                <span className="font-medium text-foreground underline underline-offset-2">
                  elige archivo
                </span>
              </p>
            )}
            <input
              type="file"
              accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              className="sr-only"
              disabled={isBusy}
              onChange={(event) => {
                selectFile(event.target.files?.[0]);
                event.target.value = "";
              }}
            />
          </label>
          <FieldError errors={[fileError ? { message: fileError } : undefined]} />
        </Field>
        {prepareError ? (
          <Alert variant="destructive">
            <AlertDescription className="whitespace-pre-line">
              {prepareError}
            </AlertDescription>
          </Alert>
        ) : null}
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={importProducts.isPending}
            onClick={() => closeDialog(false)}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            disabled={!file || isBusy}
            onClick={submitImport}
          >
            {importProducts.isPending || preparing === "import" ? (
              <Spinner data-icon="inline-start" />
            ) : null}
            Importar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

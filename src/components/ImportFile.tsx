"use client";

import { getImportTransactions } from "@/actions/transactions/getImportTransactions.actions";
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import { toast } from "sonner";

export function ImportFile() {
  const { mutateAsync, isPending, data } = useMutation({
    mutationFn: async (file: File) => await getImportTransactions({ file }),
    onSuccess: () => {
      toast.success("Transações importadas com sucesso", {
        richColors: true,
      });
    },
  });

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const formData = new FormData();
      formData.append("file", acceptedFiles[0]);

      console.log({
        acceptedFiles,
        formData: formData.append("file", acceptedFiles[0]),
      });

      await mutateAsync(acceptedFiles[0]);
    },
    [mutateAsync]
  );

  console.log("mut", data);

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
    disabled: true,
    noDrag: true,
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      // className={`flex flex-col p-8 rounded-2xl items-center justify-center w-full border-2 border-dashed cursor-pointer transition
      //   ${isDragActive ? "border-green-400 bg-green-50" : ""}
      // `}
    >
      <input {...getInputProps()} />
      <Button disabled={isPending} variant="outline">
        {isPending ? "Importando..." : "Importar transações"}
      </Button>
      {fileRejections.length > 0 && (
        <p className="text-red-600 text-xs font-medium">
          Formato de arquivo inválido
        </p>
      )}
      {/* {isDragActive ? (
        <p className="text-green-600 font-medium">Solte o arquivo aqui...</p>
      ) : (
        <p className="text-neutral-300">Importar transações</p>
      )} */}
    </div>
  );
}

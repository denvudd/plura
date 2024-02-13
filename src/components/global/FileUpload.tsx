import React from "react";
import Image from "next/image";
import { File, X } from "lucide-react";

import { UploadDropzone } from "@/lib/uploadthing";
import { fileRouter } from "@/app/api/uploadthing/core";

import { Button } from "../ui/button";

interface FileUploadProps {
  endpoint: keyof typeof fileRouter;
  onChange: (url?: string) => void;
  value: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  endpoint,
  onChange,
  value,
}) => {
  const fileFormat = value?.split(".").pop();

  if (value) {
    return (
      <div className="flex flex-col justify-center items-center">
        {fileFormat !== "pdf" ? (
          <div className="relative w-40 h-40">
            <Image
              src={value}
              className="object-contain"
              fill
              alt="Uploaded image"
            />
          </div>
        ) : (
          <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
            <File aria-hidden />
            <a
              href={value}
              target="_blank"
              rel="noopener_noreffer"
              className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
            >
              View PDF
            </a>
          </div>
        )}
        <Button onClick={() => onChange("")} variant="ghost" type="button">
          <X aria-hidden className="h-4 w-4" />
          Remove Logo
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full bg-muted/30 rounded-md">
      <UploadDropzone
        endpoint={endpoint}
        className="rounded-md"
        onClientUploadComplete={(res) => {
          onChange(res?.[0].url);
        }}
        onUploadError={(error) => {
          console.log(error);
        }}
      />
    </div>
  );
};

export default FileUpload;

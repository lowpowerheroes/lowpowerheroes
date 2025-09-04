import React, { useCallback, type FC, type ReactNode } from "react";
import { useDropzone } from "react-dropzone";

interface DropzoneProps {
  children?: ReactNode;
  className?: string;
  onDropAccepted: (images: File[]) => void;
}

const Dropzone: FC<DropzoneProps> = ({
  children,
  onDropAccepted,
  className,
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onDropAccepted(acceptedFiles);
    },
    [onDropAccepted],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
  });

  return (
    <div {...getRootProps()} className={className}>
      <input {...getInputProps()} />
      {children}
    </div>
  );
};

export default Dropzone;

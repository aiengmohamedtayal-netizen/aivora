import { useState, useEffect, useRef, useCallback } from "react";
import { AttachedFile } from "@/hooks/useChat";

export function useFileUpload() {
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const objectUrlsRef = useRef<Set<string>>(new Set());

  const handleFiles = useCallback((newFilesList: FileList | File[]) => {
    const newFiles = Array.from(newFilesList).map(file => {
      const isImage = file.type.startsWith("image/") || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file.name);
      let preview: string | null = null;
      if (isImage) {
        preview = URL.createObjectURL(file);
        objectUrlsRef.current.add(preview);
      }
      return {
        id: crypto.randomUUID(),
        file,
        type: isImage ? file.type || "image/unknown" : (file.type || "application/octet-stream"),
        preview,
        uploadStatus: "pending" as const
      };
    });

    setAttachedFiles(prev => [...prev, ...newFiles]);
    newFiles.forEach(f => {
      setAttachedFiles(prev => prev.map(p => p.id === f.id ? { ...p, uploadStatus: "uploading" } : p));
      setTimeout(() => {
        setAttachedFiles(prev => prev.map(p => p.id === f.id ? { ...p, uploadStatus: "complete" } : p));
      }, 800 + Math.random() * 600);
    });
  }, []);

  const removeFile = useCallback((id: string) => {
    setAttachedFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
        objectUrlsRef.current.delete(file.preview);
      }
      return prev.filter(f => f.id !== id);
    });
  }, []);

  useEffect(() => {
    const urls = objectUrlsRef.current;
    return () => {
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  return {
    attachedFiles,
    setAttachedFiles,
    isDragging,
    setIsDragging,
    handleFiles,
    removeFile,
    onDragOver,
    onDragLeave,
    onDrop
  };
}

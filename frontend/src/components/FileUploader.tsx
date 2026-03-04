'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Loader2, FileIcon } from 'lucide-react';
import { uploadFiles } from '@/lib/api';
import { cn, formatFileSize } from '@/lib/utils';
import styles from './FileUploader.module.css';

interface FileUploaderProps {
  projectId: string;
  onUploadComplete: () => void;
}

export default function FileUploader({ projectId, onUploadComplete }: FileUploaderProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setSelectedFiles((prev) => [...prev, ...acceptedFiles]);
    setError('');
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 1024 * 1024 * 1024, // 1GB
    maxFiles: 20,
  });

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setError('');

    try {
      await uploadFiles(projectId, selectedFiles, description || undefined);
      setSelectedFiles([]);
      setDescription('');
      onUploadComplete();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al subir archivos.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={cn(styles.dropzone, isDragActive && styles.dropzoneActive)}
      >
        <input {...getInputProps()} />
        <Upload size={40} className={styles.dropIcon} />
        {isDragActive ? (
          <p className={styles.dropActiveText}>Suelta los archivos aquí...</p>
        ) : (
          <>
            <p className={styles.dropText}>
              Arrastra archivos aquí o haz clic para seleccionar
            </p>
            <p className={styles.dropHint}>
              PDFs, documentos, imágenes, videos, código... hasta 100MB por archivo
            </p>
          </>
        )}
      </div>

      {/* File list */}
      {selectedFiles.length > 0 && (
        <div className={styles.fileSection}>
          <h4 className={styles.fileTitle}>
            Archivos seleccionados ({selectedFiles.length})
          </h4>
          <div className={styles.fileScroll}>
            {selectedFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className={styles.fileItem}
              >
                <div className={styles.fileItemInfo}>
                  <FileIcon size={16} className={styles.fileItemIcon} />
                  <span className={styles.fileItemName}>{file.name}</span>
                  <span className={styles.fileItemSize}>
                    {formatFileSize(file.size)}
                  </span>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className={styles.fileItemRemove}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Description */}
          <input
            type="text"
            className="input"
            placeholder="Descripción de los archivos (opcional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {error && (
            <p className={styles.error}>{error}</p>
          )}

          <button
            onClick={handleUpload}
            disabled={uploading}
            className={cn('btn-primary', styles.uploadBtn)}
          >
            {uploading && <Loader2 size={16} className="animate-spin" />}
            {uploading ? 'Subiendo...' : `Subir ${selectedFiles.length} archivo(s)`}
          </button>
        </div>
      )}
    </div>
  );
}

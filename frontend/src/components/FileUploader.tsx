'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Loader2, FileIcon } from 'lucide-react';
import { uploadFiles } from '@/lib/api';
import { formatFileSize } from '@/lib/utils';

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
    maxSize: 100 * 1024 * 1024, // 100MB
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
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
          isDragActive
            ? 'border-accent-cyan bg-accent-cyan/5'
            : 'border-gray-700 hover:border-accent-cyan/50 hover:bg-white/[0.02]'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="h-10 w-10 text-gray-500 mx-auto mb-3" />
        {isDragActive ? (
          <p className="text-accent-cyan font-medium">Suelta los archivos aquí...</p>
        ) : (
          <>
            <p className="text-gray-300 font-medium">
              Arrastra archivos aquí o haz clic para seleccionar
            </p>
            <p className="text-sm text-gray-500 mt-1">
              PDFs, documentos, imágenes, videos, código... hasta 100MB por archivo
            </p>
          </>
        )}
      </div>

      {/* File list */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-300">
            Archivos seleccionados ({selectedFiles.length})
          </h4>
          <div className="max-h-48 overflow-y-auto space-y-1">
            {selectedFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between rounded-lg px-3 py-2"
                style={{ background: 'rgba(15, 15, 15, 0.6)', border: '1px solid rgba(100, 255, 218, 0.06)' }}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <FileIcon className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="text-sm text-gray-300 truncate">{file.name}</span>
                  <span className="text-xs text-gray-500 flex-shrink-0">
                    {formatFileSize(file.size)}
                  </span>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="text-gray-500 hover:text-accent-red flex-shrink-0 ml-2"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Description */}
          <input
            type="text"
            className="input text-sm"
            placeholder="Descripción de los archivos (opcional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <button
            onClick={handleUpload}
            disabled={uploading}
            className="btn-primary flex items-center gap-2"
          >
            {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
            {uploading ? 'Subiendo...' : `Subir ${selectedFiles.length} archivo(s)`}
          </button>
        </div>
      )}
    </div>
  );
}

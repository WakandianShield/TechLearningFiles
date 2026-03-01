'use client';

import { Trash2, Download, ExternalLink } from 'lucide-react';
import { formatFileSize, getFileIcon } from '@/lib/utils';
import { deleteFile } from '@/lib/api';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { sanitizeText } from '@/lib/sanitize';

interface ProjectFile {
  id: string;
  originalName: string;
  fileName: string;
  filePath: string;
  mimeType: string;
  size: number;
  fileType: string;
  description: string | null;
  createdAt: string;
}

interface FileListProps {
  files: ProjectFile[];
  onFileDeleted: () => void;
  apiUrl: string;
}

export default function FileList({ files, onFileDeleted, apiUrl }: FileListProps) {
  const handleDelete = async (fileId: string) => {
    if (!confirm('¿Estás seguro de eliminar este archivo?')) return;

    try {
      await deleteFile(fileId);
      onFileDeleted();
    } catch (error) {
      alert('Error al eliminar el archivo');
    }
  };

  if (files.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No hay archivos aún. Sube tu primer archivo.</p>
      </div>
    );
  }

  // Backend base URL (without /api)
  const backendUrl = apiUrl.replace('/api', '');

  return (
    <div className="space-y-2">
      {files.map((file) => (
        <div key={file.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 hover:bg-gray-100 transition-colors">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <span className="text-2xl">{getFileIcon(file.mimeType)}</span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {sanitizeText(file.originalName)}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>{formatFileSize(file.size)}</span>
                <span>•</span>
                <span>{file.fileType}</span>
                <span>•</span>
                <span>{format(new Date(file.createdAt), "d MMM yyyy", { locale: es })}</span>
              </div>
              {file.description && (
                <p className="text-xs text-gray-500 mt-0.5 truncate">
                  {sanitizeText(file.description)}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 ml-3">
            <a
              href={`${backendUrl}${file.filePath}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-500 hover:text-primary-600 rounded-lg hover:bg-white transition-colors"
              title="Ver archivo"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
            <a
              href={`${backendUrl}${file.filePath}`}
              download={file.originalName}
              className="p-2 text-gray-500 hover:text-green-600 rounded-lg hover:bg-white transition-colors"
              title="Descargar"
            >
              <Download className="h-4 w-4" />
            </a>
            <button
              onClick={() => handleDelete(file.id)}
              className="p-2 text-gray-500 hover:text-red-600 rounded-lg hover:bg-white transition-colors"
              title="Eliminar"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

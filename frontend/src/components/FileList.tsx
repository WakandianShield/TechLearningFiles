'use client';

import { useState } from 'react';
import { Trash2, Download, ExternalLink, Pencil, Check, X, Search, Filter } from 'lucide-react';
import { formatFileSize, getFileIcon } from '@/lib/utils';
import { deleteFile, renameFile } from '@/lib/api';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { sanitizeText } from '@/lib/sanitize';

interface ProjectFile {
  id: string;
  originalName: string;
  displayName: string | null;
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
  readOnly?: boolean;
}

const FILE_TYPES = ['ALL', 'PDF', 'DOCUMENT', 'IMAGE', 'VIDEO', 'AUDIO', 'CODE', 'SPREADSHEET', 'ARCHIVE', 'OTHER'];
const FILE_TYPE_LABELS: Record<string, string> = {
  ALL: 'Todos', PDF: 'PDF', DOCUMENT: 'Documentos', IMAGE: 'Imágenes',
  VIDEO: 'Videos', AUDIO: 'Audio', CODE: 'Código', SPREADSHEET: 'Hojas',
  ARCHIVE: 'Archivos', OTHER: 'Otros',
};

type SortBy = 'date' | 'name' | 'size' | 'type';

export default function FileList({ files, onFileDeleted, apiUrl, readOnly }: FileListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [sortBy, setSortBy] = useState<SortBy>('date');

  const handleDelete = async (fileId: string) => {
    if (!confirm('¿Estás seguro de eliminar este archivo?')) return;
    try {
      await deleteFile(fileId);
      onFileDeleted();
    } catch (error) {
      alert('Error al eliminar el archivo');
    }
  };

  const startRename = (file: ProjectFile) => {
    setEditingId(file.id);
    setEditName(file.displayName || file.originalName);
  };

  const handleRename = async (fileId: string) => {
    if (!editName.trim()) return;
    try {
      await renameFile(fileId, editName.trim());
      setEditingId(null);
      onFileDeleted(); // refresh
    } catch (error) {
      alert('Error al renombrar');
    }
  };

  // Filter and sort
  let filtered = files.filter((f) => {
    const name = (f.displayName || f.originalName).toLowerCase();
    const matchSearch = !searchQuery || name.includes(searchQuery.toLowerCase());
    const matchType = filterType === 'ALL' || f.fileType === filterType;
    return matchSearch && matchType;
  });

  filtered = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'name': return (a.displayName || a.originalName).localeCompare(b.displayName || b.originalName);
      case 'size': return b.size - a.size;
      case 'type': return a.fileType.localeCompare(b.fileType);
      default: return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  if (files.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No hay archivos aún. Sube tu primer archivo.</p>
      </div>
    );
  }

  const backendUrl = apiUrl.replace('/api', '');

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            className="input pl-10 text-sm"
            placeholder="Buscar archivos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select
            className="input text-sm w-auto"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            {FILE_TYPES.map((t) => (
              <option key={t} value={t}>{FILE_TYPE_LABELS[t]}</option>
            ))}
          </select>
          <select
            className="input text-sm w-auto"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
          >
            <option value="date">Fecha</option>
            <option value="name">Nombre</option>
            <option value="size">Tamaño</option>
            <option value="type">Tipo</option>
          </select>
        </div>
      </div>

      <p className="text-xs text-gray-500">{filtered.length} de {files.length} archivos</p>

      {/* Files */}
      <div className="space-y-2">
        {filtered.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between rounded-xl px-4 py-3 transition-all duration-300 group animate-slide-in"
            style={{
              background: 'rgba(15, 15, 15, 0.6)',
              border: '1px solid rgba(100, 255, 218, 0.06)',
            }}
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <span className="text-2xl">{getFileIcon(file.mimeType)}</span>
              <div className="min-w-0 flex-1">
                {editingId === file.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      className="input text-sm py-1 px-2"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleRename(file.id)}
                      autoFocus
                    />
                    <button onClick={() => handleRename(file.id)} className="p-1 text-accent-green hover:text-green-400">
                      <Check className="h-4 w-4" />
                    </button>
                    <button onClick={() => setEditingId(null)} className="p-1 text-gray-500 hover:text-gray-300">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <p className="text-sm font-medium text-gray-200 truncate">
                    {sanitizeText(file.displayName || file.originalName)}
                  </p>
                )}
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{formatFileSize(file.size)}</span>
                  <span className="text-accent-cyan/40">•</span>
                  <span>{file.fileType}</span>
                  <span className="text-accent-cyan/40">•</span>
                  <span>{format(new Date(file.createdAt), "d MMM yyyy", { locale: es })}</span>
                </div>
                {file.description && (
                  <p className="text-xs text-gray-500 mt-0.5 truncate">
                    {sanitizeText(file.description)}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 ml-3 opacity-60 group-hover:opacity-100 transition-opacity">
              {!readOnly && (
                <button
                  onClick={() => startRename(file)}
                  className="p-2 text-gray-500 hover:text-accent-cyan rounded-lg hover:bg-white/5 transition-colors"
                  title="Renombrar"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              )}
              <a
                href={`${backendUrl}${file.filePath}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-500 hover:text-accent-cyan rounded-lg hover:bg-white/5 transition-colors"
                title="Ver archivo"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
              <a
                href={`${backendUrl}${file.filePath}`}
                download={file.displayName || file.originalName}
                className="p-2 text-gray-500 hover:text-accent-green rounded-lg hover:bg-white/5 transition-colors"
                title="Descargar"
              >
                <Download className="h-4 w-4" />
              </a>
              {!readOnly && (
                <button
                  onClick={() => handleDelete(file.id)}
                  className="p-2 text-gray-500 hover:text-accent-red rounded-lg hover:bg-white/5 transition-colors"
                  title="Eliminar"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

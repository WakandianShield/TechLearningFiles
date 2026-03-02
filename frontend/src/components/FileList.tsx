'use client';

import { useState } from 'react';
import {
  Trash2, Download, Eye, Pencil, Check, X, Search,
  FileText, Image, Video, Music, Code2, Table2, Archive, Presentation, File, MoreVertical,
} from 'lucide-react';
import { formatFileSize, getFileIcon } from '@/lib/utils';
import { deleteFile, renameFile } from '@/lib/api';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { sanitizeText } from '@/lib/sanitize';
import FilePreview from './FilePreview';

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
  ALL: 'Todos', PDF: 'PDF', DOCUMENT: 'Documentos', IMAGE: 'Imagenes',
  VIDEO: 'Videos', AUDIO: 'Audio', CODE: 'Codigo', SPREADSHEET: 'Hojas',
  ARCHIVE: 'Archivos', OTHER: 'Otros',
};

type SortBy = 'date' | 'name' | 'size' | 'type';

const FILE_ICON_MAP: Record<string, { icon: any; color: string; bg: string }> = {
  pdf: { icon: FileText, color: 'text-red-400', bg: 'bg-red-500/10' },
  image: { icon: Image, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  video: { icon: Video, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  audio: { icon: Music, color: 'text-pink-400', bg: 'bg-pink-500/10' },
  document: { icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  spreadsheet: { icon: Table2, color: 'text-green-400', bg: 'bg-green-500/10' },
  archive: { icon: Archive, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  presentation: { icon: Presentation, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  file: { icon: File, color: 'text-gray-400', bg: 'bg-gray-500/10' },
};

function FileIcon({ mimeType, className }: { mimeType: string; className?: string }) {
  const key = getFileIcon(mimeType);
  const config = FILE_ICON_MAP[key] || FILE_ICON_MAP.file;
  const Icon = config.icon;
  return <Icon className={`${config.color} ${className || 'h-8 w-8'}`} />;
}

export default function FileList({ files, onFileDeleted, apiUrl, readOnly }: FileListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [sortBy, setSortBy] = useState<SortBy>('date');
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<ProjectFile | null>(null);

  const handleDelete = async (fileId: string) => {
    if (!confirm('Estas seguro de eliminar este archivo?')) return;
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
    setMenuOpen(null);
  };

  const handleRename = async (fileId: string) => {
    if (!editName.trim()) return;
    try {
      await renameFile(fileId, editName.trim());
      setEditingId(null);
      onFileDeleted();
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
      <div className="text-center py-12">
        <File className="h-12 w-12 text-gray-600 mx-auto mb-3" />
        <p className="text-gray-500">No hay archivos aun. Sube tu primer archivo.</p>
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
            <option value="size">Tamano</option>
            <option value="type">Tipo</option>
          </select>
        </div>
      </div>

      <p className="text-xs text-gray-500">{filtered.length} de {files.length} archivos</p>

      {/* Grid view */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {filtered.map((file) => {
          const isImage = file.mimeType.startsWith('image/');
          const key = getFileIcon(file.mimeType);
          const iconConfig = FILE_ICON_MAP[key] || FILE_ICON_MAP.file;

          return (
            <div
              key={file.id}
              className="group relative rounded-xl overflow-hidden transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-accent-cyan/5"
              style={{
                background: 'linear-gradient(135deg, rgba(25, 25, 25, 0.9), rgba(18, 18, 18, 0.95))',
                border: '1px solid rgba(100, 255, 218, 0.06)',
              }}
              onClick={() => setMenuOpen(null)}
            >
              {/* Thumbnail / Icon area */}
              <div
                className="block cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewFile(file);
                }}
              >
                <div className={`h-32 flex items-center justify-center relative ${iconConfig.bg}`}>
                  {isImage ? (
                    <img
                      src={`${backendUrl}${file.filePath}`}
                      alt={file.displayName || file.originalName}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <FileIcon mimeType={file.mimeType} className="h-12 w-12" />
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Eye className="h-6 w-6 text-white drop-shadow-lg" />
                  </div>
                </div>
              </div>

              {/* File info */}
              <div className="p-3">
                {editingId === file.id ? (
                  <div className="flex items-center gap-1">
                    <input
                      className="input text-xs py-1 px-2 flex-1 min-w-0"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleRename(file.id);
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                    <button onClick={(e) => { e.stopPropagation(); handleRename(file.id); }} className="p-1 text-accent-green hover:text-green-400">
                      <Check className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setEditingId(null); }} className="p-1 text-gray-500 hover:text-gray-300">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <p className="text-xs font-medium text-gray-200 truncate" title={file.displayName || file.originalName}>
                    {sanitizeText(file.displayName || file.originalName)}
                  </p>
                )}
                <div className="flex items-center gap-1.5 mt-1 text-[10px] text-gray-500">
                  <span>{formatFileSize(file.size)}</span>
                  <span className="text-accent-cyan/30">|</span>
                  <span>{format(new Date(file.createdAt), "d MMM", { locale: es })}</span>
                </div>
              </div>

              {/* Actions menu */}
              {!readOnly && (
                <div className="absolute top-2 right-2 z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(menuOpen === file.id ? null : file.id);
                    }}
                    className="p-1.5 rounded-lg bg-dark-900/70 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-white hover:bg-dark-900/90 transition-all backdrop-blur-sm"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>

                  {menuOpen === file.id && (
                    <div
                      className="absolute right-0 top-9 w-40 rounded-lg py-1.5 shadow-xl z-20"
                      style={{
                        background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.98), rgba(20, 20, 20, 0.98))',
                        border: '1px solid rgba(100, 255, 218, 0.15)',
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => startRename(file)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:text-accent-cyan hover:bg-white/5 transition-colors"
                      >
                        <Pencil className="h-3.5 w-3.5" /> Renombrar
                      </button>
                      <a
                        href={`${backendUrl}${file.filePath}`}
                        download={file.displayName || file.originalName}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:text-accent-green hover:bg-white/5 transition-colors"
                        onClick={() => setMenuOpen(null)}
                      >
                        <Download className="h-3.5 w-3.5" /> Descargar
                      </a>
                      <button
                        onClick={() => { setMenuOpen(null); handleDelete(file.id); }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:text-accent-red hover:bg-white/5 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Eliminar
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Read-only download */}
              {readOnly && (
                <a
                  href={`${backendUrl}${file.filePath}`}
                  download={file.displayName || file.originalName}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-dark-900/70 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-accent-green hover:bg-dark-900/90 transition-all backdrop-blur-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Download className="h-4 w-4" />
                </a>
              )}
            </div>
          );
        })}
      </div>

      {/* File Preview Modal */}
      {previewFile && (
        <FilePreview
          file={previewFile}
          fileUrl={`${backendUrl}${previewFile.filePath}`}
          onClose={() => setPreviewFile(null)}
        />
      )}
    </div>
  );
}

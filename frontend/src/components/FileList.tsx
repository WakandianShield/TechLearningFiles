'use client';

import { useState } from 'react';
import {
  Trash2, Download, Eye, Pencil, Check, X, Search,
  FileText, Image, Video, Music, Code2, Table2, Archive, Presentation, File, MoreVertical,
} from 'lucide-react';
import { cn, formatFileSize, getFileIcon } from '@/lib/utils';
import { deleteFile, renameFile } from '@/lib/api';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { sanitizeText } from '@/lib/sanitize';
import FilePreview from './FilePreview';
import styles from './FileList.module.css';

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
  pdf: { icon: FileText, color: '#f87171', bg: styles.bgPdf },
  image: { icon: Image, color: '#34d399', bg: styles.bgImage },
  video: { icon: Video, color: '#c084fc', bg: styles.bgVideo },
  audio: { icon: Music, color: '#f472b6', bg: styles.bgAudio },
  document: { icon: FileText, color: '#60a5fa', bg: styles.bgDocument },
  spreadsheet: { icon: Table2, color: '#4ade80', bg: styles.bgSpreadsheet },
  archive: { icon: Archive, color: '#facc15', bg: styles.bgArchive },
  presentation: { icon: Presentation, color: '#fb923c', bg: styles.bgPresentation },
  file: { icon: File, color: '#9ca3af', bg: styles.bgFile },
};

function FileIcon({ mimeType, size = 32 }: { mimeType: string; size?: number }) {
  const key = getFileIcon(mimeType);
  const config = FILE_ICON_MAP[key] || FILE_ICON_MAP.file;
  const Icon = config.icon;
  return <Icon size={size} style={{ color: config.color }} />;
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
      <div className={styles.empty}>
        <File size={48} className={styles.emptyIcon} />
        <p className={styles.emptyText}>No hay archivos aun. Sube tu primer archivo.</p>
      </div>
    );
  }

  const backendUrl = apiUrl.replace('/api', '');

  return (
    <div className={styles.wrapper}>
      {/* Filter bar */}
      <div className={styles.filterBar}>
        <div className={styles.searchWrapper}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            className="input"
            placeholder="Buscar archivos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className={styles.filterGroup}>
          <select
            className="input"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            {FILE_TYPES.map((t) => (
              <option key={t} value={t}>{FILE_TYPE_LABELS[t]}</option>
            ))}
          </select>
          <select
            className="input"
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

      <p className={styles.fileCount}>{filtered.length} de {files.length} archivos</p>

      {/* Grid view */}
      <div className={styles.grid}>
        {filtered.map((file) => {
          const isImage = file.mimeType.startsWith('image/');
          const key = getFileIcon(file.mimeType);
          const iconConfig = FILE_ICON_MAP[key] || FILE_ICON_MAP.file;

          return (
            <div
              key={file.id}
              className={styles.fileCard}
              onClick={() => setMenuOpen(null)}
            >
              {/* Thumbnail / Icon area */}
              <div
                className={styles.thumbnail}
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewFile(file);
                }}
              >
                <div className={cn(styles.thumbnailArea, iconConfig.bg)}>
                  {isImage ? (
                    <img
                      src={`${backendUrl}${file.filePath}`}
                      alt={file.displayName || file.originalName}
                      className={styles.thumbnailImg}
                      loading="lazy"
                    />
                  ) : (
                    <FileIcon mimeType={file.mimeType} size={48} />
                  )}
                  {/* Hover overlay */}
                  <div className={styles.hoverOverlay}>
                    <Eye size={24} className={styles.hoverIcon} />
                  </div>
                </div>
              </div>

              {/* File info */}
              <div className={styles.fileInfo}>
                {editingId === file.id ? (
                  <div className={styles.renameForm}>
                    <input
                      className="input"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleRename(file.id);
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                    <button onClick={(e) => { e.stopPropagation(); handleRename(file.id); }} className={styles.renameOk}>
                      <Check size={14} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setEditingId(null); }} className={styles.renameCancel}>
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <p className={styles.fileName} title={file.displayName || file.originalName}>
                    {sanitizeText(file.displayName || file.originalName)}
                  </p>
                )}
                <div className={styles.fileMeta}>
                  <span>{formatFileSize(file.size)}</span>
                  <span className={styles.metaSep}>|</span>
                  <span>{format(new Date(file.createdAt), "d MMM", { locale: es })}</span>
                </div>
              </div>

              {/* Actions menu */}
              {!readOnly && (
                <div className={styles.menuBtn}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(menuOpen === file.id ? null : file.id);
                    }}
                    className={styles.menuToggle}
                  >
                    <MoreVertical size={16} />
                  </button>

                  {menuOpen === file.id && (
                    <div
                      className={styles.menu}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => startRename(file)}
                        className={cn(styles.menuItem, styles.menuItemRename)}
                      >
                        <Pencil size={14} /> Renombrar
                      </button>
                      <a
                        href={`${backendUrl}${file.filePath}`}
                        download={file.displayName || file.originalName}
                        className={cn(styles.menuItem, styles.menuItemDownload)}
                        onClick={() => setMenuOpen(null)}
                      >
                        <Download size={14} /> Descargar
                      </a>
                      <button
                        onClick={() => { setMenuOpen(null); handleDelete(file.id); }}
                        className={cn(styles.menuItem, styles.menuItemDelete)}
                      >
                        <Trash2 size={14} /> Eliminar
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
                  className={styles.readOnlyDownload}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Download size={16} />
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

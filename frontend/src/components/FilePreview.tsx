'use client';

import { useEffect, useCallback, useState, useMemo } from 'react';
import {
  X, Download, Maximize2, FileText, Image, Video, Music, Code2, Table2,
  Archive, Presentation, File, Loader2, ChevronLeft,
  FolderOpen, FileIcon
} from 'lucide-react';
import { cn, formatFileSize, getFileIcon } from '@/lib/utils';
import styles from './FilePreview.module.css';

interface FilePreviewProps {
  file: {
    id: string;
    originalName: string;
    displayName: string | null;
    fileName: string;
    filePath: string;
    mimeType: string;
    size: number;
    fileType: string;
  };
  fileUrl: string;
  onClose: () => void;
}

const ICON_MAP: Record<string, { icon: any; color: string }> = {
  pdf: { icon: FileText, color: '#f87171' },
  image: { icon: Image, color: '#34d399' },
  video: { icon: Video, color: '#c084fc' },
  audio: { icon: Music, color: '#f472b6' },
  document: { icon: FileText, color: '#60a5fa' },
  code: { icon: Code2, color: '#22d3ee' },
  spreadsheet: { icon: Table2, color: '#4ade80' },
  archive: { icon: Archive, color: '#facc15' },
  presentation: { icon: Presentation, color: '#fb923c' },
  file: { icon: File, color: '#9ca3af' },
};

const GOOGLE_VIEWER_EXTENSIONS = [
  '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
  '.rtf', '.csv', '.tsv',
];

const TEXT_MIMES = [
  'text/', 'application/json', 'application/xml', 'application/javascript',
  'application/typescript', 'application/x-python', 'application/x-sh',
  'application/x-yaml', 'application/x-toml',
];

const EXT_LANG_MAP: Record<string, string> = {
  '.js': 'javascript', '.jsx': 'javascript', '.ts': 'typescript', '.tsx': 'typescript',
  '.py': 'python', '.rb': 'ruby', '.go': 'go', '.rs': 'rust', '.java': 'java',
  '.c': 'c', '.cpp': 'cpp', '.h': 'c', '.hpp': 'cpp', '.cs': 'csharp',
  '.html': 'html', '.css': 'css', '.scss': 'scss', '.less': 'less',
  '.json': 'json', '.xml': 'xml', '.yaml': 'yaml', '.yml': 'yaml',
  '.md': 'markdown', '.sql': 'sql', '.sh': 'bash', '.bash': 'bash',
  '.php': 'php', '.swift': 'swift', '.kt': 'kotlin', '.dart': 'dart',
  '.toml': 'toml', '.ini': 'ini', '.env': 'bash', '.dockerfile': 'dockerfile',
};

function getExtension(name: string): string {
  const dot = name.lastIndexOf('.');
  return dot >= 0 ? name.slice(dot).toLowerCase() : '';
}
function isTextType(mime: string): boolean {
  return TEXT_MIMES.some((t) => mime.includes(t));
}
function isGoogleViewerType(name: string): boolean {
  return GOOGLE_VIEWER_EXTENSIONS.includes(getExtension(name));
}
function getLanguage(name: string): string {
  return EXT_LANG_MAP[getExtension(name)] || 'plaintext';
}

/* ========== ZIP BROWSER SUB-COMPONENT ========== */
interface ZipEntry { name: string; dir: boolean; size: number; }

function ZipBrowser({ fileUrl, fileName }: { fileUrl: string; fileName: string }) {
  const [entries, setEntries] = useState<ZipEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const JSZip = (await import('jszip')).default;
        const res = await fetch(fileUrl);
        if (!res.ok) throw new Error('fetch failed');
        const buf = await res.arrayBuffer();
        const zip = await JSZip.loadAsync(buf);
        const items: ZipEntry[] = [];
        zip.forEach((relativePath, zipEntry) => {
          items.push({
            name: relativePath,
            dir: zipEntry.dir,
            size: (zipEntry as any)._data?.uncompressedSize || 0,
          });
        });
        if (!cancelled) setEntries(items);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [fileUrl]);

  const currentEntries = useMemo(() => {
    const prefix = currentPath;
    const folders = new Set<string>();
    const files: ZipEntry[] = [];
    for (const entry of entries) {
      if (!entry.name.startsWith(prefix)) continue;
      const rest = entry.name.slice(prefix.length);
      if (!rest) continue;
      const slashIdx = rest.indexOf('/');
      if (slashIdx >= 0 && slashIdx < rest.length - 1) {
        folders.add(rest.slice(0, slashIdx + 1));
      } else if (entry.dir) {
        folders.add(rest);
      } else {
        files.push(entry);
      }
    }
    const folderEntries: ZipEntry[] = Array.from(folders)
      .sort()
      .map((f) => ({ name: prefix + f, dir: true, size: 0 }));
    const sortedFiles = files.sort((a, b) => a.name.localeCompare(b.name));
    return [...folderEntries, ...sortedFiles];
  }, [entries, currentPath]);

  const breadcrumbs = useMemo(() => {
    const parts = currentPath.split('/').filter(Boolean);
    const crumbs = [{ label: fileName, path: '' }];
    let acc = '';
    for (const part of parts) {
      acc += part + '/';
      crumbs.push({ label: part, path: acc });
    }
    return crumbs;
  }, [currentPath, fileName]);

  if (loading)
    return (
      <div className={styles.loadingCenter}>
        <Loader2 size={32} style={{ color: 'var(--accent-yellow)' }} className="animate-spin" />
        <p className={styles.loadingText}>Leyendo archivo ZIP...</p>
      </div>
    );
  if (error)
    return (
      <div className={styles.loadingCenter}>
        <Archive size={48} style={{ color: '#facc15' }} />
        <p className={styles.loadingText}>No se pudo leer el archivo ZIP.</p>
      </div>
    );

  return (
    <div className={styles.zipBrowser}>
      <div className={styles.zipBreadcrumb}>
        {breadcrumbs.map((crumb, i) => (
          <span key={crumb.path}>
            {i > 0 && <span className={styles.zipCrumbSep}> / </span>}
            {i < breadcrumbs.length - 1 ? (
              <span className={styles.zipCrumb} onClick={() => setCurrentPath(crumb.path)}>
                {crumb.label}
              </span>
            ) : (
              <span className={styles.zipCrumbCurrent}>{crumb.label}</span>
            )}
          </span>
        ))}
      </div>
      {currentPath && (
        <div
          className={styles.zipItem}
          onClick={() => {
            const parts = currentPath.slice(0, -1).split('/');
            parts.pop();
            setCurrentPath(parts.length ? parts.join('/') + '/' : '');
          }}
        >
          <ChevronLeft size={16} className={styles.zipItemIcon} style={{ color: 'var(--gray-500)' }} />
          <span className={styles.zipItemName} style={{ color: 'var(--gray-400)' }}>..</span>
        </div>
      )}
      <ul className={styles.zipList}>
        {currentEntries.length === 0 && <li className={styles.zipEmpty}>Carpeta vacía</li>}
        {currentEntries.map((entry) => {
          const displayName = entry.name.slice(currentPath.length).replace(/\/$/, '');
          return (
            <li
              key={entry.name}
              className={styles.zipItem}
              onClick={() => {
                if (entry.dir) setCurrentPath(entry.name);
              }}
            >
              {entry.dir ? (
                <FolderOpen size={18} className={styles.zipItemIcon} style={{ color: '#facc15' }} />
              ) : (
                <FileIcon size={18} className={styles.zipItemIcon} style={{ color: 'var(--gray-400)' }} />
              )}
              <span className={styles.zipItemName}>{displayName}</span>
              {!entry.dir && entry.size > 0 && (
                <span className={styles.zipItemSize}>{formatFileSize(entry.size)}</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ========== CODE IDE PREVIEW SUB-COMPONENT ========== */
function CodeIdePreview({ fileUrl, fileName }: { fileUrl: string; fileName: string }) {
  const [content, setContent] = useState<string | null>(null);
  const [highlighted, setHighlighted] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const lang = getLanguage(fileName);

  useEffect(() => {
    let cancelled = false;
    fetch(fileUrl)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.text();
      })
      .then((text) => {
        const trimmed = text.length > 512000 ? text.slice(0, 512000) + '\n\n... (truncated)' : text;
        if (!cancelled) setContent(trimmed);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [fileUrl]);

  useEffect(() => {
    if (!content) return;
    (async () => {
      try {
        const hljs = (await import('highlight.js/lib/core')).default;
        try {
          const langModule = await import(
            /* webpackInclude: /\.js$/ */
            `highlight.js/lib/languages/${lang}`
          );
          hljs.registerLanguage(lang, langModule.default);
          const result = hljs.highlight(content, { language: lang });
          setHighlighted(result.value);
        } catch {
          // Language not available — escape HTML and show plain
          setHighlighted(
            content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'),
          );
        }
      } catch {
        setHighlighted(
          content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'),
        );
      }
    })();
  }, [content, lang]);

  const lineCount = content ? content.split('\n').length : 0;

  if (loading)
    return (
      <div className={styles.loadingCenter}>
        <Loader2 size={32} style={{ color: '#22d3ee' }} className="animate-spin" />
        <p className={styles.loadingText}>Cargando código...</p>
      </div>
    );
  if (error)
    return (
      <div className={styles.loadingCenter}>
        <Code2 size={48} style={{ color: '#22d3ee' }} />
        <p className={styles.loadingText}>No se pudo cargar el archivo.</p>
      </div>
    );

  return (
    <div className={styles.codeIde}>
      <div className={styles.codeHeader}>
        <span className={styles.codeFileName}>{fileName}</span>
        <span className={styles.codeLang}>{lang}</span>
      </div>
      <div className={styles.codeBody}>
        <div className={styles.lineNumbers}>
          {Array.from({ length: lineCount }, (_, i) => (
            <span key={i} className={styles.lineNum}>
              {i + 1}
            </span>
          ))}
        </div>
        <div className={styles.codeContent}>
          <pre dangerouslySetInnerHTML={{ __html: highlighted || '' }} />
        </div>
      </div>
    </div>
  );
}

/* ========== MAIN FILE PREVIEW ========== */
export default function FilePreview({ file, fileUrl, onClose }: FilePreviewProps) {
  const fileName = file.displayName || file.originalName;
  const mime = file.mimeType;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  const isImage = mime.startsWith('image/');
  const isVideo = mime.startsWith('video/');
  const isAudio = mime.startsWith('audio/');
  const isPdf = mime === 'application/pdf';
  const isArchive =
    mime.includes('zip') || mime.includes('compressed') || mime.includes('archive');
  const isText = isTextType(mime);
  const isOfficeDoc = isGoogleViewerType(file.originalName);
  const isPresentation =
    getExtension(file.originalName) === '.pptx' || getExtension(file.originalName) === '.ppt';

  const iconKey = getFileIcon(mime);
  const iconConfig = ICON_MAP[iconKey] || ICON_MAP.file;
  const IconComponent = iconConfig.icon;

  const renderContent = () => {
    /* Images */
    if (isImage) {
      return <img src={fileUrl} alt={fileName} className={styles.imagePreview} />;
    }

    /* Video */
    if (isVideo) {
      return (
        <video src={fileUrl} controls autoPlay className={styles.videoPreview}>
          Tu navegador no soporta la reproducción de video.
        </video>
      );
    }

    /* Audio */
    if (isAudio) {
      return (
        <div className={styles.audioWrapper}>
          <div className={styles.audioIconBox}>
            <Music size={64} style={{ color: '#f472b6' }} />
          </div>
          <p className={styles.audioName}>{fileName}</p>
          <audio src={fileUrl} controls autoPlay className={styles.audioPlayer} />
        </div>
      );
    }

    /* PDF — native browser viewer with toolbar */
    if (isPdf) {
      return (
        <div className={styles.pdfWrapper}>
          <iframe
            src={`${fileUrl}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`}
            className={styles.iframePreview}
            title={fileName}
            style={{ flex: 1 }}
          />
        </div>
      );
    }

    /* ZIP / Archive — tree browser */
    if (isArchive) {
      return <ZipBrowser fileUrl={fileUrl} fileName={fileName} />;
    }

    /* Code / Text — IDE preview */
    if (isText) {
      return <CodeIdePreview fileUrl={fileUrl} fileName={fileName} />;
    }

    /* Presentations — Google Docs Viewer (slide mode) */
    if (isPresentation) {
      const viewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`;
      return (
        <iframe
          src={viewerUrl}
          className={cn(styles.iframePreview, styles.iframeWhite)}
          title={fileName}
        />
      );
    }

    /* Office documents (Word, Excel) via Google Docs Viewer */
    if (isOfficeDoc) {
      const viewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`;
      return (
        <iframe
          src={viewerUrl}
          className={cn(styles.iframePreview, styles.iframeWhite)}
          title={fileName}
        />
      );
    }

    /* Fallback */
    return (
      <div className={styles.fallback}>
        <div className={styles.fallbackIconBox}>
          <IconComponent size={48} style={{ color: iconConfig.color }} />
        </div>
        <div className={styles.fallbackInfo}>
          <p className={styles.fallbackName}>{fileName}</p>
          <p className={styles.fallbackSize}>{formatFileSize(file.size)}</p>
          <p className={styles.fallbackMime}>{file.mimeType}</p>
        </div>
        <p className={styles.fallbackHint}>
          No hay vista previa disponible. Puedes descargar o abrir en una nueva pestaña.
        </p>
        <div className={styles.fallbackActions}>
          <a
            href={fileUrl}
            download={fileName}
            className="btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Download size={16} /> Descargar
          </a>
          <a href={fileUrl} target="_blank" rel="noopener noreferrer" className={styles.btnNewTab}>
            <Maximize2 size={16} /> Abrir
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.backdrop} />
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerInfo}>
            <IconComponent
              size={20}
              style={{ color: iconConfig.color }}
              className={styles.headerIcon}
            />
            <div className={styles.headerText}>
              <h3 className={styles.headerTitle}>{fileName}</h3>
              <p className={styles.headerMeta}>
                {formatFileSize(file.size)} — {file.mimeType}
              </p>
            </div>
          </div>
          <div className={styles.headerActions}>
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.headerBtn}
              title="Abrir en pestaña nueva"
            >
              <Maximize2 size={16} />
            </a>
            <a
              href={fileUrl}
              download={fileName}
              className={cn(styles.headerBtn, styles.headerBtnGreen)}
              title="Descargar"
            >
              <Download size={16} />
            </a>
            <button onClick={onClose} className={styles.headerBtn}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className={styles.content}>{renderContent()}</div>
      </div>
    </div>
  );
}

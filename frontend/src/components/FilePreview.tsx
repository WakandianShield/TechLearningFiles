'use client';

import { useEffect, useCallback, useState } from 'react';
import { X, Download, Maximize2, FileText, Image, Video, Music, Code2, Table2, Archive, Presentation, File, Loader2 } from 'lucide-react';
import { formatFileSize, getFileIcon } from '@/lib/utils';

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
  pdf: { icon: FileText, color: 'text-red-400' },
  image: { icon: Image, color: 'text-emerald-400' },
  video: { icon: Video, color: 'text-purple-400' },
  audio: { icon: Music, color: 'text-pink-400' },
  document: { icon: FileText, color: 'text-blue-400' },
  code: { icon: Code2, color: 'text-cyan-400' },
  spreadsheet: { icon: Table2, color: 'text-green-400' },
  archive: { icon: Archive, color: 'text-yellow-400' },
  presentation: { icon: Presentation, color: 'text-orange-400' },
  file: { icon: File, color: 'text-gray-400' },
};

// Extensions that Google Docs Viewer can render
const GOOGLE_VIEWER_EXTENSIONS = [
  '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
  '.rtf', '.csv', '.tsv',
];

// MIME types we can render as text/code
const TEXT_MIMES = [
  'text/', 'application/json', 'application/xml', 'application/javascript',
  'application/typescript', 'application/x-python', 'application/x-sh',
  'application/x-yaml', 'application/x-toml',
];

function getExtension(name: string): string {
  const dot = name.lastIndexOf('.');
  return dot >= 0 ? name.slice(dot).toLowerCase() : '';
}

function isTextType(mime: string): boolean {
  return TEXT_MIMES.some((t) => mime.includes(t));
}

function isGoogleViewerType(name: string): boolean {
  const ext = getExtension(name);
  return GOOGLE_VIEWER_EXTENSIONS.includes(ext);
}

export default function FilePreview({ file, fileUrl, onClose }: FilePreviewProps) {
  const fileName = file.displayName || file.originalName;
  const mime = file.mimeType;
  const [textContent, setTextContent] = useState<string | null>(null);
  const [textLoading, setTextLoading] = useState(false);
  const [textError, setTextError] = useState(false);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

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
  const isText = isTextType(mime);
  const isOfficeDoc = isGoogleViewerType(file.originalName);

  // Fetch text content for code/text files
  useEffect(() => {
    if (isText && !textContent && !textLoading) {
      setTextLoading(true);
      fetch(fileUrl)
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch');
          return res.text();
        })
        .then((text) => {
          // Limit to 500KB of text for display
          setTextContent(text.length > 512000 ? text.slice(0, 512000) + '\n\n... (truncated)' : text);
        })
        .catch(() => setTextError(true))
        .finally(() => setTextLoading(false));
    }
  }, [isText, fileUrl, textContent, textLoading]);

  const iconKey = getFileIcon(mime);
  const iconConfig = ICON_MAP[iconKey] || ICON_MAP.file;
  const IconComponent = iconConfig.icon;

  const renderContent = () => {
    // Images
    if (isImage) {
      return (
        <img
          src={fileUrl}
          alt={fileName}
          className="max-w-full max-h-[75vh] object-contain rounded-lg"
        />
      );
    }

    // Video
    if (isVideo) {
      return (
        <video
          src={fileUrl}
          controls
          autoPlay
          className="max-w-full max-h-[75vh] rounded-lg"
        >
          Your browser does not support the video tag.
        </video>
      );
    }

    // Audio
    if (isAudio) {
      return (
        <div className="flex flex-col items-center gap-6 py-8">
          <div className="w-32 h-32 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
            <Music className="h-16 w-16 text-pink-400" />
          </div>
          <p className="text-sm text-gray-300">{fileName}</p>
          <audio src={fileUrl} controls autoPlay className="w-full max-w-md" />
        </div>
      );
    }

    // PDF
    if (isPdf) {
      return (
        <iframe
          src={fileUrl}
          className="w-full h-[75vh] rounded-lg border border-white/5"
          title={fileName}
        />
      );
    }

    // Text / Code files
    if (isText) {
      if (textLoading) {
        return (
          <div className="flex flex-col items-center gap-4 py-12">
            <Loader2 className="h-8 w-8 text-accent-green animate-spin" />
            <p className="text-sm text-gray-400">Loading file content...</p>
          </div>
        );
      }
      if (textError) {
        return (
          <div className="flex flex-col items-center gap-4 py-12">
            <Code2 className="h-12 w-12 text-cyan-400" />
            <p className="text-sm text-gray-400">Could not load text content.</p>
            <a href={fileUrl} download={fileName} className="btn-primary flex items-center gap-2 text-sm">
              <Download className="h-4 w-4" /> Download File
            </a>
          </div>
        );
      }
      return (
        <div className="w-full max-h-[75vh] overflow-auto rounded-lg border border-white/5">
          <pre
            className="p-4 text-sm text-gray-200 font-mono leading-relaxed whitespace-pre-wrap break-words"
            style={{ background: 'rgba(10, 10, 10, 0.8)', tabSize: 2 }}
          >
            {textContent}
          </pre>
        </div>
      );
    }

    // Office documents (Word, Excel, PowerPoint) via Google Docs Viewer
    if (isOfficeDoc) {
      const viewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`;
      return (
        <iframe
          src={viewerUrl}
          className="w-full h-[75vh] rounded-lg border border-white/5 bg-white"
          title={fileName}
        />
      );
    }

    // Fallback: show file info + download
    return (
      <div className="flex flex-col items-center gap-5 py-12">
        <div className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
          <IconComponent className={`h-12 w-12 ${iconConfig.color}`} />
        </div>
        <div className="text-center">
          <p className="text-gray-200 font-medium">{fileName}</p>
          <p className="text-sm text-gray-500 mt-1">{formatFileSize(file.size)}</p>
          <p className="text-xs text-gray-600 mt-0.5">{file.mimeType}</p>
        </div>
        <p className="text-sm text-gray-500">
          No preview available for this file type. You can download or open it in a new tab.
        </p>
        <div className="flex gap-3">
          <a
            href={fileUrl}
            download={fileName}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <Download className="h-4 w-4" /> Download
          </a>
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary flex items-center gap-2 text-sm"
            style={{ background: 'rgba(100, 255, 218, 0.1)', color: '#64ffda' }}
          >
            <Maximize2 className="h-4 w-4" /> Open in New Tab
          </a>
        </div>
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-5xl mx-4 max-h-[90vh] flex flex-col rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #141414, #0d0d0d)',
          border: '1px solid rgba(100, 255, 218, 0.1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5">
          <div className="flex items-center gap-3 min-w-0">
            <IconComponent className={`h-5 w-5 flex-shrink-0 ${iconConfig.color}`} />
            <div className="min-w-0">
              <h3 className="text-sm font-medium text-gray-100 truncate">{fileName}</h3>
              <p className="text-[11px] text-gray-500">{formatFileSize(file.size)} -- {file.mimeType}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              title="Open in new tab"
            >
              <Maximize2 className="h-4 w-4" />
            </a>
            <a
              href={fileUrl}
              download={fileName}
              className="p-2 rounded-lg text-gray-400 hover:text-accent-green hover:bg-white/5 transition-colors"
              title="Download"
            >
              <Download className="h-4 w-4" />
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto flex items-center justify-center p-4 min-h-[300px]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

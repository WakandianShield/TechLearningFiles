import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getFileIcon(mimeType: string): string {
  if (mimeType === 'application/pdf') return 'pdf';
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.includes('word') || mimeType.includes('document')) return 'document';
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'spreadsheet';
  if (mimeType.includes('zip') || mimeType.includes('compressed')) return 'archive';
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'presentation';
  return 'file';
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    PROGRAMMING: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
    MATH: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
    SCIENCE: 'bg-green-500/20 text-green-300 border border-green-500/30',
    DESIGN: 'bg-pink-500/20 text-pink-300 border border-pink-500/30',
    WRITING: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
    RESEARCH: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30',
    PRESENTATION: 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
    LAB: 'bg-teal-500/20 text-teal-300 border border-teal-500/30',
    OTHER: 'bg-gray-500/20 text-gray-300 border border-gray-500/30',
  };
  return colors[category] || colors.OTHER;
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    PROGRAMMING: 'Programación',
    MATH: 'Matemáticas',
    SCIENCE: 'Ciencias',
    DESIGN: 'Diseño',
    WRITING: 'Escritura',
    RESEARCH: 'Investigación',
    PRESENTATION: 'Presentación',
    LAB: 'Laboratorio',
    OTHER: 'Otros',
  };
  return labels[category] || category;
}

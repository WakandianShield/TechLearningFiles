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
  if (mimeType === 'application/pdf') return '📄';
  if (mimeType.startsWith('image/')) return '🖼️';
  if (mimeType.startsWith('video/')) return '🎬';
  if (mimeType.startsWith('audio/')) return '🎵';
  if (mimeType.includes('word') || mimeType.includes('document')) return '📝';
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return '📊';
  if (mimeType.includes('zip') || mimeType.includes('compressed')) return '📦';
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return '📽️';
  return '📎';
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    PROGRAMMING: 'bg-blue-100 text-blue-800',
    MATH: 'bg-purple-100 text-purple-800',
    SCIENCE: 'bg-green-100 text-green-800',
    DESIGN: 'bg-pink-100 text-pink-800',
    WRITING: 'bg-yellow-100 text-yellow-800',
    RESEARCH: 'bg-indigo-100 text-indigo-800',
    PRESENTATION: 'bg-orange-100 text-orange-800',
    LAB: 'bg-teal-100 text-teal-800',
    OTHER: 'bg-gray-100 text-gray-800',
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

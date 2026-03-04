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
    PROGRAMMING: 'badge-programming',
    MATH: 'badge-math',
    SCIENCE: 'badge-science',
    DESIGN: 'badge-design',
    WRITING: 'badge-writing',
    RESEARCH: 'badge-research',
    PRESENTATION: 'badge-presentation',
    LAB: 'badge-lab',
    OTHER: 'badge-other',
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

import Link from 'next/link';
import { FolderOpen, Pin, Calendar, Tag, FileIcon } from 'lucide-react';
import { getCategoryColor, getCategoryLabel, sanitizeText } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    category: string;
    tags: string[];
    semester: string | null;
    subject: string | null;
    pinned: boolean;
    createdAt: string;
    _count?: { files: number };
  };
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/dashboard/projects/${project.id}`}>
      <div className="card p-5 h-full flex flex-col hover:border-primary-300 transition-colors">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-primary-500" />
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getCategoryColor(project.category)}`}>
              {getCategoryLabel(project.category)}
            </span>
          </div>
          {project.pinned && <Pin className="h-4 w-4 text-amber-500" />}
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
          {project.title}
        </h3>

        {project.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {project.description}
          </p>
        )}

        <div className="mt-auto pt-3 border-t border-gray-100 space-y-1.5">
          {project.subject && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Tag className="h-3 w-3" />
              <span>{project.subject}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3 w-3" />
              <span>{format(new Date(project.createdAt), "d MMM yyyy", { locale: es })}</span>
            </div>
            {project._count && (
              <div className="flex items-center gap-1">
                <FileIcon className="h-3 w-3" />
                <span>{project._count.files} archivo(s)</span>
              </div>
            )}
          </div>
          {project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {project.tags.slice(0, 4).map((tag) => (
                <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

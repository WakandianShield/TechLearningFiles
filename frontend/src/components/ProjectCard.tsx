import Link from 'next/link';
import { FolderOpen, Pin, Calendar, Tag, FileIcon, Eye, EyeOff } from 'lucide-react';
import { getCategoryColor, getCategoryLabel } from '@/lib/utils';
import { sanitizeText } from '@/lib/sanitize';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    category: string;
    visibility?: string;
    tags: string[];
    semester: string | null;
    subject: string | null;
    pinned: boolean;
    createdAt: string;
    _count?: { files: number };
    author?: { id: string; name: string; avatar?: string | null };
  };
  isPublic?: boolean;
}

export default function ProjectCard({ project, isPublic }: ProjectCardProps) {
  const href = isPublic ? `/project/${project.id}` : `/dashboard/projects/${project.id}`;

  return (
    <Link href={href}>
      <div className="card p-5 h-full flex flex-col group hover:border-accent-cyan/30 transition-all duration-400">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-accent-cyan/70 group-hover:text-accent-cyan transition-colors" />
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getCategoryColor(project.category)}`}>
              {getCategoryLabel(project.category)}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {project.visibility === 'PRIVATE' && (
              <EyeOff className="h-3.5 w-3.5 text-gray-500" />
            )}
            {project.visibility === 'PUBLIC' && (
              <Eye className="h-3.5 w-3.5 text-accent-green/70" />
            )}
            {project.pinned && <Pin className="h-4 w-4 text-accent-yellow" />}
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-100 mb-1 line-clamp-2 group-hover:text-accent-cyan transition-colors">
          {project.title}
        </h3>

        {project.description && (
          <p className="text-sm text-gray-400 mb-3 line-clamp-2">
            {project.description}
          </p>
        )}

        {isPublic && project.author && (
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 rounded-full bg-accent-cyan/20 flex items-center justify-center text-xs text-accent-cyan">
              {project.author.name.charAt(0)}
            </div>
            <span className="text-xs text-gray-400">{project.author.name}</span>
          </div>
        )}

        <div className="mt-auto pt-3 border-t border-white/5 space-y-1.5">
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
                <span key={tag} className="text-xs bg-white/5 text-gray-400 px-2 py-0.5 rounded border border-white/10">
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

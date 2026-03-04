import Link from 'next/link';
import { FolderOpen, Pin, Calendar, Tag, FileIcon, Eye, EyeOff } from 'lucide-react';
import { cn, getCategoryColor, getCategoryLabel } from '@/lib/utils';
import { sanitizeText } from '@/lib/sanitize';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import styles from './ProjectCard.module.css';

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
      <div className={cn('card', styles.card)}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <FolderOpen size={20} className={styles.folderIcon} />
            <span className={cn(styles.badge, getCategoryColor(project.category))}>
              {getCategoryLabel(project.category)}
            </span>
          </div>
          <div className={styles.icons}>
            {project.visibility === 'PRIVATE' && (
              <EyeOff size={14} className={styles.eyeOffIcon} />
            )}
            {project.visibility === 'PUBLIC' && (
              <Eye size={14} className={styles.eyeOnIcon} />
            )}
            {project.pinned && <Pin size={16} className={styles.pinIcon} />}
          </div>
        </div>

        <h3 className={styles.title}>
          {project.title}
        </h3>

        {project.description && (
          <p className={styles.description}>
            {project.description}
          </p>
        )}

        {isPublic && project.author && (
          <div className={styles.author}>
            <div className={styles.authorAvatar}>
              {project.author.name.charAt(0)}
            </div>
            <span className={styles.authorName}>{project.author.name}</span>
          </div>
        )}

        <div className={styles.meta}>
          {project.subject && (
            <div className={styles.metaRow}>
              <Tag size={12} />
              <span>{project.subject}</span>
            </div>
          )}
          <div className={styles.metaSpaced}>
            <div className={styles.metaRow}>
              <Calendar size={12} />
              <span>{format(new Date(project.createdAt), "d MMM yyyy", { locale: es })}</span>
            </div>
            {project._count && (
              <div className={styles.metaRow}>
                <FileIcon size={12} />
                <span>{project._count.files} archivo(s)</span>
              </div>
            )}
          </div>
          {project.tags.length > 0 && (
            <div className={styles.tags}>
              {project.tags.slice(0, 4).map((tag) => (
                <span key={tag} className={styles.tag}>
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

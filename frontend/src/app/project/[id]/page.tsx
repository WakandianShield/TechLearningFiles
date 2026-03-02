'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getPublicProject } from '@/lib/api';
import FileList from '@/components/FileList';
import { sanitizeText } from '@/lib/sanitize';
import { getCategoryColor, getCategoryLabel } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowLeft, Calendar, Tag, BookOpen, User, FolderOpen } from 'lucide-react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export default function PublicProjectPage() {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await getPublicProject(id as string);
        setProject(res.data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent-cyan"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="text-center py-20">
        <FolderOpen className="h-12 w-12 text-gray-600 mx-auto mb-3" />
        <h2 className="text-xl font-semibold text-gray-300 mb-2">Proyecto no encontrado</h2>
        <p className="text-gray-500 mb-4">Este proyecto no existe o es privado.</p>
        <Link href="/explore" className="btn-primary inline-block">
          Explorar proyectos
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Back */}
      <Link
        href="/explore"
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-accent-cyan transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a Explorar
      </Link>

      {/* Project header */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getCategoryColor(project.category)}`}>
            {getCategoryLabel(project.category)}
          </span>
        </div>

        <h1 className="text-2xl font-bold text-gray-100">{sanitizeText(project.title)}</h1>
        {project.description && (
          <p className="text-gray-400 mt-2">{sanitizeText(project.description)}</p>
        )}

        {/* Author */}
        {project.author && (
          <Link
            href={`/profile/${project.author.id}`}
            className="inline-flex items-center gap-2 mt-4 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-accent-cyan/30 transition-all group"
          >
            <div className="w-8 h-8 rounded-full bg-dark-700 flex items-center justify-center overflow-hidden">
              {project.author.avatar ? (
                <img src={`${API_URL}/users/avatar/${project.author.avatar}`} alt="" className="w-full h-full object-cover" />
              ) : (
                <User className="h-4 w-4 text-gray-500" />
              )}
            </div>
            <span className="text-sm text-gray-300 group-hover:text-accent-cyan transition-colors">
              {project.author.name}
            </span>
          </Link>
        )}

        <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500">
          {project.subject && (
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              <span>{project.subject}</span>
            </div>
          )}
          {project.semester && (
            <div className="flex items-center gap-1.5">
              <Tag className="h-4 w-4" />
              <span>Semestre {project.semester}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(project.createdAt), "d 'de' MMMM, yyyy", { locale: es })}</span>
          </div>
        </div>

        {project.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {project.tags.map((tag: string) => (
              <span key={tag} className="text-xs bg-white/5 text-gray-400 px-2 py-0.5 rounded border border-white/10">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Files */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-100 mb-4">
          Archivos ({project.files?.length || 0})
        </h2>
        <FileList
          files={project.files || []}
          onFileDeleted={() => {}}
          apiUrl={API_URL}
          readOnly
        />
      </div>
    </div>
  );
}

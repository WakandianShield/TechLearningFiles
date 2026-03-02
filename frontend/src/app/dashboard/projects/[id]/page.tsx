'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getProject, deleteProject, togglePinProject, updateProject } from '@/lib/api';
import FileUploader from '@/components/FileUploader';
import FileList from '@/components/FileList';
import { sanitizeText } from '@/lib/sanitize';
import { getCategoryColor, getCategoryLabel } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowLeft, Trash2, Pin, PinOff, Calendar, Tag, BookOpen, Eye, EyeOff, Globe } from 'lucide-react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchProject = async () => {
    try {
      const res = await getProject(id as string);
      setProject(res.data);
    } catch (error) {
      console.error('Error:', error);
      router.push('/dashboard/projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de eliminar este proyecto y todos sus archivos?')) return;
    try {
      await deleteProject(id as string);
      router.push('/dashboard/projects');
    } catch (error) {
      alert('Error al eliminar el proyecto');
    }
  };

  const handleTogglePin = async () => {
    try {
      await togglePinProject(id as string);
      fetchProject();
    } catch (error) {
      alert('Error al cambiar pin');
    }
  };

  const handleToggleVisibility = async () => {
    try {
      const newVisibility = project.visibility === 'PUBLIC' ? 'PRIVATE' : 'PUBLIC';
      await updateProject(id as string, { visibility: newVisibility });
      fetchProject();
    } catch (error) {
      alert('Error al cambiar visibilidad');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent-cyan"></div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Back button */}
      <Link
        href="/dashboard/projects"
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-accent-cyan transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a proyectos
      </Link>

      {/* Project header */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getCategoryColor(project.category)}`}>
                {getCategoryLabel(project.category)}
              </span>
              {project.pinned && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-accent-yellow/10 text-accent-yellow border border-accent-yellow/20">
                  Fijado
                </span>
              )}
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                project.visibility === 'PUBLIC'
                  ? 'bg-accent-green/10 text-accent-green border border-accent-green/20'
                  : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
              }`}>
                {project.visibility === 'PUBLIC' ? 'Público' : 'Privado'}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-100">{sanitizeText(project.title)}</h1>
            {project.description && (
              <p className="text-gray-400 mt-2">{sanitizeText(project.description)}</p>
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

          <div className="flex gap-2 flex-wrap">
            <button onClick={handleToggleVisibility} className="btn-secondary flex items-center gap-2 text-sm">
              {project.visibility === 'PUBLIC' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {project.visibility === 'PUBLIC' ? 'Hacer Privado' : 'Hacer Público'}
            </button>
            <button onClick={handleTogglePin} className="btn-secondary flex items-center gap-2 text-sm">
              {project.pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
              {project.pinned ? 'Desfijar' : 'Fijar'}
            </button>
            <button onClick={handleDelete} className="btn-danger flex items-center gap-2 text-sm">
              <Trash2 className="h-4 w-4" />
              Eliminar
            </button>
          </div>
        </div>
      </div>

      {/* File upload */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-100 mb-4">Subir Archivos</h2>
        <FileUploader projectId={project.id} onUploadComplete={fetchProject} />
      </div>

      {/* Files list */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-100 mb-4">
          Archivos ({project.files?.length || 0})
        </h2>
        <FileList
          files={project.files || []}
          onFileDeleted={fetchProject}
          apiUrl={API_URL}
        />
      </div>
    </div>
  );
}

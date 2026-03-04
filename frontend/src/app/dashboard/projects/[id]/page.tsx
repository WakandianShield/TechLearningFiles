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
      <div className="spinnerCenter">
        <div className="spinner" />
      </div>
    );
  }

  if (!project) return null;

  return (
    <div
      className="animate-fade-in-up"
      style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
    >
      {/* Back button */}
      <Link
        href="/dashboard/projects"
        className="link-cyan"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}
      >
        <ArrowLeft size={16} />
        Volver a proyectos
      </Link>

      {/* Project header */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              <span
                className={getCategoryColor(project.category)}
                style={{ fontSize: '0.75rem', fontWeight: 500, padding: '0.125rem 0.5rem', borderRadius: '9999px' }}
              >
                {getCategoryLabel(project.category)}
              </span>
              {project.pinned && (
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    padding: '0.125rem 0.5rem',
                    borderRadius: '9999px',
                    background: 'rgba(255,224,102,0.1)',
                    color: 'var(--accent-yellow)',
                    border: '1px solid rgba(255,224,102,0.2)',
                  }}
                >
                  Fijado
                </span>
              )}
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  padding: '0.125rem 0.5rem',
                  borderRadius: '9999px',
                  background: project.visibility === 'PUBLIC' ? 'rgba(52,211,153,0.1)' : 'rgba(107,114,128,0.1)',
                  color: project.visibility === 'PUBLIC' ? 'var(--accent-green)' : 'var(--gray-400)',
                  border: project.visibility === 'PUBLIC' ? '1px solid rgba(52,211,153,0.2)' : '1px solid rgba(107,114,128,0.2)',
                }}
              >
                {project.visibility === 'PUBLIC' ? 'Público' : 'Privado'}
              </span>
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--gray-100)' }}>
              {sanitizeText(project.title)}
            </h1>
            {project.description && (
              <p style={{ color: 'var(--gray-400)', marginTop: '0.5rem' }}>
                {sanitizeText(project.description)}
              </p>
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', marginTop: '1rem', fontSize: '0.875rem', color: 'var(--gray-500)' }}>
              {project.subject && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <BookOpen size={16} />
                  <span>{project.subject}</span>
                </div>
              )}
              {project.semester && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <Tag size={16} />
                  <span>Semestre {project.semester}</span>
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <Calendar size={16} />
                <span>{format(new Date(project.createdAt), "d 'de' MMMM, yyyy", { locale: es })}</span>
              </div>
            </div>

            {project.tags?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginTop: '0.75rem' }}>
                {project.tags.map((tag: string) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleToggleVisibility}
              className="btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}
            >
              {project.visibility === 'PUBLIC' ? <EyeOff size={16} /> : <Eye size={16} />}
              {project.visibility === 'PUBLIC' ? 'Hacer Privado' : 'Hacer Público'}
            </button>
            <button
              onClick={handleTogglePin}
              className="btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}
            >
              {project.pinned ? <PinOff size={16} /> : <Pin size={16} />}
              {project.pinned ? 'Desfijar' : 'Fijar'}
            </button>
            <button
              onClick={handleDelete}
              className="btn-danger"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}
            >
              <Trash2 size={16} />
              Eliminar
            </button>
          </div>
        </div>
      </div>

      {/* File upload */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--gray-100)', marginBottom: '1rem' }}>
          Subir Archivos
        </h2>
        <FileUploader projectId={project.id} onUploadComplete={fetchProject} />
      </div>

      {/* Files list */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--gray-100)', marginBottom: '1rem' }}>
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

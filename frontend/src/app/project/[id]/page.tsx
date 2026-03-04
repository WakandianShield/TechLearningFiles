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
      <div className="spinnerCenter">
        <div className="spinner" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0' }}>
        <FolderOpen size={48} style={{ color: 'var(--gray-600)', margin: '0 auto 0.75rem' }} />
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--gray-300)', marginBottom: '0.5rem' }}>Proyecto no encontrado</h2>
        <p style={{ color: 'var(--gray-500)', marginBottom: '1rem' }}>Este proyecto no existe o es privado.</p>
        <Link href="/explore" className="btn-primary" style={{ display: 'inline-block' }}>
          Explorar proyectos
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Back */}
      <Link
        href="/explore"
        className="link-cyan"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}
      >
        <ArrowLeft size={16} />
        Volver a Explorar
      </Link>

      {/* Project header */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
          <span
            className={getCategoryColor(project.category)}
            style={{ fontSize: '0.75rem', fontWeight: 500, padding: '0.125rem 0.5rem', borderRadius: '9999px' }}
          >
            {getCategoryLabel(project.category)}
          </span>
        </div>

        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--gray-100)' }}>{sanitizeText(project.title)}</h1>
        {project.description && (
          <p style={{ color: 'var(--gray-400)', marginTop: '0.5rem' }}>{sanitizeText(project.description)}</p>
        )}

        {/* Author */}
        {project.author && (
          <Link
            href={`/profile/${project.author.id}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.3s' }}
          >
            <div style={{ width: '2rem', height: '2rem', borderRadius: '9999px', background: 'var(--dark-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {project.author.avatar ? (
                <img src={`${API_URL.replace('/api', '')}${project.author.avatar}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <User size={16} style={{ color: 'var(--gray-500)' }} />
              )}
            </div>
            <span style={{ fontSize: '0.875rem', color: 'var(--gray-300)' }}>
              {project.author.name}
            </span>
          </Link>
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

      {/* Files */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--gray-100)', marginBottom: '1rem' }}>
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

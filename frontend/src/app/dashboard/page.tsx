'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { getProjects, getProjectStats } from '@/lib/api';
import ProjectCard from '@/components/ProjectCard';
import Link from 'next/link';
import { Plus, FolderOpen, FileIcon, BarChart3 } from 'lucide-react';

export default function DashboardPage() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [projectsRes, statsRes] = await Promise.all([
          getProjects(),
          getProjectStats(),
        ]);
        setProjects(projectsRes.data);
        setStats(statsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="spinnerCenter">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Welcome */}
      <div>
        <h1 className="gradient-text" style={{ fontSize: '1.875rem', fontWeight: 700 }}>
          Hola, {session?.user?.name}
        </h1>
        <p style={{ color: 'var(--gray-400)', marginTop: '0.25rem' }}>
          Bienvenido a tu journey academico. Aqui puedes ver un resumen de tus proyectos.
        </p>
      </div>

      {/* Stats */}
      <div className="grid-stats">
        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative', zIndex: 1 }}>
            <div className="icon-box icon-box-md ib-blue">
              <FolderOpen size={20} style={{ color: '#60a5fa' }} />
            </div>
            <div>
              <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--gray-100)' }}>{stats?.projectCount || 0}</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--gray-400)' }}>Proyectos</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative', zIndex: 1 }}>
            <div className="icon-box icon-box-md ib-green">
              <FileIcon size={20} style={{ color: 'var(--accent-green)' }} />
            </div>
            <div>
              <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--gray-100)' }}>{stats?.fileCount || 0}</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--gray-400)' }}>Archivos</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative', zIndex: 1 }}>
            <div className="icon-box icon-box-md ib-purple">
              <BarChart3 size={20} style={{ color: 'var(--accent-purple)' }} />
            </div>
            <div>
              <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--gray-100)' }}>
                {stats?.categories?.length || 0}
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--gray-400)' }}>Categorías</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent projects */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--gray-100)' }}>Proyectos Recientes</h2>
          <Link href="/dashboard/projects/new" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
            <Plus size={16} />
            Nuevo Proyecto
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
            <FolderOpen size={48} style={{ color: 'var(--gray-600)', margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 500, color: 'var(--gray-200)' }}>No hay proyectos aún</h3>
            <p style={{ color: 'var(--gray-500)', marginTop: '0.25rem', marginBottom: '1rem' }}>
              Comienza creando tu primer proyecto académico.
            </p>
            <Link href="/dashboard/projects/new" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={16} />
              Crear Proyecto
            </Link>
          </div>
        ) : (
          <div className="grid-responsive-3">
            {projects.slice(0, 6).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}

        {projects.length > 6 && (
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <Link href="/dashboard/projects" className="btn-secondary" style={{ fontSize: '0.875rem' }}>
              Ver todos los proyectos
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

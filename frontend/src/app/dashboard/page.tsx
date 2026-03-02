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
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent-cyan"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold gradient-text">
          Hola, {session?.user?.name}
        </h1>
        <p className="text-gray-400 mt-1">
          Bienvenido a tu journey academico. Aqui puedes ver un resumen de tus proyectos.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3 relative z-10">
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <FolderOpen className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-100">{stats?.projectCount || 0}</p>
              <p className="text-sm text-gray-400">Proyectos</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3 relative z-10">
            <div className="p-2.5 rounded-xl bg-accent-green/10 border border-accent-green/20">
              <FileIcon className="h-5 w-5 text-accent-green" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-100">{stats?.fileCount || 0}</p>
              <p className="text-sm text-gray-400">Archivos</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3 relative z-10">
            <div className="p-2.5 rounded-xl bg-accent-purple/10 border border-accent-purple/20">
              <BarChart3 className="h-5 w-5 text-accent-purple" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-100">
                {stats?.categories?.length || 0}
              </p>
              <p className="text-sm text-gray-400">Categorías</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent projects */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-100">Proyectos Recientes</h2>
          <Link href="/dashboard/projects/new" className="btn-primary flex items-center gap-2 text-sm">
            <Plus className="h-4 w-4" />
            Nuevo Proyecto
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="card p-12 text-center">
            <FolderOpen className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-200">No hay proyectos aún</h3>
            <p className="text-gray-500 mt-1 mb-4">
              Comienza creando tu primer proyecto académico.
            </p>
            <Link href="/dashboard/projects/new" className="btn-primary inline-flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Crear Proyecto
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.slice(0, 6).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}

        {projects.length > 6 && (
          <div className="text-center mt-6">
            <Link href="/dashboard/projects" className="btn-secondary text-sm">
              Ver todos los proyectos
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { getProjects } from '@/lib/api';
import ProjectCard from '@/components/ProjectCard';
import Link from 'next/link';
import { Plus, Search, Filter } from 'lucide-react';
import { getCategoryLabel } from '@/lib/utils';

const CATEGORIES = ['PROGRAMMING', 'MATH', 'SCIENCE', 'DESIGN', 'WRITING', 'RESEARCH', 'PRESENTATION', 'LAB', 'OTHER'];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchProjects();
  }, [selectedCategory]);

  async function fetchProjects() {
    setLoading(true);
    try {
      const res = await getProjects(selectedCategory || undefined);
      setProjects(res.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase()) ||
    p.subject?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Mis Proyectos</h1>
        <Link href="/dashboard/projects/new" className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="h-4 w-4" />
          Nuevo Proyecto
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            className="input pl-10"
            placeholder="Buscar proyectos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <select
            className="input pl-10 pr-8 appearance-none"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{getCategoryLabel(cat)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Project grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-gray-600">
            {search || selectedCategory
              ? 'No se encontraron proyectos con esos filtros.'
              : 'No tienes proyectos aún. ¡Crea el primero!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}

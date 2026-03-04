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
    <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 700 }}>Mis Proyectos</h1>
        <Link href="/dashboard/projects/new" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
          <Plus size={16} />
          Nuevo Proyecto
        </Link>
      </div>

      {/* Filters */}
      <div className="flex-col-sm-row" style={{ gap: '0.75rem' }}>
        <div className="search-wrapper" style={{ flex: 1 }}>
          <Search className="search-icon" size={16} />
          <input
            type="text"
            className="input"
            style={{ paddingLeft: '2.5rem' }}
            placeholder="Buscar proyectos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="search-wrapper">
          <Filter className="search-icon" size={16} />
          <select
            className="input"
            style={{ width: 'auto', paddingLeft: '2.5rem', appearance: 'none' }}
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
        <div className="spinnerCenter">
          <div className="spinner"></div>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--gray-400)' }}>
            {search || selectedCategory
              ? 'No se encontraron proyectos con esos filtros.'
              : 'No tienes proyectos aún. ¡Crea el primero!'}
          </p>
        </div>
      ) : (
        <div className="grid-responsive-3">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}

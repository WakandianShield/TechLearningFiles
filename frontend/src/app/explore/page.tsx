'use client';

import { useEffect, useState } from 'react';
import { exploreProjects, searchUsers } from '@/lib/api';
import ProjectCard from '@/components/ProjectCard';
import { getCategoryLabel } from '@/lib/utils';
import { Search, Filter, Users, FolderOpen, Sparkles } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = ['ALL', 'PROGRAMMING', 'MATH', 'SCIENCE', 'DESIGN', 'WRITING', 'RESEARCH', 'PRESENTATION', 'LAB', 'OTHER'];

export default function ExplorePage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');
  const [tab, setTab] = useState<'projects' | 'users'>('projects');

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (category !== 'ALL') params.category = category;
      if (search.trim()) params.search = search.trim();
      const res = await exploreProjects(params);
      setProjects(res.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    if (!search.trim()) {
      setUsers([]);
      return;
    }
    setLoading(true);
    try {
      const res = await searchUsers(search.trim());
      setUsers(res.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tab === 'projects') {
      fetchProjects();
    } else {
      fetchUsers();
    }
  }, [category, tab]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === 'projects') {
      fetchProjects();
    } else {
      fetchUsers();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2 flex items-center justify-center gap-3">
          <Sparkles className="h-8 w-8 text-accent-cyan" />
          Explorar
        </h1>
        <p className="text-gray-400">Descubre proyectos públicos y personas de la comunidad</p>
      </div>

      {/* Search & Tabs */}
      <div className="card p-4">
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              className="input pl-10"
              placeholder={tab === 'projects' ? 'Buscar proyectos...' : 'Buscar usuarios...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary">
            Buscar
          </button>
        </form>

        <div className="flex gap-2">
          <button
            onClick={() => setTab('projects')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === 'projects'
                ? 'bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/30'
                : 'bg-white/5 text-gray-400 border border-white/10 hover:border-white/20'
            }`}
          >
            <FolderOpen className="h-4 w-4" />
            Proyectos
          </button>
          <button
            onClick={() => setTab('users')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === 'users'
                ? 'bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/30'
                : 'bg-white/5 text-gray-400 border border-white/10 hover:border-white/20'
            }`}
          >
            <Users className="h-4 w-4" />
            Usuarios
          </button>
        </div>
      </div>

      {/* Category filter (projects only) */}
      {tab === 'projects' && (
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                category === cat
                  ? 'bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/30'
                  : 'bg-white/5 text-gray-400 border border-white/10 hover:border-white/20'
              }`}
            >
              {cat === 'ALL' ? 'Todos' : getCategoryLabel(cat)}
            </button>
          ))}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-cyan"></div>
        </div>
      )}

      {/* Projects grid */}
      {!loading && tab === 'projects' && (
        <>
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <Link key={project.id} href={`/project/${project.id}`}>
                  <ProjectCard project={project} isPublic />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <FolderOpen className="h-12 w-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No se encontraron proyectos públicos.</p>
            </div>
          )}
        </>
      )}

      {/* Users list */}
      {!loading && tab === 'users' && (
        <>
          {users.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map((user) => (
                <Link key={user.id} href={`/profile/${user.id}`}>
                  <div className="card p-4 hover:border-accent-cyan/30 transition-all group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-dark-700 flex items-center justify-center overflow-hidden border border-white/10">
                        {user.avatar ? (
                          <img src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/users/avatar/${user.avatar}`} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Users className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-200 group-hover:text-accent-cyan transition-colors">{user.name}</p>
                        {user.bio && <p className="text-xs text-gray-500 line-clamp-1">{user.bio}</p>}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Users className="h-12 w-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">
                {search.trim() ? 'No se encontraron usuarios.' : 'Escribe un nombre para buscar usuarios.'}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

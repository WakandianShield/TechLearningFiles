'use client';

import { useEffect, useState } from 'react';
import { exploreProjects, searchUsers } from '@/lib/api';
import ProjectCard from '@/components/ProjectCard';
import { getCategoryLabel } from '@/lib/utils';
import { Search, Users, FolderOpen, Sparkles } from 'lucide-react';
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
    <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 className="gradient-text" style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
          <Sparkles size={32} style={{ color: 'var(--accent-cyan)' }} />
          Explorar
        </h1>
        <p style={{ color: 'var(--gray-400)' }}>Descubre proyectos públicos y personas de la comunidad</p>
      </div>

      {/* Search & Tabs */}
      <div className="card" style={{ padding: '1rem' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <div className="search-wrapper" style={{ flex: 1 }}>
            <Search className="search-icon" size={16} />
            <input
              type="text"
              className="input"
              style={{ paddingLeft: '2.5rem' }}
              placeholder={tab === 'projects' ? 'Buscar proyectos...' : 'Buscar usuarios...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary">
            Buscar
          </button>
        </form>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setTab('projects')}
            className={tab === 'projects' ? 'tab-btn tab-active' : 'tab-btn tab-inactive'}
          >
            <FolderOpen size={16} />
            Proyectos
          </button>
          <button
            onClick={() => setTab('users')}
            className={tab === 'users' ? 'tab-btn tab-active' : 'tab-btn tab-inactive'}
          >
            <Users size={16} />
            Usuarios
          </button>
        </div>
      </div>

      {/* Category filter (projects only) */}
      {tab === 'projects' && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={category === cat ? 'filter-pill filter-pill-active' : 'filter-pill filter-pill-inactive'}
            >
              {cat === 'ALL' ? 'Todos' : getCategoryLabel(cat)}
            </button>
          ))}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="spinnerCenter">
          <div className="spinner" style={{ width: '2rem', height: '2rem' }} />
        </div>
      )}

      {/* Projects grid */}
      {!loading && tab === 'projects' && (
        <>
          {projects.length > 0 ? (
            <div className="grid-responsive-3">
              {projects.map((project) => (
                <Link key={project.id} href={`/project/${project.id}`}>
                  <ProjectCard project={project} isPublic />
                </Link>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <FolderOpen size={48} style={{ color: 'var(--gray-600)', margin: '0 auto 0.75rem' }} />
              <p style={{ color: 'var(--gray-400)' }}>No se encontraron proyectos públicos.</p>
            </div>
          )}
        </>
      )}

      {/* Users list */}
      {!loading && tab === 'users' && (
        <>
          {users.length > 0 ? (
            <div className="grid-responsive-3">
              {users.map((user) => (
                <Link key={user.id} href={`/profile/${user.id}`}>
                  <div className="card" style={{ padding: '1rem', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '3rem', height: '3rem', borderRadius: '9999px', background: 'var(--dark-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                        {user.avatar ? (
                          <img src={`${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api').replace('/api', '')}${user.avatar}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <Users size={20} style={{ color: 'var(--gray-500)' }} />
                        )}
                      </div>
                      <div>
                        <p style={{ fontWeight: 500, color: 'var(--gray-200)' }}>{user.name}</p>
                        {user.bio && <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.bio}</p>}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <Users size={48} style={{ color: 'var(--gray-600)', margin: '0 auto 0.75rem' }} />
              <p style={{ color: 'var(--gray-400)' }}>
                {search.trim() ? 'No se encontraron usuarios.' : 'Escribe un nombre para buscar usuarios.'}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

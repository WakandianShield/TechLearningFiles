'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getPublicProfile, getPublicUserProjects } from '@/lib/api';
import ProjectCard from '@/components/ProjectCard';
import { getCategoryLabel } from '@/lib/utils';
import { User, Calendar, Globe, FolderOpen, Github, Linkedin, Twitter, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
const CATEGORIES = ['ALL', 'PROGRAMMING', 'MATH', 'SCIENCE', 'DESIGN', 'WRITING', 'RESEARCH', 'PRESENTATION', 'LAB', 'OTHER'];

const SOCIAL_ICONS: Record<string, any> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
};

export default function PublicProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('ALL');

  useEffect(() => {
    async function fetch() {
      try {
        const [profileRes] = await Promise.all([
          getPublicProfile(id as string),
        ]);
        setProfile(profileRes.data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [id]);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const params = category !== 'ALL' ? category : undefined;
        const res = await getPublicUserProjects(id as string, params);
        setProjects(res.data);
      } catch (error) {
        console.error('Error:', error);
      }
    }
    if (id) fetchProjects();
  }, [id, category]);

  if (loading) {
    return (
      <div className="spinnerCenter">
        <div className="spinner" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0' }}>
        <User size={48} style={{ color: 'var(--gray-600)', margin: '0 auto 0.75rem' }} />
        <p style={{ color: 'var(--gray-400)' }}>Usuario no encontrado.</p>
      </div>
    );
  }

  const socialLinks = profile.socialLinks || {};

  return (
    <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Banner + Avatar */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div
          className="banner-gradient banner-xl"
          style={profile.banner ? { backgroundImage: `url(${API_URL.replace('/api', '')}${profile.banner})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
        >
          <div className="banner-overlay" />
        </div>
        <div style={{ padding: '0 1.5rem 1.5rem', marginTop: '-3.5rem', position: 'relative' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="avatar-xl">
              {profile.avatar ? (
                <img src={`${API_URL.replace('/api', '')}${profile.avatar}`} alt="Avatar" className="avatar-img" />
              ) : (
                <User size={48} style={{ color: 'var(--gray-400)' }} />
              )}
            </div>
            <div style={{ flex: 1, marginBottom: '0.5rem' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--gray-100)' }}>{profile.name}</h1>
              {profile.bio && <p style={{ color: 'var(--gray-400)', marginTop: '0.25rem' }}>{profile.bio}</p>}
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <Calendar size={16} />
                  <span>Desde {format(new Date(profile.createdAt), "MMMM yyyy", { locale: es })}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <FolderOpen size={16} />
                  <span>{profile._count?.projects || 0} proyectos públicos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Links */}
      {(profile.website || Object.keys(socialLinks).length > 0) && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {profile.website && (
            <a
              href={profile.website}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              style={{ borderRadius: '9999px', padding: '0.375rem 0.75rem' }}
            >
              <Globe size={14} />
              Website
            </a>
          )}
          {Object.entries(socialLinks).map(([platform, url]) => {
            const Icon = SOCIAL_ICONS[platform] || ExternalLink;
            return (
              <a
                key={platform}
                href={url as string}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                style={{ borderRadius: '9999px', padding: '0.375rem 0.75rem', textTransform: 'capitalize' }}
              >
                <Icon size={14} />
                {platform}
              </a>
            );
          })}
        </div>
      )}

      {/* Projects section */}
      <div>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--gray-100)', marginBottom: '1rem' }}>Proyectos Públicos</h2>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
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

        {projects.length > 0 ? (
          <div className="grid-responsive-3">
            {projects.map((project) => (
              <Link key={project.id} href={`/project/${project.id}`}>
                <ProjectCard project={project} isPublic />
              </Link>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <FolderOpen size={40} style={{ color: 'var(--gray-600)', margin: '0 auto 0.75rem' }} />
            <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>No hay proyectos públicos.</p>
          </div>
        )}
      </div>
    </div>
  );
}

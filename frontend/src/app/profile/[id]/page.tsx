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
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent-cyan"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-20">
        <User className="h-12 w-12 text-gray-600 mx-auto mb-3" />
        <p className="text-gray-400">Usuario no encontrado.</p>
      </div>
    );
  }

  const socialLinks = profile.socialLinks || {};

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Banner + Avatar */}
      <div className="card overflow-hidden">
        <div
          className="h-48 bg-gradient-to-r from-accent-cyan/20 via-accent-purple/20 to-accent-blue/20 relative"
          style={profile.banner ? { backgroundImage: `url(${API_URL.replace('/api', '')}${profile.banner})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent" />
        </div>
        <div className="px-6 pb-6 -mt-14 relative">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="w-28 h-28 rounded-full bg-dark-700 border-4 border-dark-900 flex items-center justify-center overflow-hidden shadow-lg">
              {profile.avatar ? (
                <img src={`${API_URL.replace('/api', '')}${profile.avatar}`} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="h-12 w-12 text-gray-400" />
              )}
            </div>
            <div className="flex-1 mb-2">
              <h1 className="text-2xl font-bold text-gray-100">{profile.name}</h1>
              {profile.bio && <p className="text-gray-400 mt-1">{profile.bio}</p>}
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>Desde {format(new Date(profile.createdAt), "MMMM yyyy", { locale: es })}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FolderOpen className="h-4 w-4" />
                  <span>{profile._count?.projects || 0} proyectos públicos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Links */}
      {(profile.website || Object.keys(socialLinks).length > 0) && (
        <div className="flex flex-wrap gap-2">
          {profile.website && (
            <a
              href={profile.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:border-accent-cyan/30 hover:text-accent-cyan transition-all text-sm"
            >
              <Globe className="h-3.5 w-3.5" />
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
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:border-accent-cyan/30 hover:text-accent-cyan transition-all text-sm capitalize"
              >
                <Icon className="h-3.5 w-3.5" />
                {platform}
              </a>
            );
          })}
        </div>
      )}

      {/* Projects section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-100 mb-4">Proyectos Públicos</h2>

        <div className="flex flex-wrap gap-2 mb-4">
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

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <Link key={project.id} href={`/project/${project.id}`}>
                <ProjectCard project={project} isPublic />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FolderOpen className="h-10 w-10 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No hay proyectos públicos.</p>
          </div>
        )}
      </div>
    </div>
  );
}

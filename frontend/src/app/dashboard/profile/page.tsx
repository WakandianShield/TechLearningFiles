'use client';

import { useEffect, useState } from 'react';
import { getProfile } from '@/lib/api';
import { useSession } from 'next-auth/react';
import { User, Mail, Calendar, FolderOpen, Globe, Settings, Github, Linkedin, Twitter, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const SOCIAL_ICONS: Record<string, any> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
};

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await getProfile();
        setProfile(res.data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent-cyan"></div>
      </div>
    );
  }

  const socialLinks = profile?.socialLinks || {};

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in-up">
      {/* Banner + Avatar */}
      <div className="card overflow-hidden">
        <div 
          className="h-40 bg-gradient-to-r from-accent-cyan/20 via-accent-purple/20 to-accent-blue/20 relative"
          style={profile?.banner ? { backgroundImage: `url(${API_URL.replace('/api', '')}${profile.banner})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent" />
        </div>
        <div className="px-6 pb-6 -mt-12 relative">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="flex items-end gap-4">
              <div className="w-24 h-24 rounded-full bg-dark-700 border-4 border-dark-900 flex items-center justify-center overflow-hidden shadow-lg">
                {profile?.avatar ? (
                  <img src={`${API_URL.replace('/api', '')}${profile.avatar}`} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="h-10 w-10 text-gray-400" />
                )}
              </div>
              <div className="mb-1">
                <h1 className="text-2xl font-bold text-gray-100">{profile?.name}</h1>
                {profile?.bio && <p className="text-gray-400 text-sm mt-0.5">{profile.bio}</p>}
              </div>
            </div>
            <Link href="/dashboard/settings" className="btn-secondary flex items-center gap-2 text-sm self-start sm:self-auto">
              <Settings className="h-4 w-4" />
              Editar Perfil
            </Link>
          </div>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent-cyan/10 flex items-center justify-center">
            <Mail className="h-5 w-5 text-accent-cyan" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-500">Email</p>
            <p className="text-sm text-gray-200 truncate">{profile?.email}</p>
          </div>
        </div>

        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent-green/10 flex items-center justify-center">
            <Calendar className="h-5 w-5 text-accent-green" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Miembro desde</p>
            <p className="text-sm text-gray-200">
              {profile?.createdAt && format(new Date(profile.createdAt), "MMMM yyyy", { locale: es })}
            </p>
          </div>
        </div>

        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent-purple/10 flex items-center justify-center">
            <FolderOpen className="h-5 w-5 text-accent-purple" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Proyectos</p>
            <p className="text-sm text-gray-200">{profile?._count?.projects || 0} creados</p>
          </div>
        </div>
      </div>

      {/* Website & Social Links */}
      {(profile?.website || Object.keys(socialLinks).length > 0) && (
        <div className="card p-6">
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Enlaces</h3>
          <div className="flex flex-wrap gap-3">
            {profile?.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:border-accent-cyan/30 hover:text-accent-cyan transition-all text-sm"
              >
                <Globe className="h-4 w-4" />
                Website
                <ExternalLink className="h-3 w-3" />
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
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:border-accent-cyan/30 hover:text-accent-cyan transition-all text-sm capitalize"
                >
                  <Icon className="h-4 w-4" />
                  {platform}
                  <ExternalLink className="h-3 w-3" />
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

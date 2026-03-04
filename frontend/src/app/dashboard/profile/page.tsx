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
      <div className="spinnerCenter">
        <div className="spinner" />
      </div>
    );
  }

  const socialLinks = profile?.socialLinks || {};

  return (
    <div
      className="animate-fade-in-up"
      style={{ maxWidth: '48rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
    >
      {/* Banner + Avatar */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div
          className="banner-gradient"
          style={profile?.banner
            ? { backgroundImage: `url(${API_URL.replace('/api', '')}${profile.banner})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : {}
          }
        >
          <div className="banner-overlay" />
        </div>
        <div style={{ padding: '0 1.5rem 1.5rem', marginTop: '-3rem', position: 'relative' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem' }}>
              <div className="avatar-lg">
                {profile?.avatar ? (
                  <img
                    src={`${API_URL.replace('/api', '')}${profile.avatar}`}
                    alt="Avatar"
                    className="avatar-img"
                  />
                ) : (
                  <User size={40} style={{ color: 'var(--gray-400)' }} />
                )}
              </div>
              <div style={{ marginBottom: '0.25rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--gray-100)' }}>
                  {profile?.name}
                </h1>
                {profile?.bio && (
                  <p style={{ color: 'var(--gray-400)', fontSize: '0.875rem', marginTop: '0.125rem' }}>
                    {profile.bio}
                  </p>
                )}
              </div>
            </div>
            <Link
              href="/dashboard/settings"
              className="btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}
            >
              <Settings size={16} />
              Editar Perfil
            </Link>
          </div>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid-stats">
        <div className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="icon-box icon-box-sm ib-cyan">
            <Mail size={20} style={{ color: 'var(--accent-cyan)' }} />
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>Email</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--gray-200)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {profile?.email}
            </p>
          </div>
        </div>

        <div className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="icon-box icon-box-sm ib-green">
            <Calendar size={20} style={{ color: 'var(--accent-green)' }} />
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>Miembro desde</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--gray-200)' }}>
              {profile?.createdAt && format(new Date(profile.createdAt), "MMMM yyyy", { locale: es })}
            </p>
          </div>
        </div>

        <div className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="icon-box icon-box-sm ib-purple">
            <FolderOpen size={20} style={{ color: 'var(--accent-purple)' }} />
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>Proyectos</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--gray-200)' }}>
              {profile?._count?.projects || 0} creados
            </p>
          </div>
        </div>
      </div>

      {/* Website & Social Links */}
      {(profile?.website || Object.keys(socialLinks).length > 0) && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--gray-300)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
            Enlaces
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {profile?.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                <Globe size={16} />
                Website
                <ExternalLink size={12} />
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
                  style={{ textTransform: 'capitalize' }}
                >
                  <Icon size={16} />
                  {platform}
                  <ExternalLink size={12} />
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

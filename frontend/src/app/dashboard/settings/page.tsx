'use client';

import { useEffect, useState, useRef } from 'react';
import { getProfile, updateProfile, uploadAvatar, uploadBanner } from '@/lib/api';
import { sanitizeText } from '@/lib/sanitize';
import { Loader2, User, Camera, Image, Github, Linkedin, Twitter, Globe, Plus, X, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const SOCIAL_PLATFORMS = [
  { key: 'github', label: 'GitHub', icon: Github, placeholder: 'https://github.com/usuario' },
  { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, placeholder: 'https://linkedin.com/in/usuario' },
  { key: 'twitter', label: 'Twitter / X', icon: Twitter, placeholder: 'https://twitter.com/usuario' },
];

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [bannerHover, setBannerHover] = useState(false);

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [website, setWebsite] = useState('');
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({});

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await getProfile();
        const data = res.data;
        setProfile(data);
        setName(data.name || '');
        setBio(data.bio || '');
        setWebsite(data.website || '');
        setSocialLinks(data.socialLinks || {});
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });

    try {
      const cleanSocial = Object.fromEntries(
        Object.entries(socialLinks).filter(([_, v]) => v.trim() !== '')
      );
      await updateProfile({
        name: sanitizeText(name).trim(),
        bio: sanitizeText(bio).trim(),
        website: website.trim() || undefined,
        socialLinks: Object.keys(cleanSocial).length > 0 ? cleanSocial : undefined,
      });
      setMessage({ text: 'Perfil actualizado correctamente.', type: 'success' });
    } catch (error) {
      setMessage({ text: 'Error al actualizar el perfil.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const res = await uploadAvatar(file);
      setProfile((prev: any) => ({ ...prev, avatar: res.data.avatar }));
      setMessage({ text: 'Avatar actualizado.', type: 'success' });
    } catch {
      setMessage({ text: 'Error al subir avatar.', type: 'error' });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingBanner(true);
    try {
      const res = await uploadBanner(file);
      setProfile((prev: any) => ({ ...prev, banner: res.data.banner }));
      setMessage({ text: 'Banner actualizado.', type: 'success' });
    } catch {
      setMessage({ text: 'Error al subir banner.', type: 'error' });
    } finally {
      setUploadingBanner(false);
    }
  };

  if (loading) {
    return (
      <div className="spinnerCenter">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div
      className="animate-fade-in-up"
      style={{ maxWidth: '48rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link href="/dashboard/profile" className="link-cyan">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 700 }}>Configuración</h1>
      </div>

      {/* Banner & Avatar */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ position: 'relative' }}>
          <div
            className="banner-gradient banner-tall"
            style={profile?.banner
              ? { backgroundImage: `url(${API_URL.replace('/api', '')}${profile.banner})`, backgroundSize: 'cover', backgroundPosition: 'center' }
              : {}
            }
            onMouseEnter={() => setBannerHover(true)}
            onMouseLeave={() => setBannerHover(false)}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.4)',
                opacity: bannerHover ? 1 : 0,
                transition: 'opacity 0.3s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <button
                onClick={() => bannerInputRef.current?.click()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  background: 'rgba(0,0,0,0.8)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.2)',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                }}
                disabled={uploadingBanner}
              >
                {uploadingBanner ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Image size={16} />}
                Cambiar Banner
              </button>
            </div>
          </div>
          <input ref={bannerInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleBannerUpload} />
        </div>

        <div style={{ padding: '0 1.5rem 1.5rem', marginTop: '-3rem', position: 'relative' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
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
            <button
              onClick={() => avatarInputRef.current?.click()}
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '2rem',
                height: '2rem',
                borderRadius: '50%',
                background: 'var(--dark-800)',
                border: '2px solid var(--dark-900)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--gray-400)',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
              disabled={uploadingAvatar}
            >
              {uploadingAvatar ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Camera size={14} />}
            </button>
            <input ref={avatarInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarUpload} />
          </div>
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <div className={message.type === 'error' ? 'msg-error' : 'msg-success'}>
          {message.text}
        </div>
      )}

      {/* Profile form */}
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--gray-100)' }}>Información personal</h3>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--gray-300)', marginBottom: '0.25rem' }}>
              Nombre
            </label>
            <input
              type="text"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--gray-300)', marginBottom: '0.25rem' }}>
              Bio
            </label>
            <textarea
              className="input"
              rows={3}
              placeholder="Cuéntanos un poco sobre ti..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--gray-300)', marginBottom: '0.25rem' }}>
              <Globe size={16} />
              Sitio Web
            </label>
            <input
              type="url"
              className="input"
              placeholder="https://tusitio.com"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--gray-100)' }}>Redes Sociales</h3>

          {SOCIAL_PLATFORMS.map(({ key, label, icon: Icon, placeholder }) => (
            <div key={key}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--gray-300)', marginBottom: '0.25rem' }}>
                <Icon size={16} />
                {label}
              </label>
              <input
                type="url"
                className="input"
                placeholder={placeholder}
                value={socialLinks[key] || ''}
                onChange={(e) => setSocialLinks((prev) => ({ ...prev, [key]: e.target.value }))}
              />
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} disabled={saving}>
            {saving && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
          <Link href="/dashboard/profile" className="btn-secondary">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}

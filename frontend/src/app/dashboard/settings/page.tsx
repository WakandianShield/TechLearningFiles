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
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent-cyan"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in-up">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/profile" className="text-gray-400 hover:text-accent-cyan transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold gradient-text">Configuración</h1>
      </div>

      {/* Banner & Avatar */}
      <div className="card overflow-hidden">
        <div className="relative group">
          <div
            className="h-44 bg-gradient-to-r from-accent-cyan/20 via-accent-purple/20 to-accent-blue/20 relative"
            style={profile?.banner ? { backgroundImage: `url(${API_URL.replace('/api', '')}${profile.banner})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
          >
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                onClick={() => bannerInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-900/80 text-white border border-white/20 hover:border-accent-cyan/40 transition-all text-sm"
                disabled={uploadingBanner}
              >
                {uploadingBanner ? <Loader2 className="h-4 w-4 animate-spin" /> : <Image className="h-4 w-4" />}
                Cambiar Banner
              </button>
            </div>
          </div>
          <input ref={bannerInputRef} type="file" accept="image/*" className="hidden" onChange={handleBannerUpload} />
        </div>

        <div className="px-6 pb-6 -mt-12 relative">
          <div className="relative inline-block group/avatar">
            <div className="w-24 h-24 rounded-full bg-dark-700 border-4 border-dark-900 flex items-center justify-center overflow-hidden shadow-lg">
              {profile?.avatar ? (
                <img src={`${API_URL.replace('/api', '')}${profile.avatar}`} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="h-10 w-10 text-gray-400" />
              )}
            </div>
            <button
              onClick={() => avatarInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-dark-800 border-2 border-dark-900 flex items-center justify-center text-gray-400 hover:text-accent-cyan hover:border-accent-cyan/40 transition-all"
              disabled={uploadingAvatar}
            >
              {uploadingAvatar ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Camera className="h-3.5 w-3.5" />}
            </button>
            <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
          </div>
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`p-3 rounded-lg text-sm ${
          message.type === 'error'
            ? 'bg-accent-red/10 border border-accent-red/30 text-accent-red'
            : 'bg-accent-green/10 border border-accent-green/30 text-accent-green'
        }`}>
          {message.text}
        </div>
      )}

      {/* Profile form */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="card p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-100">Información personal</h3>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Nombre</label>
            <input
              type="text"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Bio</label>
            <textarea
              className="input"
              rows={3}
              placeholder="Cuéntanos un poco sobre ti..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              <Globe className="h-4 w-4 inline mr-1" />
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
        <div className="card p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-100">Redes Sociales</h3>

          {SOCIAL_PLATFORMS.map(({ key, label, icon: Icon, placeholder }) => (
            <div key={key}>
              <label className="flex items-center gap-1.5 text-sm font-medium text-gray-300 mb-1">
                <Icon className="h-4 w-4" />
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

        <div className="flex gap-3">
          <button type="submit" className="btn-primary flex items-center gap-2" disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
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
